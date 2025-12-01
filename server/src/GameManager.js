class GameManager {
    constructor(io, lobbyId, players) {
        this.io = io;
        this.lobbyId = lobbyId;
        this.players = players; // [{ id, name, socket, progress: 0, speed: 0, ... }]
        this.state = 'countdown'; // countdown, racing, finished
        this.startTime = 0;
        this.finishLine = 1000; // meters
        this.loopInterval = null;

        // Initialize player game state
        this.players.forEach(p => {
            p.progress = 0;
            p.speed = 0;
            p.rhythmScore = 0; // 0-100 (Aura)
        });
    }

    start() {
        this.state = 'countdown';
        let count = 3;
        const countdownInterval = setInterval(() => {
            this.io.to(this.lobbyId).emit('game_countdown', count);
            if (count === 0) {
                clearInterval(countdownInterval);
                this.beginRace();
            }
            count--;
        }, 1000);
    }

    beginRace() {
        this.state = 'racing';
        this.startTime = Date.now();
        this.io.to(this.lobbyId).emit('game_start', { startTime: this.startTime });

        // Start Game Loop (20 TPS)
        this.loopInterval = setInterval(() => this.update(), 50);
    }

    update() {
        if (this.state !== 'racing') return;

        let finishedCount = 0;
        const gameState = this.players.map(p => {
            // Decay speed (friction)
            p.speed *= 0.95;
            if (p.speed < 0.1) p.speed = 0;

            // Update position
            p.progress += p.speed;

            if (p.progress >= this.finishLine) {
                p.progress = this.finishLine;
                p.finished = true;
                finishedCount++;
            }

            return {
                id: p.id,
                progress: p.progress,
                speed: p.speed,
                rhythmScore: p.rhythmScore
            };
        });

        this.io.to(this.lobbyId).emit('game_update', gameState);

        if (finishedCount === this.players.length) {
            this.endGame();
        }
    }

    handleInput(playerId, inputType) {
        if (this.state !== 'racing') return;

        const player = this.players.find(p => p.id === playerId);
        if (!player) return;

        // Simple mechanics: Add speed on input
        // TODO: Implement rhythm check based on server beat
        player.speed += 2.0;
        if (player.speed > 10) player.speed = 10; // Max speed cap
    }

    endGame() {
        this.state = 'finished';
        clearInterval(this.loopInterval);

        // Sort by finish time (simplified here as just order)
        const results = this.players
            .sort((a, b) => b.progress - a.progress)
            .map(p => ({ id: p.id, name: p.name }));

        this.io.to(this.lobbyId).emit('game_over', results);
    }
}

module.exports = GameManager;
