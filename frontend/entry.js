let express = require('express')
let app = express()
let server = require('http').Server(app)
let io = require('socket.io')(server)
let path = require('path')
let fs = require('fs')

// max message list length threshold, write into file when archive this
const MESSAGE_THRESHOLD = 40
const ERROR_MESSAGE = ['Format Invalid', 'Miss ', 'Must Join this room first', 'Unsupported Type, Choose between 0~3', 'This Signal has already in use']

// buffer area, msg queue, will load into log.txt
let room_msg_list = {}
// buffer area, live user in a room, for now , just the amount not user list
let room_audience_list = {}
// signals server will fire
let fire_signals = ['Error', 'updateMessage', 'loadHistory', 'getAudience'] // wtf? whether space needed at the head of bracket or not!?
// signals server will listening
let listening_signals = [ 'connection', 'disconnect', 'join', 'createDispatchSignal', 'createCallbackSignal', 'sendMessage', 'updateMessage', 'getAudience', 'leave', 'endRoom', 'disableDispatchSignal', 'disableCallbackSignal' ]

function readFile (roomname, limit = MAX_LOAD) {
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

function writeFile (roomname) {
    const writeStream = fs.createWriteStream(path.join('static', 'rooms', roomname, 'log.txt'), {'flags': 'a'})
    writeStream.on('open', (fd) => {
        console.log('write log into ' + roomname)
    })
    // not async !!!!!!!!!???????????????????
    // TODO: check whether it is async or not
    for (let item of room_msg_list[roomname]) {
        writeStream.write(item + '\r\n')// huan hang
    }
    room_msg_list[roomname] = room_msg_list[roomname].slice(MAX_LOAD)
    console.log('finish write file :' + roomname)
}

function isValid (content, type = 'string') {
    return content !== undefined && content !== null && typeof content === type && content !== ''
}

function logMessage (room_name, nickname, content, type, signal = 'sendMessage') {
    const DATE = new Date()
    let json_data = JSON.stringify({
        // TODO user id later
        'room_name': room_name,
        'nickname': nickname,
        'content': content,
        'type': type,
        'signal': isValid(signal) ? signal : signal,
        'time': DATE.getTime() // get mileseconds from 1970.1.1 to now
    })
    room_msg_list[room_name].push(json_data)
    if (room_msg_list[room_name].length > MESSAGE_THRESHOLD) { // if it is filled, dump into log.txt
        writeFile(room_name, room_msg_list[room_name])
    }
}

function sendMessage (socket, signal, content, type = 0, room_name = 'all', log = true, nickname = '') {
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
                socket.emit(fire_signals[0], ERROR_MESSAGE[1] + 'room_name')
            }
            break
        case 2: // send to everyone in the room_name
            isValid(room_name) ? socket.emit(fire_signals[0], ERROR_MESSAGE[1] + 'room_name') : io.sockets.in(room_name).emit(signal, content)
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
        logMessage(room_name, nickname, content, type, signal)
    }
}

// on connect
io.on(listening_signals[0], (socket) => {
    // on join
    socket.on(listening_signals[2], (data) => {
        if (isValid(data.room_name) && isValid(data.nickname)) {
            if (!room_audience_list[data.room_name]) {
                room_audience_list[data.room_name] = []
            }
            if (!room_msg_list[data.room_name]) {
                room_msg_list[data.room_name] = []
            }
            socket.join(data.room_name, () => {
                console.log(socket.id + ' has joined : ' + data.room_name)
                // push him into audience list
                // TODO: (using socket.id temporaly, change to user_id later?)
                room_audience_list[data.room_name].push(socket.id)
                // load history messages
                sendMessage(socket, fire_signals[2], room_msg_list[data.room_name], 0, '', false)
            })
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // on sendMessage
            socket.on(listening_signals[5], (data) => {
                console.log('sendMessage' + data)
                // TODO: is it necessary to check all of them ?
                if (isValid(data.room_name) && isValid(data.type, 'number') && isValid(data.content) && isValid(data.nickname)) {
                    if (room_msg_list[data.room_name]) { // if this room's msg queue has been created
                        sendMessage(socket, fire_signals[1], data.content, data.type, data.room_name, true, data.nickname)
                    } else {
                        sendMessage(socket, fire_signals[0], ERROR_MESSAGE[2], 0, '', false)
                    }
                } else {
                    sendMessage(socket, fire_signals[0], ERROR_MESSAGE[0], 0, '', false)
                }
            })
            // on getAudience
            socket.on(listening_signals[7], (data) => {
                // update audience amount(or list)
                if (isValid(data.room_name)) {
                    const amount = room_audience_list[data.room_name].length
                    sendMessage(socket, fire_signals[3], amount, 2, data.room_name)
                } else {
                    sendMessage(socket, fire_signals[0], ERROR_MESSAGE[1] + 'room_name', 0, '', false)
                }
            })
            // on createDispatchSignal
            // webpack must satisfy the standard format(format write into file), if you want to add dispatch msg
            socket.on(listening_signals[3], (data) => {
                if (typeof data.signal === 'string' && isValid(data.signal) && listening_signals.indexOf(data.signal) === -1) {
                    listening_signals.push(data.signal)
                    socket.on(data.signal, (data) => { // start listening the signal
                        if (isValid(data.room_name) && // must check the format strictly to keep log.txt clean
                            isValid(data.nickname) &&
                            isValid(data.content) &&
                            isValid(data.type)
                        ) {
                            sendMessage(socket, data.signal, data.content, data.type, data.room_name, true, data.nickname)
                        }
                    })
                    console.log('new signal :' + data.signal + ' created')
                } else if (listening_signals.indexOf(data.signal) === -1) {
                    sendMessage(socket, fire_signals[0], ERROR_MESSAGE[4], 0, '', false)
                } else {
                    // format error
                    sendMessage(socket, fire_signals[0], ERROR_MESSAGE[0], 0, '', false)
                }
            })
            // on createCallbackSignal
            // TODO on createCallbackSignal
            // on leave
            socket.on(listening_signals[8], (data) => {

            })
            // on endRoom
            socket.on(listening_signals[9], (data) => {
                writeFile(data.room_name)
                delete room_msg_list[data.room_name]
                delete room_audience_list[data.room_name]
                console.log('LiveRoom : ' + data.room_name + ' ended')
            })
        } else {
            sendMessage(socket, fire_signals[0], ERROR_MESSAGE[1] + isValid(data.room_name) ? 'nickname' : 'room_name', 0, '', false)
        }
    })
    socket.on(listening_signals[1], () => {
        // TODO how to get room_name ?
        // TODO write the remaining msg into file
        console.log('user : ' + socket.id + ' disconnect')
    })
})

server.listen(8002, () => {
    console.log('listening : 8002')
})
