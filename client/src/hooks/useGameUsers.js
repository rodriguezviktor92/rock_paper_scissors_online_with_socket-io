import { useState, useEffect, useCallback } from 'react';

const useGameUsers = (socket, notify, playerId) => {
  const [playerTwo, setPlayerTwo] = useState(false);

  const handleDisconnect = useCallback((player) => {
    if (player !== playerId) {
      notify(`Player ${player} Disconnect`);
      setPlayerTwo(false);
    }
  }, [playerId]);

  useEffect(() => {
    const handlePlayerTwoConnected = () => {
      setPlayerTwo(true);
      notify('Player two connected');
    };

    socket.on('player-2-connected', handlePlayerTwoConnected);

    socket.on('disconnected', handleDisconnect);

    return () => {
      socket.off();
    };
  }, []);

  return {
    playerTwo,
  };
};

export default useGameUsers;
