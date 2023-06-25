const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', (message) => {
        console.log('Received message:', message);
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

});

const port = process.env.PORT || 3000; // Use the port from .env or fallback to 5000

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
