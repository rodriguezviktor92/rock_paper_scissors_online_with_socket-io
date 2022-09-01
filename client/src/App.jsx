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
import ModaljoinRoom from './components/ModalJoinRoom';

//Local
const socket = io('http://localhost:4000');

//Remote
//const socket = io();

function App() {
  const [room, setRoom] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [playerTwo, setPlayerTwo] = useState(false);
  const [playerId, setPlayerId] = useState();
  const [choice, setChoice] = useState();
  const [result, setResult] = useState();

  useEffect(() => {
    const roomCreated = (room) => {
      setRoomCreated(true);
      setRoomJoin(true);
      setPlayerId(1);
      //socket.emit('join-room', room);
    };

    const roomJoin = (room) => {
      setRoomJoin(true);
      console.log('join room')
    };

    socket.on('room-created', roomCreated);

    socket.on('room-joined', roomJoin);


    const playerTwoConnected = () => {
      setPlayerTwo(true);
      console.log('player two connected')
    };

    socket.on('player-2-connected', playerTwoConnected);

    const gameResult =(message)=>{
      setResult({result:'draw',message:message})
    }

    socket.on('draw', gameResult);
    return () => {
      //socket.off('message', receiverMessage);
    };
  }, [socket]);

  const handleSelecOption = (choice) => {
    setChoice(choice);
    socket.emit('make-move', [room, playerId, choice]);
    console.log(choice)
  };

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
      {roomJoin && playerTwo ? (
        <p>
          Player Two connected: <b>Select you Option</b>
        </p>
      ) : (
        <p>Player Two not yet connected</p>
      )}
      {result && (<p>{result.message}</p>)}
      <div className="relative w-[313px] h-[278px] flex justify-center items-center justify-self-center">
        <img src={bgTriangle} className="max-w-[70%]" alt="triangle" />
        <Option
          image={iconPaper}
          type={'paper'}
          handleSelecOption={handleSelecOption}
        />
        <Option
          image={iconScissors}
          type={'scissors'}
          handleSelecOption={handleSelecOption}
        />
        <Option
          image={iconRock}
          type={'rock'}
          handleSelecOption={handleSelecOption}
        />
      </div>
      <div className="flex justify-end self-end text-white">
        <ModaljoinRoom
          socket={socket}
          room={room}
          setRoom={setRoom}
          roomJoin={roomJoin}
          setPlayerId={setPlayerId}
        />
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
