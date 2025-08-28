
import React from 'react';

interface ControlButtonsProps {
  isActive: boolean;
  timeInSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  hasParticipants: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ isActive, timeInSeconds, onStart, onPause, onEnd, hasParticipants }) => {
  const baseButtonClass = "w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
  
  return (
    <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 transition-filter duration-300 ${!hasParticipants ? 'blur-sm pointer-events-none' : ''}`}>
      {!isActive ? (
        <button
          onClick={onStart}
          className={`${baseButtonClass} bg-green-500 hover:bg-green-600 focus:ring-green-500`}
          aria-label={timeInSeconds > 0 ? "Resume timer" : "Start timer"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          {timeInSeconds > 0 ? 'Resume' : 'Start'}
        </button>
      ) : (
        <button
          onClick={onPause}
          className={`${baseButtonClass} bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500`}
          aria-label="Pause timer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h1.5A2.25 2.25 0 009 14.75v-9.5A2.25 2.25 0 006.75 3h-1.5zm8.25 0A2.25 2.25 0 0011 5.25v9.5A2.25 2.25 0 0013.25 17h1.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-1.5z" />
          </svg>
          Pause
        </button>
      )}
      <button
        onClick={onEnd}
        className={`${baseButtonClass} bg-red-500 hover:bg-red-600 focus:ring-red-500`}
        aria-label="End meeting and reset cost"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
        </svg>
        End
      </button>
    </div>
  );
};

export default ControlButtons;
