import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';
import bgTriangle from './assets/bg-triangle.svg';
import iconPaper from './assets/icon-paper.svg';
import iconRock from './assets/icon-rock.svg';
import iconScissors from './assets/icon-scissors.svg';
import { Option } from './components/Options';
import { Header } from './components/Header';
import ModalRules from './components/ModalRules';
import ModalCreateRoom from './components/ModalCreateRoom';

//Local
const socket = io('http://localhost:4000');

//Remote
//const socket = io();

function App() {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [playerTwo, setPlayerTwo] = useState(false);

  useEffect(() => {
    const roomCreated = (room) => {
      setRoomCreated(true);
      socket.emit('join-room', room);
    };

    const roomJoin = (room) => {
      setRoomJoin(true);
      //socket.emit('join-room', room);
    };

    socket.on('room-created', roomCreated);

    socket.on('room-joined', roomJoin);

    return () => {
      //socket.off('message', receiverMessage);
    };
  }, [room]);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-background to-background2 p-10 grid justify-center items-center grid-cols-options">
      <Header />
      {roomJoin ? (
        <p>
          You joined the <b>{room}</b> room select your option
        </p>
      ) : (
        <p>You are not join to any room</p>
      )}
      <div className="relative w-[313px] h-[278px] flex justify-center items-center justify-self-center">
        <img src={bgTriangle} className="max-w-[70%]" alt="triangle" />
        <Option image={iconPaper} type={'paper'} />
        <Option image={iconScissors} type={'scissors'} />
        <Option image={iconRock} type={'rock'} />
      </div>
      <div className="flex justify-end self-end text-white">
        <ModalCreateRoom
          socket={socket}
          room={room}
          setRoom={setRoom}
          roomCreated={roomCreated}
        />
        <ModalRules />
      </div>
    </div>
  );
}

export default App;
