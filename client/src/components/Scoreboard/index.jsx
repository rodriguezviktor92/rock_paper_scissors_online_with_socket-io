/* eslint-disable react/prop-types */
import React from 'react';
import Score from '../Score';
import imgLogo from '../../assets/logo.svg';

function Scoreboard({ scores }) {
  return (
    <section id="scoreboard" className="border-2 rounded-lg p-4 flex justify-between items-center">
      <img src={imgLogo} alt="Logo" />
      <div className="md:flex gap-2">
        <Score score={scores.you} text="YOU" />
        <Score score={scores.enemy} text="ENEMY" />
      </div>
    </section>
  );
}

export default Scoreboard;
