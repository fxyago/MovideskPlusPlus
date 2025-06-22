import { useStore } from 'zustand';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

export default function LastSession() {
  const store = useStore(mppStore);

  return (
    <TicketList
      list={store.ticketsLastSession}
      emptyMessage="Nenhum ticket salvo na última sessão"
    />
  );
}
