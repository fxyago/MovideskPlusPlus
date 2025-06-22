import { useStore } from 'zustand';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

export default function History() {
  const store = useStore(mppStore);

  return (
    <TicketList
      list={store.ticketHistory}
      emptyMessage="Nenhum ticket no histórico"
      tooltipMessage="Visto pela última vez em:"
    />
  );
}
