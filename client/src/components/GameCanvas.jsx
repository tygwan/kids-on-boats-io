import { useEffect, useRef, useState } from 'react';
import './GameCanvas.css';

function GameCanvas({ socket, lobbyId }) {
    const canvasRef = useRef(null);
    const [boats, setBoats] = useState([]);
    const [myId, setMyId] = useState(null);

    useEffect(() => {
        setMyId(socket.id);

        const handleGameUpdate = (gameState) => {
            setBoats(gameState);
        };

        socket.on('game_update', handleGameUpdate);

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                socket.emit('row_input', { lobbyId, type: e.key.toLowerCase() });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            socket.off('game_update', handleGameUpdate);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [socket, lobbyId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#1a2332';
        ctx.fillRect(0, 0, width, height);

        // Draw river
        ctx.fillStyle = '#2d8b8b';
        ctx.fillRect(0, 100, width, height - 200);

        // Draw boats
        const laneHeight = (height - 200) / 4;
        boats.forEach((boat, idx) => {
            const x = (boat.progress / 1000) * (width - 100) + 50;
            const y = 100 + idx * laneHeight + laneHeight / 2 - 20;

            // Draw boat (rectangle for now)
            ctx.fillStyle = boat.id === myId ? '#a8dadc' : '#f1faee';
            ctx.fillRect(x, y, 60, 40);

            // Draw progress text
            ctx.fillStyle = '#f1faee';
            ctx.font = '14px Inter';
            ctx.fillText(`${Math.round((boat.progress / 1000) * 100)}%`, x, y - 10);
        });

        // Draw finish line
        ctx.strokeStyle = '#f1faee';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(width - 50, 100);
        ctx.lineTo(width - 50, height - 100);
        ctx.stroke();
        ctx.setLineDash([]);
    }, [boats, myId]);

    return (
        <div className="game-canvas-container">
            <div className="instructions">
                Press <kbd>←</kbd> or <kbd>→</kbd> to row!
            </div>
            <canvas ref={canvasRef} width={1000} height={600} />
        </div>
    );
}

export default GameCanvas;
