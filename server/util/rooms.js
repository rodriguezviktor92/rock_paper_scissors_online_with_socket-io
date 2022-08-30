export const rooms = {};

export const createRoom = (roomId, playerId) => {
  rooms[roomId] = [playerId, ''];
};

export const joinRoom = (roomId, player2Id) => {
  rooms[roomId][1] = player2Id;
};

export const exitRoom = (roomId, player) => {
  if (player == 1) {
    delete rooms[roomId];
  } else {
    rooms[roomId][1] = '';
  }
};
