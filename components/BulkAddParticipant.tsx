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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
  
const BanknoteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5M12 4.5v.01" />
    </svg>
);

const BulkAddParticipant: React.FC<BulkAddParticipantProps> = ({ onBulkAdd }) => {
  const [selectedCount, setSelectedCount] = useState<number | 'manual'>(4);
  const [manualCount, setManualCount] = useState('10');
  const [averageSalary, setAverageSalary] = useState('80'); // 80k
  const [isSliding, setIsSliding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCount = selectedCount === 'manual' ? parseInt(manualCount, 10) : selectedCount;
    const numSalary = parseInt(averageSalary, 10);
    if (!isNaN(finalCount) && finalCount > 0 && !isNaN(numSalary) && numSalary > 0) {
      onBulkAdd(finalCount, numSalary);
    } else {
      alert("Please enter a valid number of participants and average salary.");
    }
  };
  
  const countOptions = [2, 3, 4, 5, 6, 7, 8, 9];

  const buttonClass = (count: number | 'manual') => 
    `flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 w-20 h-20 transform hover:-translate-y-1
     ${selectedCount === count 
       ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg' 
       : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
     }`;


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Quick Add</h3>
        
        {/* Participant Count Selector */}
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Number of Participants
            </label>
            <div className="flex flex-wrap items-center gap-3">
                {countOptions.map(num => (
                    <button key={num} type="button" onClick={() => setSelectedCount(num)} className={buttonClass(num)}>
                        <UserIcon />
                        <span className="font-bold text-xl mt-1">{num}</span>
                    </button>
                ))}
                <button type="button" onClick={() => setSelectedCount('manual')} className={buttonClass('manual')}>
                    <span className="font-bold text-xl">9+</span>
                    <span className="text-xs font-medium">Manual</span>
                </button>
            </div>
            {selectedCount === 'manual' && (
                <div className="mt-4 max-w-xs transition-all duration-300 ease-in-out">
                    <label htmlFor="manual-participant-count" className="sr-only">Manual Participant Count</label>
                    <input
                        id="manual-participant-count"
                        type="number"
                        value={manualCount}
                        onChange={(e) => setManualCount(e.target.value)}
                        className="block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="10"
                        required
                        autoFocus
                    />
                </div>
            )}
        </div>

        {/* Average Salary Slider */}
        <div>
            <label htmlFor="average-salary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Average Salary
            </label>
            <div className="flex items-center gap-3">
                <BanknoteIcon />
                <input
                    id="average-salary"
                    type="range"
                    min="50"
                    max="300"
                    step="5"
                    value={averageSalary}
                    onChange={(e) => setAverageSalary(e.target.value)}
                    onMouseDown={() => setIsSliding(true)}
                    onMouseUp={() => setIsSliding(false)}
                    onTouchStart={() => setIsSliding(true)}
                    onTouchEnd={() => setIsSliding(false)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                />
                <div className="w-28 text-right">
                    <span className={`inline-block font-semibold text-slate-600 dark:text-slate-300 text-sm tabular-nums transition-all duration-150 ease-out ${isSliding ? 'transform scale-125 bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg' : ''}`}>
                        {formatSalary(parseInt(averageSalary, 10))}
                    </span>
                </div>
            </div>
        </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
      >
        Add Group
      </button>
    </form>
  );
};

export default BulkAddParticipant;