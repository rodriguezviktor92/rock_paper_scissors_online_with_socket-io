import { useState } from 'react';
import './index.css';
import bgTriangle from './assets/bg-triangle.svg';
import iconPaper from './assets/icon-paper.svg';
import iconRock from './assets/icon-rock.svg';
import iconScissors from './assets/icon-scissors.svg';
import { Option } from './components/Options';
import { Header } from './components/Header';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-background to-background2 p-10 grid justify-center items-center grid-cols-options">
      <Header />
      <div className="relative w-[313px] h-[278px] flex justify-center items-center justify-self-center">
        <img src={bgTriangle} className="max-w-[70%]" alt="triangle" />
        <Option image={iconPaper} type={'paper'} />
        <Option image={iconScissors} type={'scissors'} />
        <Option image={iconRock} type={'rock'} />
      </div>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </div>
  );
}

export default App;
