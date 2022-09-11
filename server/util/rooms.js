export const rooms = {};

export const createRoom = (roomId, playerId) => {
  rooms[roomId] = [playerId, ''];
};

export const joinRoom = (roomId, player2Id) => {
  rooms[roomId][1] = player2Id;
};

export const exitRoom = (roomId, player) => {
  if (player === 1) {
    rooms[roomId][0] = '';
  } else {
    rooms[roomId][1] = '';
  }
  deleteRoom(roomId);
};

const deleteRoom = (roomId)=>{
  if(rooms[roomId][0] === '' && rooms[roomId][1] === ''){
    delete rooms[roomId];
  }
}
