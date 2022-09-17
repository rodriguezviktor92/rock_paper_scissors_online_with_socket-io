import { useState, useEffect, useCallback } from 'react';

const useGameResult = (socket, playerId) => {
  const [scores, setScore] = useState({ you: 0, enemy: 0 });
  const [result, setResult] = useState();
  const [playerTwoChoice, setPlayerTwoChoice] = useState();

  const handleGameResult = useCallback((gameResult) => {
    const playerTwoResult = playerId === 1 ? gameResult.player2 : gameResult.player1;

    setPlayerTwoChoice(playerTwoResult);

    if (gameResult.win === 0) {
      setResult('Draw');
      return;
    }

    if (playerId !== gameResult.win) {
      setResult('YOU LOSE');
      setScore({ ...scores, enemy: scores.enemy + 1 });
      return;
    }

    setResult('YOU WIN');
    setScore({ ...scores, you: scores.you + 1 });
  }, [playerId, scores]);

  useEffect(() => {
    // Evaluar para usar 1 solo canal
    socket.on('draw', handleGameResult);
    socket.on('player-1-wins', handleGameResult);
    socket.on('player-2-wins', handleGameResult);
  }, [handleGameResult]);

  return {
    scores,
    result,
    playerTwoChoice,
    setResult,
    setPlayerTwoChoice,
  };
};

export default useGameResult;
