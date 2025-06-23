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

export default function LastSession() {
  const store = useStore(mppStore);

  return (
    <TicketList
      isListEmpty={store.lastSession.length === 0}
      emptyMessage="Nenhum ticket salvo na última sessão"
    >
      {store.lastSession.map((ticket) => (
        <ContextMenu>
          <ContextMenuTrigger>
            <Ticket
              key={ticket.id}
              ticket={ticket}
              tooltipMessage={'Salvo em:'}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              variant="destructive"
              onClick={() => {
                store.setLastSession(
                  ...store.lastSession.filter((t) => t.id !== ticket.id)
                );
                toast.success(
                  `Ticket ${ticket.id} removido da lista da ultima sessão!`
                );
              }}
            >
              Remover da lista
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </TicketList>
  );
}
