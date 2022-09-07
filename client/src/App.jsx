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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react';

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
    scissor: {
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

  const notify = (message, type='success') => toast[type](message);

  const gameResult = useCallback((gameResult)=>{
  
  if(playerId === 1) {
    setPlayerTwoChoice(gameResult.player2);
  }else{
    setPlayerTwoChoice(gameResult.player1);
  }

  setResult({result:gameResult.result, message:gameResult.message})
  }, [playerId]);

  useEffect(()=>{
    socket.on('draw', gameResult);
    socket.on('player-1-wins', gameResult);
  },[gameResult])

  useEffect(() => {
    const roomCreated = (room) => {
      setRoomCreated(true);
      setRoomJoin(true);
      setPlayerId(1);
      
      console.log(playerId)
    };

    const roomJoin = (room) => {
      setRoomJoin(true);
    };

    socket.on('room-created', roomCreated);
    socket.on('room-joined', roomJoin);

    const playerTwoConnected = () => {
      setPlayerTwo(true);
      notify('Player two connected')
    };

    socket.on('player-2-connected', playerTwoConnected);
 
    return () => {
      socket.off('message');
    };
  }, []);

  const handleSelecOption = (choice) => {
    if(!roomJoin){
      notify('Debes unirte o crear una sala','error')
      return
    }

    if(!playerTwo){
      notify('Aun el segundo jugar no se ha unido a la sala','error')
      return
    }
    setYouChoice(choice);
    
    socket.emit('make-move', [room, playerId, choice]);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-background to-background2 p-10 grid justify-center items-center grid-cols-options">
      <ToastContainer />
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
            type={'scissor'}
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
          notify={notify}
        />
        <ModalCreateRoom
          socket={socket}
          room={room}
          setRoom={setRoom}
          roomCreated={roomCreated}
          notify={notify}
        />
        <ModalRules />
      </div>
    </div>
  );
}

export default App;
