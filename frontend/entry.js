let express = require('express')
let app = express()
let server = require('http').Server(app)
let io = require('socket.io')(server)
let path = require('path')
let fs = require('fs')

// max message list length threshold, write into file when archive this
const MESSAGE_THRESHOLD = 400
const ERROR_MESSAGE = ['Format Invalid', 'Miss ', 'Must Join this room first', 'Unsupported Type, Choose between 0~3', 'Room not exists', 'Permission Denied']

// buffer area, msg queue, will load into log.txt
let room_msg_list = {}
let room_creater_list = {}
// buffer area, live user in a room, for now , just the amount not user list
let room_audience_list = {}
// signals server will fire
let fire_signals = ['Error', 'updateMessage', 'loadHistory', 'getAudience'] // wtf? whether space needed at the head of bracket or not!?
// signals server will listening
let listening_signals = ['connection', 'disconnecting', 'join', 'sendMessage', 'getAudience', 'kickout', 'endRoom']

function readFile (roomname, limit = MESSAGE_THRESHOLD) {
    let list = []
    const readStream = fs.createReadStream(path.join('static', 'rooms', roomname, 'log.txt'))
    readStream.on('data', (data) => {
        let info = ''
        let amount = 0
        info = info + data
        let index = info.indexof('\n')
        while (index > -1 && amount < limit) {
            amount++
            const line = info.substring(0, index)
            info = info.substring(index + 1)
            index = info.indexOf('\n')
            // list.push(line);
            list.push(line)// contain time & msg , msg need to convert to json obj
        }
    })
    return list
}

function writeFile (room_name, clear = false) {
    file_name = path.join('.', room_name, 'log.txt')
    if (fs.existsSync(file_name)) {
        fs.open(file_name, 'a', (err, fd) => {
            console.log('start')
            if (err) {
                throw err
            }
            for (let i = 0; i <  MESSAGE_THRESHOLD; i++) {
                fs.writeSync(fd, room_msg_list[room_name][i] + '\r\n')
            }
            fs.close(fd, (err) => {
                if (err) {
                    throw err
                }
            })
            if (clear === true) {
                clearRoom(room_name)
            } else {
                room_msg_list[room_name] = room_msg_list[room_name].slice(MESSAGE_THRESHOLD)
            }
            console.log('finish')
        })
    } else {
        throw Error('file not exists')
    }
}

function clearRoom (room_name) {
    for (let user in room_audience_list[room_name]) {
        kickoutUser(room_name, user)
    }
    delete room_audience_list[room_name]
    delete room_creater_list[room_name]
    delete room_msg_list[room_name]
}

function kickoutUser (room_name, user) {
    let type = typeof user
    if (room_audience_list[room_name]) {
        if (type === 'string' && room_audience_list[room_name][user]) { // using user_id
            room_audience_list[room_name][user].leave(room_name)
            room_audience_list[room_name].splice(user, 1)
            console.log(user + ' was kicked out from ' + room_name)
        } else if (type === 'object') { // using raw socket instance
            console.log('user.id : %s', user.id)
            for (let item in room_audience_list[room_name]) {
                console.log('here we get ' + item + '<<<<<<')
                console.log('socket id : ' + room_audience_list[room_name][item].id)
                if (room_audience_list[room_name][item].id === user.id) {
                    console.log('ming zhong %s', item)
                    kickoutUser(room_name, item)
                    break
                } else {
                    console.log('miss' + item)
                }
            }
        }
    }
}


function isPackValid (data) {
    return isValid(data.room_name) &&
            isValid(data.content, 'object') &&
            isValid(data.type, 'number') &&
            isValid(data.id)
}

function isValid (content, type = 'string') {
    return content !== undefined && content !== null && typeof content === type && content !== ''
}

