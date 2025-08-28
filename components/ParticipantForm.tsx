
import React, { useState } from 'react';

interface ParticipantFormProps {
  addParticipant: (name: string, annualSalary: number) => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ addParticipant }) => {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNumber = parseFloat(salary);
    if (name.trim() && !isNaN(salaryNumber) && salaryNumber > 0) {
      addParticipant(name.trim(), salaryNumber);
      setName('');
      setSalary('');
    } else {
        alert("Please enter a valid name and a positive salary amount.");
    }
  };

  const inputClass = "block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4">
      <div className="flex-grow">
        <label htmlFor="participant-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Participant Name
        </label>
        <input
          id="participant-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Jane Doe"
          className={inputClass}
          required
        />
      </div>
      <div className="flex-grow">
        <label htmlFor="annual-salary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Annual Gross Salary (k€)
        </label>
        <input
          id="annual-salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="e.g., 60"
          className={inputClass}
          min="1"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
      >
        Add
      </button>
    </form>
  );
};

export default ParticipantForm;
