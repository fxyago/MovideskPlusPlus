import { useStore } from 'zustand';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

export default function Bookmarks() {
  const store = useStore(mppStore);

  return (
    <TicketList
      list={store.ticketsBookmarked}
      emptyMessage="Nenhum ticket favoritado"
      tooltipMessage="Favoritado em:"
    />
  );
}
