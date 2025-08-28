import React, { useState } from 'react';

interface BulkAddParticipantProps {
  onBulkAdd: (count: number, averageSalary: number) => void;
}

const formatSalary = (salaryInThousands: number) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(salaryInThousands * 1000);
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
  
const BanknoteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5M12 4.5v.01" />
    </svg>
);

const UserGroupIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);

const BulkAddParticipant: React.FC<BulkAddParticipantProps> = ({ onBulkAdd }) => {
  const PARTICIPANT_SLIDER_MIN = 1;
  const PARTICIPANT_SLIDER_MAX = 9;
  const SALARY_SLIDER_MIN = 50;
  const SALARY_SLIDER_MAX = 300;

  const [participantCount, setParticipantCount] = useState('4');
  const [isManualCount, setIsManualCount] = useState(false);
  const [averageSalary, setAverageSalary] = useState('80');
  const [isManualSalary, setIsManualSalary] = useState(false);
  const [isParticipantSliding, setIsParticipantSliding] = useState(false);
  const [isSalarySliding, setIsSalarySliding] = useState(false);

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setParticipantCount('');
        return;
    }
    const numValue = parseInt(value, 10);
    
    if (e.target.type === 'range') {
      if (numValue >= PARTICIPANT_SLIDER_MAX) {
        setIsManualCount(true);
      }
    } else {
      if (!isNaN(numValue) && numValue < PARTICIPANT_SLIDER_MAX) {
        setIsManualCount(false);
      }
    }
    setParticipantCount(value);
  };
  
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setAverageSalary('');
        return;
    }
    const numValue = parseInt(value, 10);

    if (e.target.type === 'range') {
      if (numValue >= SALARY_SLIDER_MAX) {
        setIsManualSalary(true);
      }
    } else {
      if (!isNaN(numValue) && numValue < SALARY_SLIDER_MAX) {
        setIsManualSalary(false);
      }
    }
    setAverageSalary(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCount = parseInt(participantCount, 10);
    const numSalary = parseInt(averageSalary, 10);
    if (!isNaN(finalCount) && finalCount > 0 && !isNaN(numSalary) && numSalary > 0) {
      onBulkAdd(finalCount, numSalary);
    } else {
      alert("Please enter a valid number of participants and average salary.");
    }
  };

  const inputClass = "block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const sliderClass = "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Quick Add</h3>
      
      <div>
        <label htmlFor="participant-count" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Number of Participants
        </label>
        <div className="flex items-center gap-3">
          <UserIcon />
          <div className="flex-grow">
            {isManualCount ? (
              <input
                id="participant-count"
                type="number"
                value={participantCount}
                onChange={handleParticipantChange}
                className={inputClass}
                min={PARTICIPANT_SLIDER_MIN}
                required
                autoFocus
              />
            ) : (
              <input
                id="participant-count"
                type="range"
                min={PARTICIPANT_SLIDER_MIN}
                max={PARTICIPANT_SLIDER_MAX}
                step="1"
                value={participantCount}
                onChange={handleParticipantChange}
                onMouseDown={() => setIsParticipantSliding(true)}
                onMouseUp={() => setIsParticipantSliding(false)}
                onTouchStart={() => setIsParticipantSliding(true)}
                onTouchEnd={() => setIsParticipantSliding(false)}
                className={sliderClass}
              />
            )}
          </div>
          <div className="w-32 text-right">
            <span className={`inline-block font-semibold text-slate-600 dark:text-slate-300 text-sm tabular-nums transition-all duration-150 ease-out ${isParticipantSliding && !isManualCount ? 'transform scale-125 bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg' : ''}`}>
              {participantCount || '0'} {parseInt(participantCount, 10) === 1 ? 'participant' : 'participants'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="average-salary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Average Salary
        </label>
        <div className="flex items-center gap-3">
          <BanknoteIcon />
          <div className="flex-grow">
            {isManualSalary ? (
              <input
                id="average-salary"
                type="number"
                value={averageSalary}
                onChange={handleSalaryChange}
                className={inputClass}
                min={1}
                step="1"
                required
                autoFocus
              />
            ) : (
              <input
                id="average-salary"
                type="range"
                min={SALARY_SLIDER_MIN}
                max={SALARY_SLIDER_MAX}
                step="5"
                value={averageSalary}
                onChange={handleSalaryChange}
                onMouseDown={() => setIsSalarySliding(true)}
                onMouseUp={() => setIsSalarySliding(false)}
                onTouchStart={() => setIsSalarySliding(true)}
                onTouchEnd={() => setIsSalarySliding(false)}
                className={sliderClass}
              />
            )}
          </div>
          <div className="w-28 text-right">
            <span className={`inline-block font-semibold text-slate-600 dark:text-slate-300 text-sm tabular-nums transition-all duration-150 ease-out ${isSalarySliding && !isManualSalary ? 'transform scale-125 bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg' : ''}`}>
              {formatSalary(parseInt(averageSalary, 10) || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
        >
          <UserGroupIcon />
          Add Group
        </button>
      </div>
    </form>
  );
};

export default BulkAddParticipant;