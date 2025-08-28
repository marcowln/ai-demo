
import React from 'react';
import { MeetingHistoryEntry } from '../types';

interface MeetingDetailsModalProps {
  meeting: MeetingHistoryEntry | null;
  onClose: () => void;
}

const formatCost = (cost: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cost);
};

const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({ meeting, onClose }) => {
  if (!meeting) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
      onClick={onClose} 
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{meeting.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(meeting.date).toLocaleString()}
                </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 -mt-2 -mr-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Participants ({meeting.participantsCount})
            </h3>
            {meeting.participants && meeting.participants.length > 0 ? (
                <div className="max-h-60 overflow-y-auto pr-2">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {meeting.participants.map((p, index) => (
                            <li key={index} className="flex items-center justify-between py-2">
                                <p className="font-medium text-slate-800 dark:text-slate-200">{p.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {formatCost(p.annualSalary)}/year
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-slate-500 dark:text-slate-400">No participant data available for this meeting.</p>
            )}
        </div>
        
        {meeting.notes && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Notes
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md">
                    {meeting.notes}
                </p>
            </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;