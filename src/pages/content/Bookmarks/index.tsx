import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { Ticket } from '../components/Ticket';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

export default function Bookmarks() {
  const store = useStore(mppStore);

  return (
    <TicketList list={store.bookmarks} emptyMessage="Nenhum ticket favoritado">
      {store.bookmarks.map((ticket) => (
        <ContextMenu key={ticket.id}>
          <ContextMenuTrigger asChild>
            <Ticket
              key={ticket.id}
              ticket={ticket}
              tooltipMessage={'Favoritado em:'}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              variant="destructive"
              onClick={() => {
                store.unbookmark(ticket.id);
                toast.success(`Ticket ${ticket.id} removido dos favoritos!`);
              }}
            >
              Desfavoritar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </TicketList>
  );
}
