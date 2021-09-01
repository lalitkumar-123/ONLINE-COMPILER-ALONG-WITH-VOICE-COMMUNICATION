const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); 

io.on('connection', socket => {
    socket.on('user-joined', (roomid) => {
        socket.join(roomid);
        socket.broadcast.to(roomid).emit('message', `user joined ${roomid}`);
    })
    socket.on('joinAudioRoom', ({roomId, userId}) => {
        console.log(userId);
        console.log(roomId);
        socket.broadcast.to(roomId).emit('userJoinedAudio', userId);

        socket.on('leaveAudioRoom', () => {
            socket.broadcast.to(roomId).emit('userLeftAudio', userId);
        });
    })
})

server.listen(5000);