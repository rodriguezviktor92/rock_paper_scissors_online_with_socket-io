import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';
import bgTriangle from './assets/bg-triangle.svg';
import iconPaper from './assets/icon-paper.svg';
import iconRock from './assets/icon-rock.svg';
import iconScissors from './assets/icon-scissors.svg';
import { Option } from './components/Options';
import { Header } from './components/Header';
import Modal from './components/Modal';

//Local
const socket = io('http://localhost:4000');

//Remote
//const socket = io();

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiverMessage = (message) => {
      setMessages([...messages, message]);
    };

    socket.on('message', receiverMessage);

    return () => {
      socket.off('message', receiverMessage);
    };
  }, [messages]);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-background to-background2 p-10 grid justify-center items-center grid-cols-options">
      <Header />
      <div className="relative w-[313px] h-[278px] flex justify-center items-center justify-self-center">
        <img src={bgTriangle} className="max-w-[70%]" alt="triangle" />
        <Option image={iconPaper} type={'paper'} />
        <Option image={iconScissors} type={'scissors'} />
        <Option image={iconRock} type={'rock'} />
      </div>
      <div className="flex justify-end self-end text-white">
        <Modal />
      </div>
    </div>
  );
}

export default App;
