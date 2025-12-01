const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (dev/prod)
        methods: ["GET", "POST"]
    }
});

// Game State
const lobbies = {}; // { lobbyId: { players: [], state: 'waiting' | 'racing', ... } }

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Handle player removal from lobbies
    });

    // Basic ping for health check
    socket.on('ping', (cb) => {
        if(cb) cb('pong');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
