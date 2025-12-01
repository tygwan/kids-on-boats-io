import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Lobby from './components/Lobby';
import GameCanvas from './components/GameCanvas';
import './App.css';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, lobby, racing, finished
  const [playerName, setPlayerName] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [lobbyData, setLobbyData] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('lobby_update', (data) => {
      setLobbyData(data);
    });

    newSocket.on('game_countdown', (count) => {
      console.log('Countdown:', count);
    });

    newSocket.on('game_start', () => {
      setGameState('racing');
    });

    newSocket.on('game_over', (results) => {
      console.log('Game Over! Results:', results);
      setGameState('finished');
    });

    return () => newSocket.close();
  }, []);

  const createLobby = () => {
    if (!playerName.trim()) return alert('Enter your name!');
    socket.emit('create_lobby', { name: playerName }, (response) => {
      setLobbyId(response.lobbyId);
      setGameState('lobby');
    });
  };

  const joinLobby = () => {
    if (!playerName.trim() || !lobbyId.trim()) return alert('Enter name and lobby ID!');
    socket.emit('join_lobby', { lobbyId, name: playerName }, (response) => {
      if (response.error) {
        alert(response.error);
      } else {
        setGameState('lobby');
        setLobbyData({ players: response.lobby.players.map(p => ({ id: p.id, name: p.name })) });
      }
    });
  };

  if (!socket) return <div className="loading">Connecting...</div>;

  return (
    <div className="app">
      {gameState === 'menu' && (
        <div className="menu">
          <h1>🚣 Kids on Boats</h1>
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={createLobby}>Create Lobby</button>
          <div className="divider">or</div>
          <input
            type="text"
            placeholder="Lobby ID"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
          />
          <button onClick={joinLobby}>Join Lobby</button>
        </div>
      )}

      {gameState === 'lobby' && (
        <Lobby
          socket={socket}
          lobbyId={lobbyId}
          lobbyData={lobbyData}
          onStartGame={() => socket.emit('start_game', { lobbyId })}
        />
      )}

      {(gameState === 'racing' || gameState === 'finished') && (
        <GameCanvas socket={socket} lobbyId={lobbyId} />
      )}
    </div>
  );
}

export default App;
