import { TicketWithTimestamp } from '@/types';
import { Ticket } from '../components/Ticket';

export const TicketList = ({
  list,
  search,
  emptyMessage,
  tooltipMessage,
}: {
  list: TicketWithTimestamp[];
  search?: string;
  emptyMessage: string;
  tooltipMessage?: string;
}) => {
  if (search) return <></>;

  return (
    <span id="ticketHistory" className="flex size-full flex-col">
      {list.length === 0 && (
        <span className="text-muted-foreground m-auto text-center">
          {emptyMessage}
        </span>
      )}
      {list.map((ticket) => (
        <Ticket
          key={ticket.id}
          ticket={ticket}
          tooltipMessage={tooltipMessage}
        />
      ))}
    </span>
  );
};
