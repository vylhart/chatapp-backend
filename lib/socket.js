const socketIO = require('socket.io');

function initSocket(server) {
    const io = socketIO(server);

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
}


module.exports = {
    initSocket
};
