
export interface Participant {
  id: string;
  name: string;
  annualSalary: number;
}

export interface MeetingHistoryEntry {
  id: string;
  name: string;
  rating: number; // 1 to 5
  cost: number;
  durationInSeconds: number;
  date: string; // ISO string
  participantsCount: number;
  participants: Participant[];
  notes?: string;
}