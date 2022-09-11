import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { PORT } from './config.js';
import {
  connectedUsers,
  initializeChoices,
  userConnected,
  makeMove,
  choices,
} from './util/users.js';
import { rooms, createRoom, joinRoom, exitRoom } from './util/rooms.js';
import { moves } from './util/users.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
new SocketServer(server);
const io = new SocketServer(server, {
  cors: {
    //Local
    origin: 'http://localhost:5173',
  },
});

app.use(cors());
app.use(morgan('dev'));

const users = [];
const createUser = (userId) => {
  const newUser = {
    id: userId,
    user: 'User' + users.length,
  };
  users.push(newUser);
};

const getUser = (userId) => {
  const user = users.find((user) => user.id === userId);
  return user;
};

io.on('connection', (socket) => {
  //createUser(socket.id);
  console.log(socket.id);

  socket.on('message', (message) => {
    socket.broadcast.emit('message', {
      body: message,
      from: getUser(socket.id),
    });
  });

  socket.on('create-room', (roomId) => {
    if (rooms[roomId]) {
      const error = 'This room alredy exists';
      socket.exit('display-error', error);
    } else {
      userConnected(socket.id);
      createRoom(roomId, socket.id);
      initializeChoices(roomId);
      socket.join(roomId);
      io.to(roomId).emit('room-created', roomId);
      console.log('Room created')
      io.to(roomId).emit('player-1-connected');
    }
  });

  socket.on('join-room', (roomId) => {
    if (!rooms[roomId]) {
      const error = 'This room doent exists';
      socket.exit('display-error', error);
    } else {
      userConnected(socket.id);
      joinRoom(roomId, socket.id);
      socket.join(roomId);
      io.to(roomId).emit('room-joined', roomId);
      io.to(roomId).emit('player-2-connected');
      console.log('user: ', socket.id, 'join to room: ', roomId);
    }
  });

  socket.on('join-random', () => {
    let roomId = '';

    for (let id in rooms) {
      if (rooms[id][1] === '') {
        roomId = id;
        break;
      }
    }
    if (roomId == '') {
      const error = 'TAll rooms are full or none exists';
      socket.exit('display-error', error);
    } else {
      userConnected(socket.id);
      createRoom(roomId, socket.id);
      socket.emit('room-joined', roomId);
      socket.emit('player-2-connected');
      socket.join(roomId);
    }
  });

  socket.on('make-move', ([roomId, playerId, mychoice]) => {
    makeMove(roomId, playerId, mychoice);
    console.log('room: ', roomId, 'player: ', playerId, 'choice: ', mychoice);

    if (choices[roomId][0] !== '' && choices[roomId][1] !== '') {
      let playerOneChoice = choices[roomId][0];
      let playerTwoChoice = choices[roomId][1];

      const result = { win: 0, player1:playerOneChoice, player2:playerTwoChoice };

      if (playerOneChoice === playerTwoChoice) {
        //let message = 'Both of you chose' + playerOneChoice + ' . So its draw';
        io.to(roomId).emit('draw',result);
      } else if (moves[playerOneChoice] === playerTwoChoice) {       
        result.win = 1;
        choices[rooms] = ['', ''];
        io.to(roomId).emit('player-1-wins', result);
      } else {
        result.win = 2;

        choices[rooms] = ['', ''];
        io.to(roomId).emit('player-2-wins', result);
      }
    }
  });

  socket.on('disconnect', () => {
    if (connectedUsers[socket.id]) {
      let player;
      let roomId;

      for (let id in rooms) {
        if (rooms[id][0] === socket.id || rooms[id][1] === socket.id) {
          if (rooms[id][0] === socket.id) {
            player = 1;
          } else {
            player = 2;
          }
          roomId = id;
          break;
        }
      }
      exitRoom(roomId, player);
      if (player === 1) {
        io.to(roomId).emit('Player-1-disconnected');
        console.log('room: ',roomId,'player: ',player, 'Disconnected')
      } else {
        io.to(roomId).emit('Player-2-disconnected');
        console.log('room: ',roomId,'player: ',player, 'Disconnected')
      }
    }
  });
});

//app.use(express.static(join(__dirname, '../client/dist')));
server.listen(PORT);
console.log('Server started on port ', PORT);
