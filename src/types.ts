export type Appointment = {
  date: string;
  start: string;
  end: string;
};

export type Ticket = {
  id: string;
  title: string;
  type?: 'internal' | 'public';

  details?: {
    text?: string;
    appointments: Appointment[];
  };
};

export type TicketWithTimestamp = Ticket & {
  timestamp: EpochTimeStamp;
};

export type Tone = 'none' | 'blue' | 'red' | 'green' | 'purple';

export type Tab = 'BOOKMARKED' | 'LAST_SESSION' | 'HISTORY' | 'CONFIG';
