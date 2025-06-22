import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { openTicket } from '@/lib/MovideskActions';
import { cn } from '@/lib/utils';
import { TicketWithTimestamp } from '@/types';

export const Ticket = ({
  ticket,
  className,
  tooltipMessage,
}: {
  ticket: TicketWithTimestamp;
  className?: string;
  tooltipMessage?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'border-bottom border-background/80 h-fit justify-start space-x-1 rounded-none py-4 text-left text-lg font-medium hover:brightness-125',
              className
            )}
            onClick={() => openTicket(ticket.id)}
          >
            <Badge variant="secondary" className="min-w-24 text-xl">
              {ticket.id}
            </Badge>
            <span className="truncate">{ticket.title}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-foreground bg-muted flex flex-col space-y-2 rounded-md text-lg font-medium shadow-md *:space-x-2">
          <div className="flex">
            <span>Ticket:</span>
            <span className="font-normal">{ticket.id}</span>
          </div>
          <div className="flex">
            <span>Titulo:</span>
            <span className="block max-w-72 font-normal whitespace-break-spaces">
              {ticket.title}
            </span>
          </div>
          <div className="">
            <span>{tooltipMessage ?? 'Salvo em:'}</span>
            <span className="font-normal">
              {new Date(ticket.timestamp).toLocaleString()}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
