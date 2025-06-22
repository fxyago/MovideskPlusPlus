export type Ticket = {
  id: string;
  title: string;
};

export type TicketWithTimestamp = Ticket & {
  timestamp: EpochTimeStamp;
};

export type Tone = 'none' | 'blue' | 'red' | 'green' | 'purple';

export type Tab = 'BOOKMARKED' | 'LAST_SESSION' | 'HISTORY' | 'CONFIG';
