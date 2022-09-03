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
  const options = {
    paper: {
      img: iconPaper
    },
    rock: {
      img: iconRock
    },
    scissors: {
      img: iconScissors
    },
  };

  const [room, setRoom] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [playerTwo, setPlayerTwo] = useState(false);
  const [playerId, setPlayerId] = useState();
  const [youChoice, setYouChoice] = useState();
  const [playerTwoChoice, setPlayerTwoChoice] = useState();
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

    const gameResult =(choice)=>{
      setPlayerTwoChoice(choice);
      console.log(choice)
      setResult({result:'draw',message:`Both of you chose ${choice} . So its draw`})
    }

    socket.on('draw', gameResult);
    return () => {
      //socket.off('message', receiverMessage);
    };
  }, [socket]);

  const handleSelecOption = (choice) => {
    if(!roomJoin){
      console.log('Debes unirte a algun sala')
      return
    }

    if(!playerTwo){
      console.log('Aun el segundo jugar no se ha unido a la sala')
      return
    }
    setYouChoice(choice);
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
      
      {youChoice ? (
      <div className="relative w-[313px] md:w-[520px] h-[278px] flex justify-center items-center justify-self-center">
        <div className={`flex  w-full top-0 justify-center`}>
          <Option
            image={options[youChoice].img}
            type={youChoice}
            bigSize={true}
          />
        </div>
        <div className={`flex  w-full top-0 justify-center`}>
          {playerTwoChoice ? (
            <Option
            image={options[playerTwoChoice].img}
            type={playerTwoChoice}
            bigSize={true}
          />
          ) : (
            <Option
              type={'empty'}
              bigSize={true}
            />
          )}
        </div>
      </div>
      ):(
      <div className="relative w-[313px] h-[278px] md:w-[513px] md:h-[400px] grid justify-center items-center justify-self-center grid-cols-2 grid-rows-2 bg-triangle bg-no-repeat bg-center bg-triangle md:bg-auto">
        <div className={`flex justify-self-center`}>
          <Option
            image={iconPaper}
            type={'paper'}
            handleSelecOption={handleSelecOption}
          />
        </div>
        <div className={`flex justify-self-center`}>
          <Option
            image={iconScissors}
            type={'scissors'}
            handleSelecOption={handleSelecOption}
          />
        </div>
        <div className={`flex absolute w-full bottom-0 justify-center`}>
          <Option
            image={iconRock}
            type={'rock'}
            handleSelecOption={handleSelecOption}
          />
        </div>
      </div> 
      )}
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
