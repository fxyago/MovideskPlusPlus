import {
  mergeAndFilter,
  onCustomToneChange,
  onToneConfigChange,
} from '@/lib/utils';
import { Tab, TicketWithTimestamp, Tone } from '@/types';
import { ChromeLocalStorage } from 'zustand-chrome-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore, StateCreator } from 'zustand/vanilla';

interface GeneralConfigStore {
  lastTab: Tab;
  setLastTab: (lastTab: Tab) => void;
}

const createGeneralConfigSlice: StateCreator<GeneralConfigStore> = (set) => ({
  lastTab: 'BOOKMARKED',
  setLastTab: (lastTab) => set({ lastTab }),
});

interface ThemeStore {
  theme: 'light' | 'dark';
  tone: Tone;
  useCustomTone: boolean;
  setTheme: (theme: ThemeStore['theme']) => void;
  setTone: (tonal: ThemeStore['tone']) => void;
  setCustomTone: (customTone: ThemeStore['useCustomTone']) => void;
}

const createThemeSlice: StateCreator<ThemeStore> = (set, get) => ({
  theme: 'light',
  tone: 'none',
  useCustomTone: false,
  setTheme: (theme) => set({ theme }),
  setTone: (tonal) => set({ tone: tonal }),
  setCustomTone: (customTone) => set({ useCustomTone: customTone }),
});

interface TicketBookmarkStore {
  ticketsBookmarked: TicketWithTimestamp[];
  bookmark: (ticket: TicketWithTimestamp) => void;
  unbookmark: (ticketId: string) => void;
  isBookmarked: (ticketId: string) => boolean;
  getTicketBookmarks: () => TicketWithTimestamp[];
}

const createTicketBookmarkSlice: StateCreator<TicketBookmarkStore> = (
  set,
  get
) => ({
  ticketsBookmarked: [] as TicketWithTimestamp[],
  getTicketBookmarks: () => get().ticketsBookmarked,
  bookmark: (ticket: TicketWithTimestamp) =>
    set((state) => ({
      ticketsBookmarked: [
        ...state.ticketsBookmarked,
        ticket,
      ] as TicketWithTimestamp[],
    })),
  unbookmark: (ticketId: string) =>
    set((state) => ({
      ticketsBookmarked: state.ticketsBookmarked.filter(
        (t) => t.id !== ticketId
      ) as TicketWithTimestamp[],
    })),
  isBookmarked: (ticketId) =>
    get().ticketsBookmarked.some((t) => t.id === ticketId),
});

interface TicketHistoryStore {
  ticketHistory: TicketWithTimestamp[];
  addToHistory: (...tickets: TicketWithTimestamp[]) => void;
  removeFromHistory: (ticket: TicketWithTimestamp[]) => void;
}

const createTicketHistorySlice: StateCreator<TicketHistoryStore> = (
  set,
  get
) => ({
  ticketHistory: [] as TicketWithTimestamp[],
  getTicketHistory: () => get().ticketHistory,
  addToHistory: (...tickets: TicketWithTimestamp[]) =>
    set((state) => ({
      ticketHistory: mergeAndFilter({
        arr1: state.ticketHistory,
        arr2: tickets,
        groupProperty: 'id',
        maxCallback: (obj) => obj.timestamp,
      }),
    })),
  removeFromHistory: (tickets: TicketWithTimestamp[]) =>
    set((state) => ({
      ticketHistory: state.ticketHistory.filter((t) =>
        tickets.some((t2) => t2.id === t.id)
      ) as TicketWithTimestamp[],
    })),
});

interface TicketLastSessionStore {
  ticketsLastSession: TicketWithTimestamp[];
  setLastSessionTickets: (...tickets: TicketWithTimestamp[]) => void;
}

const createTicketLastSessionSlice: StateCreator<TicketLastSessionStore> = (
  set
) => ({
  ticketsLastSession: [] as TicketWithTimestamp[],
  setLastSessionTickets: (...tickets: TicketWithTimestamp[]) =>
    set(() => ({
      ticketsLastSession: tickets,
    })),
});

export const mppStore = createStore<
  GeneralConfigStore &
    ThemeStore &
    TicketBookmarkStore &
    TicketHistoryStore &
    TicketLastSessionStore
>()(
  persist(
    (...a) => ({
      ...createGeneralConfigSlice(...a),
      ...createThemeSlice(...a),
      ...createTicketBookmarkSlice(...a),
      ...createTicketHistorySlice(...a),
      ...createTicketLastSessionSlice(...a),
    }),
    {
      name: 'ticketStore',
      storage: createJSONStorage(() =>
        import.meta.env.DEV ? localStorage : ChromeLocalStorage
      ),
    }
  )
);

mppStore.subscribe((state, prevState) => {
  onToneConfigChange(state.tone, prevState.tone);
  onCustomToneChange(state.useCustomTone, prevState.useCustomTone);
});

if (import.meta.env.DEV) {
  const exampleTickets = [
    {
      id: '0',
      title: 'Movidesk++ Example 1',
      timestamp: new Date().getTime(),
    },
    {
      id: '1',
      title: 'Movidesk++ Example 2',
      timestamp: new Date().getTime(),
    },
    {
      id: '2',
      title: 'Movidesk++ Example 3',
      timestamp: new Date().getTime(),
    },
  ];

  mppStore.getInitialState().setLastTab('CONFIG');
  mppStore.getInitialState().setTheme('dark');
  mppStore.getInitialState().setCustomTone(true);
  mppStore.getInitialState().addToHistory(...exampleTickets);
  mppStore.getInitialState().setLastSessionTickets(...exampleTickets);
  exampleTickets.forEach((ticket) =>
    mppStore.getInitialState().addToHistory(ticket)
  );
  exampleTickets.forEach((ticket) =>
    mppStore.getInitialState().bookmark(ticket)
  );
}