function logMessage (room_name, content, type, signal = 'sendMessage') {
    const DATE = new Date()
    let json_data = JSON.stringify({
        // TODO user id later
        'room_name': room_name,
        'content': content,
        'type': type,
        'signal': isValid(signal) ? signal : signal,
        'time': DATE.getTime() // get mileseconds from 1970.1.1 to now
    })
    room_msg_list[room_name].push(json_data)
    if (room_msg_list[room_name].length > MESSAGE_THRESHOLD) { // if it is filled, dump into log.txt
        writeFile(room_name)
    }
}
// TODO: param log's order
function sendMessage (socket, signal, content, type = 0, room_name = '', log = false) {
    let error = false
    switch (type) {
        case 0: // send to himself
            socket.emit(signal, content)
            break
        case 1: // send to everyone but himself
            if (isValid(room_name)) {
                socket.broadcast.in(room_name).emit(signal, content)
            } else {
                error = true
                socket.emit(fire_signals[0], ERROR_MESSAGE[1])
            }
            break
        case 2: // send to everyone in the room_name
            if (isValid(room_name)) {
                io.sockets.in(room_name).emit(signal, content)
            } else {
                error = true
                socket.emit(fire_signals[0], ERROR_MESSAGE[1])
            }
            break
        case 3: // send to everyone connected to server
            io.sockets.emit(signal, content)
            break
        // TODO: add a case: send to THE user (silence) (get socket from his id)
        default:
            error = true
            socket.emit(fire_signals[0], ERROR_MESSAGE[2])
    }
    if (!error && log) { // error message is for devloper, no need to expose to actuall user
        try {
            logMessage(room_name, content, type, signal)
        } catch (Error) {
            socket.emit(fire_signals[0], ERROR_MESSAGE[4])
        }
    }
}

// on connect
io.on(listening_signals[0], (socket) => {
    // on join
    socket.on(listening_signals[2], (data) => {
        if (isValid(data.room_name) && isValid(data.id)) {
            if (!room_creater_list[data.room_name]) {
                room_creater_list[data.room_name] = socket // save the creater to ask for history
                room_audience_list[data.room_name] = []
                room_msg_list[data.room_name] = []
                console.log('create room: %s by %s', data.room_name, data.id)
            }
            socket.join(data.room_name, () => {
                console.log(data.id + ' has joined : ' + data.room_name + 'socket : ' + socket.id)
                // push this socket into audience list via its id
                room_audience_list[data.room_name][data.id] = socket
                // ask for history from creater
                sendMessage(room_creater_list[data.room_name], fire_signals[2], data.id)
            })
            // on sendMessage
            socket.on(listening_signals[3], (data) => {
                console.log('sendMessage')
                // TODO: is it necessary to check all of them ?
                if (isPackValid(data)) {
                    if (isValid(data.to)) {
                        const sock = room_audience_list[data.room_name][data.to]
                        sendMessage(sock, fire_signals[1], data.content, 0, data.room_name)
                    } else {
                        sendMessage(socket, fire_signals[1], data.content, data.type, data.room_name, true)
                    }
                } else {
                    sendMessage(socket, fire_signals[0], ERROR_MESSAGE[0])
                }
            })
            // on getAudience
            socket.on(listening_signals[4], (data) => {
                // update audience amount(or list)
                if (isValid(data.room_name)) {
                    let amount = 0
                    for (let i in room_audience_list[data.room_name]) {
                        amount++
                    }
                    console.log(amount)
                    sendMessage(socket, fire_signals[3], amount, 2, data.room_name)
                } else {
                    sendMessage(socket, fire_signals[0], ERROR_MESSAGE[1])
                }
            })
            // on kickout
            socket.on(listening_signals[5], (data) => {
                if (isPackValid(data) && isValid(data.to)) {
                    kickoutUser(data.room_name, data.to)
                }
            })
        } else {
            sendMessage(socket, fire_signals[0], ERROR_MESSAGE[1])
        }
    })
    // on disconnecting
    socket.on(listening_signals[1], (reason) => {
        console.log(reason)
        let room_name = Object.keys(socket.rooms)[1]
        if (room_creater_list[room_name] && room_creater_list[room_name].id === socket.id) { // if creater is leaving, flush the msg list, kick out audiences, delete all data lists
            writeFile(room_name, true) // TODO: what if remaining data less than threshold ?
        } else { // if uesr leaving, just clear him in audience_list
            kickoutUser(room_name, socket)
        }
    })
})

server.listen(8002, () => {
    console.log('listening : 8002')
})
