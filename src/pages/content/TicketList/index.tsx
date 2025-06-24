import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { openTicket } from '@/lib/MovideskActions';
import { TicketWithTimestamp } from '@/types';

export const TicketList = ({
  list,
  emptyMessage,
  children,
}: {
  list: TicketWithTimestamp[];
  emptyMessage: string;
  children?: React.ReactNode;
}) => {
  return (
    <span id="ticketHistory" className="flex size-full flex-col">
      {list.length === 0 && (
        <span className="text-muted-foreground m-auto text-center">
          {emptyMessage}
        </span>
      )}
      {list.length > 0 && (
        <div className="flex flex-col gap-2 p-2!">
          <Button
            className="h-12 font-semibold!"
            onClick={() => {
              list.forEach((t) => openTicket(t.id));
            }}
          >
            Abrir todos da lista
          </Button>
        </div>
      )}
      <ScrollArea className='h-[400px]!'>{children}</ScrollArea>
    </span>
  );
};
