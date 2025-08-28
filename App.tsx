
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Participant, MeetingHistoryEntry } from './types';
import ParticipantForm from './components/ParticipantForm';
import ParticipantList from './components/ParticipantList';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import SaveMeetingModal from './components/SaveMeetingModal';
import HistoryView from './components/HistoryView';
import BulkAddParticipant from './components/BulkAddParticipant';

// Updated constants for cost calculation
const WEEKS_PER_YEAR = 52;
const DAYS_PER_WEEK = 5;
const HOURS_PER_DAY = 8;
const VACATION_DAYS_PER_YEAR = 30;
const SICK_LEAVE_DAYS_PER_YEAR = 10;
const SECONDS_PER_HOUR = 3600;

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const [view, setView] = useState<'calculator' | 'history'>('calculator');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [meetingsHistory, setMeetingsHistory] = useState<MeetingHistoryEntry[]>([]);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('meetingHistory');
      if (savedHistory) {
        setMeetingsHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to parse meeting history from localStorage", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('meetingHistory', JSON.stringify(meetingsHistory));
  }, [meetingsHistory]);

  const costPerSecond = useMemo(() => {
    if (participants.length === 0) {
      return 0;
    }
    const totalAnnualSalary = participants.reduce((sum, p) => sum + p.annualSalary, 0);
    
    const totalWorkingDays = (WEEKS_PER_YEAR * DAYS_PER_WEEK) - VACATION_DAYS_PER_YEAR - SICK_LEAVE_DAYS_PER_YEAR;
    const totalWorkingHours = totalWorkingDays * HOURS_PER_DAY;
    
    if (totalWorkingHours <= 0) return 0;

    const totalHourlyRate = totalAnnualSalary / totalWorkingHours;
    return totalHourlyRate / SECONDS_PER_HOUR;
  }, [participants]);

  const totalCost = timeInSeconds * costPerSecond;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeInSeconds((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const handleStart = useCallback(() => {
    if (participants.length > 0) {
      setIsActive(true);
    } else {
      alert("Please add at least one participant before starting the timer.");
    }
  }, [participants.length]);

  const handlePause = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleEnd = useCallback(() => {
    setIsActive(false);
    if (timeInSeconds > 0 && totalCost > 0) {
      setIsSaveModalOpen(true);
    } else {
      setTimeInSeconds(0);
    }
  }, [timeInSeconds, totalCost]);
  
  const handleResume = useCallback(() => {
    setIsSaveModalOpen(false);
    setIsActive(true);
  }, []);

  const resetTimer = () => {
      setIsActive(false);
      setTimeInSeconds(0);
      setIsSaveModalOpen(false);
  }

  const handleSaveMeeting = (name: string, rating: number, notes: string) => {
    const newMeeting: MeetingHistoryEntry = {
      id: crypto.randomUUID(),
      name,
      rating,
      cost: totalCost,
      durationInSeconds: timeInSeconds,
      date: new Date().toISOString(),
      participantsCount: participants.length,
      participants: participants,
      notes,
    };
    setMeetingsHistory(prev => [...prev, newMeeting]);
    resetTimer();
  };

  const handleDiscardMeeting = () => {
    resetTimer();
  };
  
  const updateMeeting = useCallback((updatedMeeting: MeetingHistoryEntry) => {
    // Recalculate cost based on potentially updated participants and duration
    const workingDays = (WEEKS_PER_YEAR * DAYS_PER_WEEK) - VACATION_DAYS_PER_YEAR - SICK_LEAVE_DAYS_PER_YEAR;
    const workingHours = workingDays * HOURS_PER_DAY;
    let newCost = 0;
    if (workingHours > 0 && updatedMeeting.participants.length > 0) {
        const totalAnnualSalary = updatedMeeting.participants.reduce((sum, p) => sum + p.annualSalary, 0);
        const costPerSecond = (totalAnnualSalary / workingHours) / SECONDS_PER_HOUR;
        newCost = costPerSecond * updatedMeeting.durationInSeconds;
    }
    
    const finalMeeting = {
        ...updatedMeeting,
        cost: newCost,
        participantsCount: updatedMeeting.participants.length
    };

    setMeetingsHistory(prev => prev.map(m => m.id === finalMeeting.id ? finalMeeting : m));
  }, []);

  const deleteMeeting = useCallback((id: string) => {
     if(window.confirm("Are you sure you want to delete this meeting from history?")) {
        setMeetingsHistory(prev => prev.filter(m => m.id !== id));
     }
  }, []);

  const exportHistoryToCSV = useCallback(() => {
    if (meetingsHistory.length === 0) return;

    const headers = ['Name', 'Date', 'Cost (EUR)', 'Duration (HH:MM:SS)', 'Rating (1-5)', 'Participants Count'];
    const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(11, 8);
    
    const rows = meetingsHistory.map(m => [
        `"${m.name.replace(/"/g, '""')}"`,
        new Date(m.date).toLocaleDateString(),
        m.cost.toFixed(2),
        formatTime(m.durationInSeconds),
        m.rating,
        m.participantsCount
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "meeting_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [meetingsHistory]);


  const addParticipant = useCallback((name: string, salaryInThousands: number) => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name,
      annualSalary: salaryInThousands * 1000,
    };
    setParticipants((prev) => [...prev, newParticipant]);
  }, []);

  const bulkAddParticipants = useCallback((count: number, salaryInThousands: number) => {
    const existingAnonymousCount = participants.filter(p => p.name.startsWith("Participant #")).length;
    const newParticipants: Participant[] = [];
    for (let i = 0; i < count; i++) {
        newParticipants.push({
            id: crypto.randomUUID(),
            name: `Participant #${existingAnonymousCount + i + 1}`,
            annualSalary: salaryInThousands * 1000
        });
    }
    setParticipants(prev => [...prev, ...newParticipants]);
  }, [participants]);

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearParticipants = useCallback(() => {
    if (window.confirm("Are you sure you want to remove all participants?")) {
      setParticipants([]);
    }
  }, []);

  const navButtonClass = (buttonView: 'calculator' | 'history') => 
    `px-4 py-2 rounded-md font-medium transition-colors ${view === buttonView 
      ? 'bg-indigo-600 text-white' 
      : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`;

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white">Meeting Cost Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Track the cost of your meetings in real-time.</p>
        <nav className="mt-6 flex justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button onClick={() => setView('calculator')} className={navButtonClass('calculator')}>
            Calculator
          </button>
          <button onClick={() => setView('history')} className={navButtonClass('history')}>
            History
          </button>
        </nav>
      </header>
      
      {view === 'calculator' && (
        <>
        <main className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <TimerDisplay 
              timeInSeconds={timeInSeconds} 
              totalCost={totalCost}
              costPerSecond={costPerSecond}
              participants={participants}
            />
            <ControlButtons
              isActive={isActive}
              timeInSeconds={timeInSeconds}
              onStart={handleStart}
              onPause={handlePause}
              onEnd={handleEnd}
              hasParticipants={participants.length > 0}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="space-y-6">
                <BulkAddParticipant onBulkAdd={bulkAddParticipants} />
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-slate-800 px-3 text-sm font-medium text-slate-500">
                      OR ADD INDIVIDUALLY
                    </span>
                  </div>
                </div>
                <ParticipantForm addParticipant={addParticipant} />
            </div>
            <div className="mt-8">
              <ParticipantList 
                participants={participants} 
                removeParticipant={removeParticipant} 
                clearParticipants={clearParticipants}
              />
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} Meeting Cost Calculator. All rights reserved.</p>
        </footer>
        </>
      )}

      {view === 'history' && (
        <HistoryView 
            history={meetingsHistory} 
            onUpdate={updateMeeting} 
            onDelete={deleteMeeting} 
            onExport={exportHistoryToCSV}
        />
      )}

      <SaveMeetingModal 
        isOpen={isSaveModalOpen}
        onSave={handleSaveMeeting}
        onDiscard={handleDiscardMeeting}
        onResume={handleResume}
      />
    </div>
  );
};

export default App;
