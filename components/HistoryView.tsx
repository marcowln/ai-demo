
import React, { useState } from 'react';
import { MeetingHistoryEntry } from '../types';
import StarRating from './StarRating';
import EditMeetingModal from './EditMeetingModal';
import MeetingDetailsModal from './MeetingDetailsModal';

interface HistoryViewProps {
  history: MeetingHistoryEntry[];
  onUpdate: (updatedMeeting: MeetingHistoryEntry) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (Math.round(seconds % 60)).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatCost = (cost: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cost);
};

const HistoryView: React.FC<HistoryViewProps> = ({ history, onUpdate, onDelete, onExport }) => {
  const [editingMeeting, setEditingMeeting] = useState<MeetingHistoryEntry | null>(null);
  const [viewingMeeting, setViewingMeeting] = useState<MeetingHistoryEntry | null>(null);


  const handleSaveEdit = (updatedMeeting: MeetingHistoryEntry) => {
    onUpdate(updatedMeeting);
    setEditingMeeting(null);
  };
  
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Meeting History</h2>
          <button
            onClick={onExport}
            disabled={history.length === 0}
            className="mt-4 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
          >
            Export as CSV
          </button>
        </div>

        {sortedHistory.length === 0 ? (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">No meetings have been saved yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Cost</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                  <th scope="col" className="px-6 py-3">Rating</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{formatCost(entry.cost)}</td>
                    <td className="px-6 py-4">{formatTime(entry.durationInSeconds)}</td>
                    <td className="px-6 py-4">
                      <StarRating rating={entry.rating} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-4">
                        <button onClick={() => setViewingMeeting(entry)} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">Details</button>
                        <button onClick={() => setEditingMeeting(entry)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                        <button onClick={() => onDelete(entry.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EditMeetingModal
        meeting={editingMeeting}
        onClose={() => setEditingMeeting(null)}
        onSave={handleSaveEdit}
      />
      <MeetingDetailsModal
        meeting={viewingMeeting}
        onClose={() => setViewingMeeting(null)}
      />
    </>
  );
};

export default HistoryView;
