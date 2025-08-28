
import React from 'react';
import { Participant } from '../types';

interface ParticipantListProps {
  participants: Participant[];
  removeParticipant: (id: string) => void;
  clearParticipants: () => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, removeParticipant, clearParticipants }) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">No participants added yet.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Use the form above to add attendees to the meeting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
       <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
        Meeting Attendees ({participants.length})
      </h2>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">{p.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(p.annualSalary)}/year
              </p>
            </div>
            <button
              onClick={() => removeParticipant(p.id)}
              className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 dark:hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800 transition-colors"
              aria-label={`Remove ${p.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
       <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={clearParticipants}
          className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
          aria-label="Remove all participants"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ParticipantList;
