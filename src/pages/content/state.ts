import { Ticket } from "@/types";
import { atomWithStorage } from "jotai/utils";

export const darkModeAtom = atomWithStorage("darkMode", false);

export const lastSessionTicketsAtom = atomWithStorage(
  "lastSessionTickets",
  [] as Ticket[]
);

export const historyTicketsAtom = atomWithStorage(
  "historyTickets",
  [] as Ticket[]
);

export const bookmarkedTicketsAtom = atomWithStorage(
  "bookmarkedTickets",
  [] as Ticket[]
);
