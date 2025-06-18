import { useStore } from "zustand";
import { Ticket } from "../components/Ticket";
import { mppStore } from "../state";

export default function History() {
  const store = useStore(mppStore);

  return (
    <span id="ticketHistory" className="flex flex-col">
      {store.ticketHistory.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </span>
  );
}
