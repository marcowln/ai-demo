import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

interface SaveMeetingModalProps {
  isOpen: boolean;
  onSave: (name: string, rating: number, notes: string) => void;
  onDiscard: () => void;
  onResume: () => void;
}

const SaveMeetingModal: React.FC<SaveMeetingModalProps> = ({ isOpen, onSave, onDiscard, onResume }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens, with a default name
      setName(`Meeting - ${new Date().toLocaleDateString()}`);
      setRating(3);
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), rating, notes);
    } else {
      alert('Please enter a name for the meeting.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all">
        <button
          onClick={onResume}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
          aria-label="Close and resume meeting"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">End Meeting?</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The timer is paused. Save the meeting to your history, or discard it. Closing this window will resume the timer.</p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="meeting-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Meeting Name
            </label>
            <input
              id="meeting-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q3 Project Sync"
              className="block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meeting Rating
            </label>
            <StarRating rating={rating} setRating={setRating} isEditable={true} />
          </div>
          <div>
            <label htmlFor="meeting-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Optional Notes
            </label>
            <textarea
              id="meeting-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Key decisions, action items..."
              className="block w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800"
          >
            Save & End
          </button>
          <button
            onClick={onDiscard}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-6 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
            aria-label="Discard meeting and end"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
            Discard & End
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveMeetingModal;