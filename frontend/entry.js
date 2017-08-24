let express = require('express')
let app = express()
let server = require('http').Server(app)
let io = require('socket.io')(server)
let path = require('path')
let fs = require('fs')
let redis = require('redis')

// max message list length threshold, write into file when archive this
const MESSAGE_THRESHOLD = 500
const LOAD_THRESHOLD = 0.2 // push new msg when length < 0.1 * threshold
const ERROR_MESSAGE = ['Format Invalid', 'Miss ', 'Must Join this room first', 'Unsupported Type, Choose between 0~3', 'Room not exists', 'Permission Denied']
//const TIME_DELAY = 4 // consider of recursion invoke or other complex stuff
const client = redis.createClient() // may error in vm

// buffer area, msg queue, will load into log.txt
let room_msg_list = {}
let room_creator_list = {}
// buffer area, live user in a room, for now , just the amount not user list
let room_audience_list = {}
let room_past_audience_list = {} // save his socket
// signals server will fire
let fire_signals = ['Error', 'updateMessage', 'loadHistory', 'getAudience'] // wtf? whether space needed at the head of bracket or not!?
// signals server will listening
let listening_signals = ['connection', 'disconnecting', 'liveJoin', 'sendMessage', 'getAudience', 'kickout', 'endRoom', 'pastJoin', 'pause']

function writeFile (room_name, clear = false) {
    let file_name = path.join('.', room_name, 'log.txt')
    console.log(room_name)
    if (fs.existsSync(file_name)) {
        fs.open(file_name, 'a', (err, fd) => {
            console.log('start')
            if (err) {
                throw err
            }
            for (let i in room_msg_list[room_name]) {
                fs.writeSync(fd, JSON.stringify(room_msg_list[room_name][i]) + '\r\n')
            }
            fs.close(fd, (err) => {
                if (err) {
                    throw err
                }
            })
            if (clear === true) {
                clearRoom(room_name)
            } else {
                room_msg_list[room_name].splice(0, MESSAGE_THRESHOLD)
            }
            console.log('finish')
        })
    } else {
        console.log('file not exists')
    }
}

function readDB (room_name, id, start = 0, end = -1, start_send = false, reset_queue = false) { // default is from -infinity to +infinity
    let queue = room_past_audience_list[id]
    client.zrange(room_name, start, end, (err, reply) => {
        if (err) throw err
        queue['msg_queue'] = reset_queue ? reply : queue['msg_queue'].concat(reply)
        queue['msg_start'] = end
        if (start_send && queue['msg_queue'].length > 0) { // cuz only the first msg in the queue need to be send manully
            const msg = queue['msg_queue'].shift()
            sendNextMessage(id, JSON.parse(msg))
        }
    })
}

function writeDB (room_name) {
    for (let i in room_msg_list[room_name]) {
        // use room_name as hash key, time as field, obj as value
        client.zadd(room_name, room_msg_list[room_name][i]['time'], JSON.stringify(room_msg_list[room_name][i]))
    }
    console.log('finish write db, keys: ', room_name)
}

function getRoomName (socket) {
    return Object.keys(socket.rooms)[1]
}

function clearRoom (room_name) {
    for (let user in room_audience_list[room_name]) {
        kickoutUser(room_name, user)
    }
    delete room_audience_list[room_name]
    delete room_creator_list[room_name]
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
                kickoutUser(room_name, item)
                break
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
    let json_data = {
        // TODO user id later
        'room_name': room_name,
        'content': content,
        'type': type,
        'signal': isValid(signal) ? signal : signal,
        'time': DATE.getTime() // get mileseconds from 1970.1.1 to now
    }
    room_msg_list[room_name].push(json_data)
    if (room_msg_list[room_name].length > MESSAGE_THRESHOLD) { // if it is filled, dump into log.txt
        writeFile(room_name)
        writeDB(room_name)
    }
}

function sendNextMessage (id, old_msg) {
    console.log('+++', old_msg['content']['dataType'])
    let list = room_past_audience_list[id]
    if (list['msg_queue'].length <= 0) {
        console.log('record finish')
        return
    }
    if (list['msg_queue'].length <= LOAD_THRESHOLD * MESSAGE_THRESHOLD) {
        readDB(list['room_name'], id, list['msg_start'], list['msg_start'] + MESSAGE_THRESHOLD)
    }
    let msg = JSON.parse(list['msg_queue'].shift())
    const time_slot = isValid(old_msg, 'object') ? msg['time'] - old_msg['time'] : 100
    sendMessage(list['socket'], msg['signal'], msg['content'], 0)
    if (list['msg_play']) {
        setTimeout(() => { sendNextMessage(id, msg) }, time_slot)
    }
}

