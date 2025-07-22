import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { TicketWithTimestamp } from '@/types';
import { HighlightRanges } from '@nozbe/microfuzz';
import { Highlight, useFuzzySearchList } from '@nozbe/microfuzz/react';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { Ticket } from '../components/Ticket';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

export default function History({ search }: { search: string }) {
  const store = useStore(mppStore);

  const isDarkMode =
    store.theme === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const filteredList = useFuzzySearchList({
    list: store.history,
    queryText: search,
    strategy: 'smart',
    getText: (ticket) => [ticket.title],
    mapResultItem: ({ item, matches: [highlightRanges] }) =>
      ({
        ...item,
        highlightRanges,
      }) as TicketWithTimestamp & { highlightRanges: HighlightRanges },
  });

  const list = (
    search.length > 0 ? filteredList : store.bookmarks
  ) as (TicketWithTimestamp & { highlightRanges?: HighlightRanges })[];

  return (
    <TicketList list={store.history} emptyMessage="Nenhum ticket no histórico">
      {list.map((ticket) => (
        <ContextMenu key={ticket.id}>
          <ContextMenuTrigger>
            <Ticket
              key={ticket.id}
              ticket={ticket}
              tooltipMessage={'Visto pela última vez em:'}
              customTitle={
                ticket.highlightRanges ? (
                  <Highlight
                    className={cn(
                      isDarkMode ? 'bg-yellow-500/50!' : 'bg-yellow-500/40!'
                    )}
                    text={ticket.title}
                    ranges={ticket.highlightRanges}
                  />
                ) : (
                  ticket.title
                )
              }
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
