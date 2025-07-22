import { useStore } from 'zustand';
import { mppStore } from '../state';
import { TicketList } from '../TicketList';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { removeBookmarkedFromElement } from '@/lib/MovideskActions';
import { cn } from '@/lib/utils';
import { TicketWithTimestamp } from '@/types';
import { HighlightRanges } from '@nozbe/microfuzz';
import { Highlight, useFuzzySearchList } from '@nozbe/microfuzz/react';
import { BookmarkMinus } from 'lucide-react';
import { toast } from 'sonner';
import { Ticket } from '../components/Ticket';

export default function Bookmarks({ search }: { search: string }) {
  const store = useStore(mppStore);

  const isDarkMode =
    store.theme === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const filteredList = useFuzzySearchList({
    list: store.bookmarks,
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
    <TicketList list={store.bookmarks} emptyMessage="Nenhum ticket favoritado">
      {list.length === 0
        ? search.length > 0 && (
            <div className="text-foreground/50 mt-8 flex h-full w-full items-center justify-center">
              <div className="text-center text-xl">
                Nenhum ticket encontrado
              </div>
            </div>
          )
        : list.map((ticket) => (
            <ContextMenu key={ticket.id}>
              <ContextMenuTrigger>
                <Ticket
                  key={ticket.id}
                  ticket={ticket}
                  tooltipMessage={'Favoritado em:'}
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
                    store.unbookmark(ticket.id);
                    toast.success(
                      `Ticket ${ticket.id} removido dos favoritos!`
                    );
                    removeBookmarkedFromElement(ticket.id);
                  }}
                >
                  <BookmarkMinus className="size-6" />
                  Desfavoritar
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
    </TicketList>
  );
}
