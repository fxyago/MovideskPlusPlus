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

export default function History() {
  const store = useStore(mppStore);

  return (
    <TicketList
      isListEmpty={store.history.length === 0}
      emptyMessage="Nenhum ticket no histórico"
    >
      {store.history.map((ticket) => (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Ticket
              key={ticket.id}
              ticket={ticket}
              tooltipMessage={'Visto pela última vez em:'}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              variant="destructive"
              onClick={() => {
                store.removeFromHistory(ticket);
                toast.success(`Ticket ${ticket.id} removido do histórico!`);
              }}
            >
              Remover
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </TicketList>
  );
}
