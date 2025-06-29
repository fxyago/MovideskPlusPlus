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
  bookmarks: TicketWithTimestamp[];
  bookmark: (ticket: TicketWithTimestamp) => void;
  setBookmarks: (bookmarks: TicketWithTimestamp[]) => void;
  unbookmark: (ticketId: string) => void;
  isBookmarked: (ticketId: string) => boolean;
  clearBookmarks: () => void;
}

const createTicketBookmarkSlice: StateCreator<TicketBookmarkStore> = (
  set,
  get
) => ({
  bookmarks: [] as TicketWithTimestamp[],
  setBookmarks: (bookmarks: TicketWithTimestamp[]) => set({ bookmarks }),
  bookmark: (ticket: TicketWithTimestamp) =>
    set((state) => ({
      bookmarks: [ticket, ...state.bookmarks].toSorted(
        (a, b) => b.timestamp - a.timestamp
      ) as TicketWithTimestamp[],
    })),
  unbookmark: (ticketId: string) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter(
        (t) => t.id !== ticketId
      ) as TicketWithTimestamp[],
    })),
  isBookmarked: (ticketId) => get().bookmarks.some((t) => t.id === ticketId),
  clearBookmarks: () => set({ bookmarks: [] }),
});

interface TicketHistoryStore {
  history: TicketWithTimestamp[];
  setHistory: (history: TicketWithTimestamp[]) => void;
  addToHistory: (...tickets: TicketWithTimestamp[]) => void;
  removeFromHistory: (...tickets: TicketWithTimestamp[]) => void;
  clearHistory: () => void;
}

const createTicketHistorySlice: StateCreator<TicketHistoryStore> = (
  set,
  get
) => ({
  history: [] as TicketWithTimestamp[],
  setHistory: (history: TicketWithTimestamp[]) => set({ history }),
  addToHistory: (...tickets: TicketWithTimestamp[]) =>
    set((state) => ({
      history: mergeAndFilter({
        arr1: state.history,
        arr2: tickets,
        groupProperty: 'id',
        maxCallback: (obj) => obj.timestamp,
      }).toSorted((a, b) => b.timestamp - a.timestamp),
    })),
  removeFromHistory: (...tickets: TicketWithTimestamp[]) =>
    set((state) => ({
      history: state.history.filter((t) =>
        tickets.some((t2) => t2.id === t.id)
      ) as TicketWithTimestamp[],
    })),
  clearHistory: () => set({ history: [] }),
});

interface TicketLastSessionStore {
  lastSession: TicketWithTimestamp[];
  setLastSession: (...tickets: TicketWithTimestamp[]) => void;
}

const createTicketLastSessionSlice: StateCreator<TicketLastSessionStore> = (
  set
) => ({
  lastSession: [] as TicketWithTimestamp[],
  setLastSession: (...tickets: TicketWithTimestamp[]) =>
    set(() => ({
      lastSession: tickets.toSorted((a, b) => b.timestamp - a.timestamp),
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
      name: 'MovideskPlusPlusStore',
      storage: createJSONStorage(() =>
        import.meta.env.DEV ? localStorage : ChromeLocalStorage
      ),
      version: 1,
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
      title: 'Movidesk++ Example 1 teste 123 asdasd ',
      timestamp: new Date().getTime(),
      type: 'internal',
    },
    {
      id: '1',
      title: 'Movidesk++ Example 2 teste 123',
      timestamp: new Date().getTime(),
      type: 'public',
    },
    {
      id: '2',
      title: 'Movidesk++ Example 3 123 teste nome grande aaa bbb ccc ddd',
      timestamp: new Date().getTime(),
    },
  ] as TicketWithTimestamp[];

  const state = mppStore.getState();

  state.setLastTab('CONFIG');
  state.setTheme('dark');
  state.setCustomTone(true);
  state.clearHistory();
  state.addToHistory(...exampleTickets);
  state.setLastSession(...exampleTickets);
  state.clearBookmarks();
  exampleTickets.forEach((ticket) => state.bookmark(ticket));
}
