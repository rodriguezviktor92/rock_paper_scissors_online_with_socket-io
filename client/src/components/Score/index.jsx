/* eslint-disable react/prop-types */
import React from 'react';

function Score({ score, text }) {
  return (
    <section className="bg-white text-black grid text-center font-barlowExtraBold p-3 rounded-lg h-full w-28">
      <p className="text-base">{text}</p>
      <p className="text-5xl">{score}</p>
    </section>
  );
}

export default Score;
