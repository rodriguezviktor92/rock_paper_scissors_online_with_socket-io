import { React, useState } from 'react';
import imgRules from '../../assets/image-rules.svg';
import imgClose from '../../assets/icon-close.svg';

function ModalRules() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        type="button"
        className="border-2 font-barlow rounded-md w-28"
        onClick={() => setShowModal(true)}
      >
        RULES
      </button>
      {showModal ? (
        <div className="flex bg-[#000000d1] text-black justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="p-5 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex justify-between pb-2 items-center">
                <p className="font-barlowExtraBold text-2xl">RULES</p>
                <button
                  className="text-red-500 background-transparent font-bold"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  <img src={imgClose} alt="rules" />
                </button>
              </div>
              <img src={imgRules} alt="rules" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ModalRules;
