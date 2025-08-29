import React, { useState } from 'react';
import { Participant } from '../types';
import LizardAnimation from './LizardAnimation';

interface TimerDisplayProps {
  timeInSeconds: number;
  totalCost: number;
  costPerSecond: number;
  participants: Participant[];
}

const WEEKS_PER_YEAR = 52;
const DAYS_PER_WEEK = 5;
const HOURS_PER_DAY = 8;
const VACATION_DAYS_PER_YEAR = 30;
const SICK_LEAVE_DAYS_PER_YEAR = 10;


const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatCost = (cost: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cost);
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeInSeconds, totalCost, costPerSecond, participants }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const costPerMinute = costPerSecond * 60;
  const totalAnnualSalary = participants.reduce((sum, p) => sum + p.annualSalary, 0);
  const totalWorkingDays = (WEEKS_PER_YEAR * DAYS_PER_WEEK) - VACATION_DAYS_PER_YEAR - SICK_LEAVE_DAYS_PER_YEAR;
  const totalWorkingHours = totalWorkingDays * HOURS_PER_DAY;

  const hasParticipants = participants.length > 0;
  
  return (
    <div className="relative">
      <div className={`text-center mb-6 transition-filter duration-300 ${!hasParticipants ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Total Cost</p>
            <p className="text-5xl sm:text-6xl font-bold tracking-tight text-emerald-500 dark:text-emerald-400">
              {formatCost(totalCost)}
            </p>
          </div>
          <div>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Time Elapsed</p>
            <p className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-slate-700 dark:text-slate-300">
              {formatTime(timeInSeconds)}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="font-medium text-lg">Rate:</span>
          <span className="font-bold text-lg text-slate-700 dark:text-slate-300">{formatCost(costPerMinute)} / min</span>
          <div className="relative">
            <button
              onClick={() => setIsTooltipVisible(!isTooltipVisible)}
              onBlur={() => setIsTooltipVisible(false)} // Hide on blur for better UX
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Show rate calculation details"
              disabled={!hasParticipants}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
            {isTooltipVisible && hasParticipants && (
              <div role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-slate-900 text-white text-sm rounded-lg shadow-xl z-10 text-left transition-opacity duration-300">
                <h4 className="font-bold mb-2 border-b border-slate-700 pb-1">Rate Calculation</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    <strong>Total Salary:</strong> {formatCost(totalAnnualSalary)}/year
                  </li>
                  <li>
                    <strong>Working Hours:</strong> {totalWorkingHours}/year
                  </li>
                </ul>
                <p className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-400">
                    Based on {totalWorkingDays} working days/year (52 wks * 5 days - {VACATION_DAYS_PER_YEAR + SICK_LEAVE_DAYS_PER_YEAR} days off).
                </p>
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"
                  aria-hidden="true"
                ></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Lizard Animation */}
        <LizardAnimation timeInSeconds={timeInSeconds} />
      </div>
      
      {!hasParticipants && (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4" aria-hidden="true">
          <div className="w-80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-3 px-6 rounded-2xl shadow-lg border border-white/30 dark:border-white/20 text-center">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1 animate-pulse">
              Add Participants
            </p>
            <svg className="w-6 h-6 text-slate-600 dark:text-slate-300 animate-bounce mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;