import { TicketWithTimestamp, Tone } from "@/types";
import { ChromeLocalStorage } from "zustand-chrome-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore, StateCreator } from "zustand/vanilla";

interface ThemeStore {
  theme: "light" | "dark";
  tone: Tone;
  setTheme: (theme: ThemeStore["theme"]) => void;
  setTone: (tonal: ThemeStore["tone"]) => void;
}

const createThemeSlice: StateCreator<ThemeStore> = (set, get) => ({
  theme: "light",
  tone: "blue",
  setTheme: (theme) => set({ theme }),
  setTone: (tonal) => set({ tone: tonal }),
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
  addToHistory: (ticket: TicketWithTimestamp) => void;
  removeFromHistory: (ticket: TicketWithTimestamp) => void;
}

const createTicketHistorySlice: StateCreator<TicketHistoryStore> = (
  set,
  get
) => ({
  ticketHistory: [] as TicketWithTimestamp[],
  getTicketHistory: () => get().ticketHistory,
  addToHistory: (ticket: TicketWithTimestamp) =>
    set((state) => ({
      ticketHistory: [...state.ticketHistory, ticket] as TicketWithTimestamp[],
    })),
  removeFromHistory: (ticket: TicketWithTimestamp) =>
    set((state) => ({
      ticketHistory: state.ticketHistory.filter(
        (t) => t.id !== ticket.id
      ) as TicketWithTimestamp[],
    })),
});

interface TicketLastSessionStore {
  ticketsLastSession: TicketWithTimestamp[];
  setLastSessionTickets: (tickets: TicketWithTimestamp[]) => void;
}

const createTicketLastSessionSlice: StateCreator<TicketLastSessionStore> = (
  set
) => ({
  ticketsLastSession: [] as TicketWithTimestamp[],
  setLastSessionTickets: (tickets: TicketWithTimestamp[]) =>
    set(() => ({
      ticketsLastSession: tickets,
    })),
});

export const mppStore = createStore<
  ThemeStore & TicketBookmarkStore & TicketHistoryStore & TicketLastSessionStore
>()(
  persist(
    (...a) => ({
      ...createThemeSlice(...a),
      ...createTicketBookmarkSlice(...a),
      ...createTicketHistorySlice(...a),
      ...createTicketLastSessionSlice(...a),
    }),
    {
      name: "ticketStore",
      storage: createJSONStorage(() => ChromeLocalStorage),
    }
  )
);

mppStore.subscribe((state, prevState) => {
  const currentTone = state.tone;
  const previousTone = prevState.tone;

  if (currentTone !== previousTone) {
    document.documentElement.classList.remove(`tone-${prevState.tone}`);
    if (currentTone !== "none") {
      document.documentElement.classList.add(`tone-${state.tone}`);
    }
  }
});