function sendMessage (socket, signal, content, type = 0, room_name = '', log = false) {
    let error = false
    // let room_name = getRoomName(socket)
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

function initRoom (room_name, creator) {
    room_creator_list[room_name] = creator // save the creator to ask for history
    room_audience_list[room_name] = []
    room_msg_list[room_name] = []
}

function listenSignal (socket, signal_type, callback) {
    socket.on(listening_signals[signal_type], callback)
}

function listenLiveJoin (socket) {
    // on LiveJoin
    listenSignal(socket, 2, (data) => {
        console.log(socket.id + '>>>>>>>>LIVE>>>>>>>>>')
        if (isValid(data.room_name) && isValid(data.id)) {
            if (!room_creator_list[data.room_name]) {
                initRoom(data.room_name, socket)
                console.log('create room: %s by %s', data.room_name, data.id)
            }
            socket.join(data.room_name, () => {
                console.log(data.id + ' has joined : ' + data.room_name + 'socket : ' + socket.id)
                // push this socket into audience list via its id
                room_audience_list[data.room_name][data.id] = socket
                // ask for history from creator
                sendMessage(room_creator_list[data.room_name], fire_signals[2], data.id)
            })
            listenSendMessage(socket)
            listenGetAudience(socket)
            listenKickOut(socket)
        } else {
            sendMessage(socket, fire_signals[0], ERROR_MESSAGE[1])
        }
    })
}

function listenPastJoin (socket) {
    // on pastJoin
    listenSignal(socket, 7, (data) => {
        console.log(socket.id + '<<<<<<<PAST<<<<<<<<<')
        if (isValid(data.room_name) && isValid(data.id)) {
            socket.join(data.room_name, () => {})
            room_past_audience_list[data.id] = {
                'socket': socket,
                'room_name': data.room_name,
                'msg_start': 0,
                'msg_play': false,
                'msg_queue': []
            }
            // readFile(data.room_name, data.id)
            readDB(data.room_name, data.id, 0, MESSAGE_THRESHOLD)
            listenPause(socket)
        }
    })
}

function listenSendMessage (socket) {
    // on sendMessage
    listenSignal(socket, 3, (data) => {
        console.log('send_message %s', data.content.dataType)
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
}

function listenPause (socket) {
    // on pause
    listenSignal(socket, 8, (data) => {
        // update audience amount(or list)
        console.log('in pause')
        if (isValid(data.room_name) && isValid(data.id)) {
            let list = room_past_audience_list[data.id]
            list['msg_play'] = !list['msg_play']
            if (list['msg_play'] && list['msg_queue'].length > 0) {
                console.log('restart')
                sendNextMessage(data.id, JSON.parse(list['msg_queue'].shift()))
            }
        } else {
            sendMessage(socket, fire_signals[0], ERROR_MESSAGE[1])
        }
    })
}

function listenGetAudience (socket) {
    // on getAudience
    listenSignal(socket, 4, (data) => {
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
}

function listenKickOut (socket) {
    // on kickout
    listenSignal(socket, 5, (data) => {
        if (isPackValid(data) && isValid(data.to)) {
            kickoutUser(data.room_name, data.to)
        }
    })
}

function listenDisConnecting (socket) {
    // on disconnecting
    listenSignal(socket, 1, (reason) => {
        console.log(reason)
        let room_name = Object.keys(socket.rooms)[1]
        if (room_creator_list[room_name] && room_creator_list[room_name].id === socket.id) { // if creator is leaving, flush the msg list, kick out audiences, delete all data lists
            writeFile(room_name, true)
            writeDB(room_name)
        } else { // if uesr leaving, just clear him in audience_list
            kickoutUser(room_name, socket)
        }
    })
}

// on connect
io.on(listening_signals[0], (socket) => {
    listenLiveJoin(socket)
    listenPastJoin(socket)
    listenDisConnecting(socket)
})

server.listen(8002, () => {
    console.log('listening : 8002')
})

client.on('ready', () => {
    console.log('Redis is ready')
})