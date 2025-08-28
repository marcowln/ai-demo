
import React, { useState, useEffect } from 'react';
import { MeetingHistoryEntry, Participant } from '../types';
import StarRating from './StarRating';

interface EditMeetingModalProps {
  meeting: MeetingHistoryEntry | null;
  onSave: (meeting: MeetingHistoryEntry) => void;
  onClose: () => void;
}

const secondsToHMS = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00:00';
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const hmsToSeconds = (hms: string): number => {
  const parts = hms.split(':');
  if (parts.length !== 3) return 0;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const s = parseInt(parts[2], 10) || 0;
  return h * 3600 + m * 60 + s;
};

const formatCost = (cost: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cost);
};

const EditMeetingModal: React.FC<EditMeetingModalProps> = ({ meeting, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(3);
  const [durationStr, setDurationStr] = useState('00:00:00');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notes, setNotes] = useState('');
  
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantSalary, setNewParticipantSalary] = useState('');

  useEffect(() => {
    if (meeting) {
      setName(meeting.name);
      setRating(meeting.rating);
      setDurationStr(secondsToHMS(meeting.durationInSeconds));
      setParticipants(meeting.participants || []);
      setNotes(meeting.notes || '');
    }
  }, [meeting]);

  if (!meeting) return null;

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNumber = parseFloat(newParticipantSalary);
    if (newParticipantName.trim() && !isNaN(salaryNumber) && salaryNumber > 0) {
      const newParticipant: Participant = {
        id: crypto.randomUUID(),
        name: newParticipantName.trim(),
        annualSalary: salaryNumber * 1000,
      };
      setParticipants(prev => [...prev, newParticipant]);
      setNewParticipantName('');
      setNewParticipantSalary('');
    } else {
      alert("Please enter a valid name and salary.");
    }
  };

  const handleRemoveParticipant = (idToRemove: string) => {
    setParticipants(prev => prev.filter(p => p.id !== idToRemove));
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      alert("Meeting name cannot be empty.");
      return;
    }
    const updatedMeeting: MeetingHistoryEntry = {
      ...meeting,
      name: name.trim(),
      rating,
      durationInSeconds: hmsToSeconds(durationStr),
      participants: participants,
      notes,
    };
    onSave(updatedMeeting);
  };

  const inputClass = "block w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Meeting</h2>
           <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="space-y-6">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-meeting-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Name</label>
              <input id="edit-meeting-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="edit-meeting-duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (HH:MM:SS)</label>
              <input id="edit-meeting-duration" type="text" value={durationStr} onChange={(e) => setDurationStr(e.target.value)} placeholder="HH:MM:SS" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
            <StarRating rating={rating} setRating={setRating} isEditable={true} />
          </div>
          <div>
            <label htmlFor="edit-meeting-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notes
            </label>
            <textarea
              id="edit-meeting-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Key decisions, action items..."
              className={`${inputClass} h-24`}
              rows={4}
            />
          </div>

          {/* Participants Editor */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Participants ({participants.length})</h3>
            <form onSubmit={handleAddParticipant} className="flex flex-col sm:flex-row items-end gap-3 mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div className="flex-grow w-full">
                  <label htmlFor="new-p-name" className="text-xs font-medium text-slate-600 dark:text-slate-400">Name</label>
                  <input id="new-p-name" type="text" value={newParticipantName} onChange={e => setNewParticipantName(e.target.value)} placeholder="New participant" className={inputClass} />
              </div>
              <div className="flex-grow w-full">
                  <label htmlFor="new-p-salary" className="text-xs font-medium text-slate-600 dark:text-slate-400">Salary (k€)</label>
                  <input id="new-p-salary" type="number" value={newParticipantSalary} onChange={e => setNewParticipantSalary(e.target.value)} placeholder="60" className={inputClass} />
              </div>
              <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">Add</button>
            </form>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {participants.map(p => (
                <li key={p.id} className="flex justify-between items-center p-2 rounded-md bg-slate-100 dark:bg-slate-700">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatCost(p.annualSalary)}/year</p>
                  </div>
                  <button onClick={() => handleRemoveParticipant(p.id)} className="p-1 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-slate-600" aria-label={`Remove ${p.name}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <button onClick={handleSave} className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save Changes</button>
          <button onClick={onClose} className="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-6 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditMeetingModal;