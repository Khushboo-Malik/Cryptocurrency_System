require('dotenv').config();
const express=require("express"); // Your Express app

const { Server } = require('socket.io');
const http = require('http');
const app=express();

const server = http.createServer(app);
const io = new Server(server);

global.io = io;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (username) => {
        socket.join(username); // Assign the user to a room
        console.log(`${username} joined their room.`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

module.exports = io;
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

