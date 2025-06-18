import { useStore } from "zustand";
import { Ticket } from "../components/Ticket";
import { mppStore } from "../state";

export default function LastSession() {
  const store = useStore(mppStore);

  return (
    <span id="ticketLastSession" className="flex flex-col items-center">
      {store.getTicketBookmarks.length === 0 && (
        <span className="m-auto text-center text-muted-foreground">
          Nenhum ticket salvo na última sessão
        </span>
      )}
      {store.ticketsLastSession.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </span>
  );
}
