import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { Ticket } from '../components/Ticket';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

export default function History() {
  const store = useStore(mppStore);

  return (
    <TicketList list={store.history} emptyMessage="Nenhum ticket no histórico">
      {store.history.map((ticket) => (
        <ContextMenu key={ticket.id}>
          <ContextMenuTrigger>
            <Ticket
              key={ticket.id}
              ticket={ticket}
              tooltipMessage={'Visto pela última vez em:'}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              variant="destructive"
              className="p-2! text-xl font-semibold"
              onClick={() => {
                store.removeFromHistory(ticket);
                toast.success(`Ticket ${ticket.id} removido do histórico!`);
              }}
            >
              <Trash className="size-6" /> Remover
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </TicketList>
  );
}
