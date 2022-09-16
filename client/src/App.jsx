import {
  React,
  useState,
  useEffect,
  useCallback,
} from 'react';
import io from 'socket.io-client';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import iconPaper from './assets/icon-paper.svg';
import iconRock from './assets/icon-rock.svg';
import iconScissors from './assets/icon-scissors.svg';
import Option from './components/Options';
import Scoreboard from './components/Scoreboard';
import ModalRules from './components/ModalRules';
import ModalCreateRoom from './components/ModalCreateRoom';
import ModaljoinRoom from './components/ModalJoinRoom';
import 'react-toastify/dist/ReactToastify.css';

// Local
const socket = io('http://localhost:4000');

// Remote
// const socket = io();

function App() {
  const options = {
    paper: {
      img: iconPaper,
    },
    scissor: {
      img: iconScissors,
    },
    rock: {
      img: iconRock,
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
  const [scores, setScore] = useState({ you: 0, enemy: 0 });

  const notify = (message, type = 'success') => toast[type](message);

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

  const handleDisconnect = useCallback((player) => {
    if (player !== playerId) {
      notify(`Player ${player} Disconnect`);
    }
  }, [playerId]);

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

    const handlePlayerTwoConnected = () => {
      setPlayerTwo(true);
      notify('Player two connected');
    };

    socket.on('player-2-connected', handlePlayerTwoConnected);

    const handleErrorConnected = (error) => {
      notify(error, 'error');
    };

    socket.on('display-error', handleErrorConnected);

    socket.on('disconnected', handleDisconnect);

    return () => {
      socket.off();
    };
  }, []);

  const handleSelecOption = (choice) => {
    if (!roomJoin) {
      notify('Debes unirte o crear una sala', 'error');
      return;
    }

    if (!playerTwo) {
      notify('Aun el segundo jugar no se ha unido a la sala', 'error');
      return;
    }
    setYouChoice(choice);

    socket.emit('make-move', [room, playerId, choice]);
  };

  const handleResetGame = () => {
    setYouChoice('');
    setPlayerTwoChoice('');
    setResult('');
    socket.emit('reset-game', room, playerId);
  };

  return (
    <section id="main" className="w-screen h-screen bg-gradient-to-r from-background to-background2 p-10 grid justify-center items-center grid-cols-options">
      <ToastContainer />
      <Scoreboard scores={scores} />
      <section id="information">
        {roomJoin ? (
          <p>
            You joined the
            <b>{room}</b>
            room select your option
          </p>
        ) : (
          <p>You are not join to any room</p>
        )}
        {roomJoin && playerTwo ? (
          <p>
            Player Two connected:
            <b>Select you Option</b>
          </p>
        ) : (
          <p>Player Two not yet connected</p>
        )}
      </section>

      {youChoice ? (
        <section id="choice" className="relative w-[313px] md:w-[520px] h-[278px] flex justify-center items-center justify-self-center text-white font-barlow font-semibold text-xl tracking-wider">
          <div className="text-center">
            <p className="justify-self-center pb-12">YOU PICKED</p>
            <Option
              image={options[youChoice].img}
              type={youChoice}
              bigSize
            />
          </div>
          {result && (
            <div className={`${youChoice && playerTwoChoice ? 'grid' : 'none'} w-full top-0 justify-center`}>
              <p className="justify-self-center pb-12">{result}</p>
              <button type="button" className="border-2 font-barlow rounded-md w-28" onClick={handleResetGame}>PLAY AGAIN</button>
            </div>
          )}
          <div className="text-center">
            <p className="justify-self-center pb-12">ENEMY PICKED</p>
            {playerTwoChoice ? (
              <Option
                image={options[playerTwoChoice].img}
                type={playerTwoChoice}
                bigSize
              />
            ) : (
              <Option
                type="empty"
                bigSize
              />
            )}
          </div>
        </section>
      ) : (
        <section id="choices" className="relative w-[313px] h-[278px] md:w-[513px] md:h-[400px] grid justify-center items-center justify-self-center grid-cols-2 grid-rows-2 bg-triangle bg-no-repeat bg-center bg-triangle md:bg-auto">
          {
            Object.entries(options).map(([key, value]) => (
              <Option
                key={key}
                image={value.img}
                type={key}
                handleSelecOption={handleSelecOption}
              />
            ))
          }
        </section>
      )}
      <section className="flex justify-end self-end text-white">
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
      </section>
    </section>
  );
}

export default App;
