import { useState, useEffect } from 'react';

const useGameRooms = (socket, notify, setPlayerId) => {
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [room, setRoom] = useState('');

  useEffect(() => {
    const handleRoomCreated = () => {
      setRoomCreated(true);
      setRoomJoin(true);
      setPlayerId(1);
      notify(`Room ${room} created and joined`);
    };

    const handleRoomJoin = () => {
      setRoomJoin(true);
    };

    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoin);

    const handleErrorConnected = (error) => {
      notify(error, 'error');
    };

    socket.on('display-error', handleErrorConnected);

    return () => {
      socket.off();
    };
  }, []);

  return {
    room,
    roomCreated,
    roomJoin,
    setRoom,
  };
};

export default useGameRooms;
