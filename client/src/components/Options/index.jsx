import React from 'react';

export function Option({ image, type, handleSelecOption }) {
  const options = {
    paper: {
      bg: 'bg-paper',
      positionx: 'top-0',
      positiony: 'justify-start',
    },
    rock: {
      bg: 'bg-rock',
      positionx: 'bottom-0',
      positiony: 'justify-center',
    },
    scissors: {
      bg: 'bg-scissors',
      positionx: 'top-0',
      positiony: 'justify-end',
    },
  };

  return (
    <div
      className={`flex absolute w-full ${options[type].positionx} ${options[type].positiony}`}
    >
      <span
        className={`rounded-full p-4 ${options[type].bg} shadow-shadow-out`}
        onClick={() => handleSelecOption(type)}
      >
        <span
          className="w-[100px] h-[100px] bg-white rounded-full flex 
 justify-center items-center shadow-shadow-in"
        >
          <img src={image} />
        </span>
      </span>
    </div>
  );
}
