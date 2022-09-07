import React from 'react';

export function Option({ image, type, handleSelecOption, bigSize }) {
  const options = {
    paper: {
      bg: 'bg-paper'
    },
    rock: {
      bg: 'bg-rock'
    },
    scissor: {
      bg: 'bg-scissors'
    },
    empty:{
      bg: 'bg-none'
    }
  };

  return (
    
      <span
        className={`rounded-full p-4 ${options[type].bg} ${type !== 'empty' && 'shadow-shadow-out'} hover:scale-110`}
        onClick={() => handleSelecOption && handleSelecOption(type)}
      >
        <span
          className={`w-[100px] h-[100px] md:w-[150px] md:h-[150px] ${bigSize && 'sm:w-[200px] sm:h-[200px]'} ${type === 'empty' ? 'bg-empty' : 'bg-white'} rounded-full flex 
 justify-center items-center ${type !== 'empty' && 'shadow-shadow-in'}`}
        >
          {image && (<img src={image} />) }
        </span>
      </span>
    
  );
}
