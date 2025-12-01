class LobbyManager {
    constructor(io) {
        this.io = io;
        this.lobbies = new Map(); // lobbyId -> { id, players: [], state: 'waiting'|'racing', game: null }
    }

    createLobby(hostPlayer) {
        const lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const lobby = {
            id: lobbyId,
            players: [hostPlayer],
            state: 'waiting',
            game: null,
            settings: {
                distance: 1000, // meters
            }
        };
        this.lobbies.set(lobbyId, lobby);
        hostPlayer.lobbyId = lobbyId;
        return lobby;
    }

    joinLobby(lobbyId, player) {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) return { error: 'Lobby not found' };
        if (lobby.state !== 'waiting') return { error: 'Game already in progress' };
        if (lobby.players.length >= 4) return { error: 'Lobby full' };

        lobby.players.push(player);
        player.lobbyId = lobbyId;
        return { lobby };
    }

    leaveLobby(playerId) {
        // Find lobby with player
        for (const [id, lobby] of this.lobbies) {
            const index = lobby.players.findIndex(p => p.id === playerId);
            if (index !== -1) {
                lobby.players.splice(index, 1);
                if (lobby.players.length === 0) {
                    this.lobbies.delete(id);
                } else {
                    // Notify others
                    this.io.to(id).emit('lobby_update', { players: lobby.players });
                }
                return id;
            }
        }
        return null;
    }

    getLobby(lobbyId) {
        return this.lobbies.get(lobbyId);
    }
}

module.exports = LobbyManager;
