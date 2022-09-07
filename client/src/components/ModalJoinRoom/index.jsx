/* eslint-disable react/prop-types */
import { React, useState } from 'react';
import imgClose from '../../assets/icon-close.svg';

function ModaljoinRoom({
  socket,
  room,
  setRoom,
  roomJoin,
  setPlayerId,
}) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPlayerId(2);
    setShowModal(false);
    socket.emit('join-room', room);
    // setRoom('');
  };

  return (
    <>
      <button
        type="button"
        className="border-2 font-barlow rounded-md w-28"
        onClick={() => setShowModal(true)}
      >
        JOIN ROOM
      </button>
      {showModal ? (
        <div className="flex bg-[#000000d1] text-black justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="p-5 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex justify-between pb-2 items-center">
                <p className="font-barlowExtraBold text-2xl">ROOM NAME</p>
                <button
                  className="text-red-500 background-transparent font-bold"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  <img src={imgClose} alt="rules" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  onChange={(event) => setRoom(event.target.value)}
                  value={room}
                />
                <button type="submit">Join</button>
                {roomJoin && <p>Join Room</p>}
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ModaljoinRoom;
