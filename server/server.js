const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const LobbyManager = require('./src/LobbyManager');
const GameManager = require('./src/GameManager');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const lobbyManager = new LobbyManager(io);
const games = new Map(); // lobbyId -> GameManager

// Rate Limiter Map
const rateLimits = new Map(); // socketId -> { count, lastReset }

function checkRateLimit(socketId) {
    const now = Date.now();
    let limit = rateLimits.get(socketId);
    if (!limit || now - limit.lastReset > 1000) {
        limit = { count: 0, lastReset: now };
        rateLimits.set(socketId, limit);
    }
    limit.count++;
    return limit.count <= 20; // Max 20 events per second
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const lobbyId = lobbyManager.leaveLobby(socket.id);
        if (lobbyId && games.has(lobbyId)) {
            // Handle player leaving mid-game (optional: pause or remove boat)
        }
    });

    socket.on('create_lobby', ({ name }, callback) => {
        if (!checkRateLimit(socket.id)) return;
        const player = { id: socket.id, name, socket };
        const lobby = lobbyManager.createLobby(player);
        socket.join(lobby.id);
        callback({ lobbyId: lobby.id });
    });

    socket.on('join_lobby', ({ lobbyId, name }, callback) => {
        if (!checkRateLimit(socket.id)) return;
        const player = { id: socket.id, name, socket };
        const result = lobbyManager.joinLobby(lobbyId, player);
        if (result.error) {
            callback({ error: result.error });
        } else {
            socket.join(lobbyId);
            io.to(lobbyId).emit('lobby_update', { players: result.lobby.players.map(p => ({ id: p.id, name: p.name })) });
            callback({ lobby: result.lobby });
        }
    });

    socket.on('start_game', ({ lobbyId }) => {
        if (!checkRateLimit(socket.id)) return;
        const lobby = lobbyManager.getLobby(lobbyId);
        if (lobby && lobby.players[0].id === socket.id) { // Only host can start
            lobby.state = 'racing';
            const game = new GameManager(io, lobbyId, lobby.players);
            games.set(lobbyId, game);
            game.start();
        }
    });

    socket.on('row_input', ({ lobbyId, type }) => {
        if (!checkRateLimit(socket.id)) return;
        const game = games.get(lobbyId);
        if (game) {
            game.handleInput(socket.id, type);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
