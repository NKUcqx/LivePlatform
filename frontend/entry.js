let express = require('express')
let app = express()
let server = require('http').Server(app)
let io = require('socket.io')(server)
let path = require('path')
let fs = require('fs')

const MAX_LOAD = 4
let room_msg_list = {} // buffer area, msg queue, will load into log.txt
let room_audience_list = {} // buffer area, live user in a room, for now , just the amount not user list

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
    for (let item of room_msg_list[roomname]) {
        writeStream.write(item + '\r\n')// huan hang
    }
    room_msg_list[roomname] = room_msg_list[roomname].slice(MAX_LOAD)
    console.log('finish write file :' + roomname)
}

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        if (!room_audience_list[data.room_id]) {
            room_audience_list[data.room_id] = 0
        }
        if (!room_msg_list[data.room_id]) {
            room_msg_list[data.room_id] = []
        }
        room_audience_list[data.room_id]++
        socket.join(data.room_id, () => {
            console.log(socket.id + ' has joined : ' + data.room_id)
            // load history messages
            let messages = []
            for (let item of room_msg_list[data.room_id]) {
                if (item.type === 'chat') {
                    messages.push(item)
                }
            }
            socket.emit('loadHistory', {'messages': messages})
            // io.to(data.room_id, {name: data.name})
        })
        socket.on('sendMessage', (data) => {
            if (room_msg_list[data.room_id].length > MAX_LOAD) {
                writeFile(data.room_id, room_msg_list[data.room_id])
                console.log('out of write, length : ' + room_msg_list[data.room_id].length)
            }
            const DATE = new Date()
            data.time = DATE.getTime() // get mileseconds from 1970.1.1 to now
            let json_data = JSON.stringify(data)
            room_msg_list[data.room_id].push(json_data)
            if (data.type === 0) {
                io.sockets.in(data.room_id).emit('update', data)
            } else if (data.type === 1) {
                socket.broadcast.emit('update', data) // everyone gets it but the sender
            }
        })
        socket.on('getAudience', (date) => {
            // update audience amount( or list)
            const amount = room_audience_list[data.room_id]
            io.sockets.in(data.room_id).emit('sendAudience', {'amount': amount})
        })
        socket.on('allSilence', (data) => {
            // clients = io.sockets.clients(data.room_id)
        })
        socket.on('leave', (data) => {
            socket.disconnect(true)
        })
    })
    socket.on('disconnect', () => {
        console.log('user: ' + socket.id + ' disconnect')
    })
})

server.listen(8002, () => {
    console.log('listening : 8002')
})
