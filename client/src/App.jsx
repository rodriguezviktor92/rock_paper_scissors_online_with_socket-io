import {
  React,
  useState,
} from 'react';

import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import io from 'socket.io-client';
import iconPaper from './assets/icon-paper.svg';
import iconRock from './assets/icon-rock.svg';
import iconScissors from './assets/icon-scissors.svg';
import Option from './components/Options';
import Scoreboard from './components/Scoreboard';
import ModalRules from './components/ModalRules';
import ModalCreateRoom from './components/ModalCreateRoom';
import ModaljoinRoom from './components/ModalJoinRoom';
import 'react-toastify/dist/ReactToastify.css';
import useGameResult from './hooks/useGameResult';
import useGameRooms from './hooks/useGameRooms';
import useGameUsers from './hooks/useGameUsers';

const socket = io('http://localhost:4000');

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

  const [youChoice, setYouChoice] = useState();
  const [playerId, setPlayerId] = useState();
  const notify = (message, type = 'success') => toast[type](message);

  const {
    scores,
    result,
    playerTwoChoice,
    setResult,
    setPlayerTwoChoice,
  } = useGameResult(socket, playerId);

  const {
    room,
    roomCreated,
    roomJoin,
    setRoom,
  } = useGameRooms(socket, notify, setPlayerId);

  const {
    playerTwo,
  } = useGameUsers(socket, notify, playerId);

  const handleSelecOption = (choice) => {
    if (!roomJoin) {
      notify('You must join or create a new room', 'error');
      return;
    }

    if (!playerTwo) {
      notify('The second player has not joined the room.', 'error');
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
      <Scoreboard scores={scores} />
      <section id="information" className="text-white">
        {roomJoin ? (
          <p>
            You joined the room:
            <b className="text-lime-400">{` ${room}`}</b>
          </p>
        ) : (
          <p>You are not join to any room</p>
        )}
        {roomJoin && playerTwo ? (
          <p>Select you Option</p>
        ) : (
          <p>Player Two not yet connected</p>
        )}
      </section>

      {youChoice ? (
        <section id="choice" className={`relative w-[313px] md:w-[520px] h-[278px] grid grid-cols-twoColums ${result ? 'md:grid-cols-threeColums' : 'md:grid-cols-twoColums'} gap-x-2.5 justify-center items-center justify-self-center text-white font-barlow font-semibold text-xl tracking-wider`}>
          <div className="text-center">
            <p className="justify-self-center pb-12">YOU PICKED</p>
            <Option
              image={options[youChoice].img}
              type={youChoice}
              bigSize
            />
          </div>
          {result && (
            <div className={`${youChoice && playerTwoChoice ? 'grid' : 'none'} md:row-auto md:col-span-1 row-start-2 col-span-2 w-full top-0 justify-center`}>
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
      <ToastContainer />
      <section className="flex gap-2 justify-end self-end text-white">
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
