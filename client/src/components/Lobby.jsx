import './Lobby.css';

function Lobby({ socket, lobbyId, lobbyData, onStartGame }) {
    return (
        <div className="lobby">
            <h2>Lobby: {lobbyId}</h2>
            <div className="players">
                <h3>Players ({lobbyData?.players?.length || 0}/4)</h3>
                <ul>
                    {lobbyData?.players?.map((player, idx) => (
                        <li key={player.id}>
                            {idx === 0 && '👑 '}
                            {player.name}
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={onStartGame} className="start-btn">
                Start Race
            </button>
        </div>
    );
}

export default Lobby;
