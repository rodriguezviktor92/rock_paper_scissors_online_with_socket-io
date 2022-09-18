/* eslint-disable react/prop-types */
import React from 'react';

function Option({
  image,
  type,
  handleSelecOption,
  bigSize,
}) {
  const options = {
    paper: {
      bg: 'bg-paper',
    },
    rock: {
      bg: 'bg-rock',
    },
    scissor: {
      bg: 'bg-scissors',
    },
    empty: {
      bg: 'bg-none',
    },
  };

  return (
    <button
      type="button"
      onKeyPress={() => handleSelecOption && handleSelecOption(type)}
      tabIndex="0"
      className={`rounded-full p-4 ${options[type].bg} ${type !== 'empty' && 'shadow-shadow-out'} hover:scale-110 justify-self-center ${type === 'rock' && 'col-span-2'}`}
      onClick={() => handleSelecOption && handleSelecOption(type)}
    >
      <span
        className={`w-[100px] h-[100px] md:w-[150px] md:h-[150px] ${bigSize && 'sm:w-[150px] sm:h-[150px]'} ${type === 'empty' ? 'bg-empty' : 'bg-white'} rounded-full flex 
justify-center items-center ${type !== 'empty' && 'shadow-shadow-in'}`}
      >
        {image && (<img src={image} alt={type} />) }
      </span>
    </button>
  );
}

export default Option;
