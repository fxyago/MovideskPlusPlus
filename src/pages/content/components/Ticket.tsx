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
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
      <Tooltip delayDuration={900} disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'border-bottom border-background/80 h-fit w-full justify-start space-x-1 rounded-lg py-4 text-left text-lg font-medium',
              className
            )}
            onClick={() => openTicket(ticket.id)}
          >
            <Badge
              className={cn(
                'min-w-24 text-xl text-white!',
                ticket.type === 'internal' && 'bg-[rgb(142,36,170)]',
                ticket.type === 'public' && 'bg-[rgb(25,118,210)]',
                !ticket.type && 'bg-zinc-800'
              )}
            >
              {ticket.id}
            </Badge>
            <span className="truncate">{ticket.title}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-foreground bg-muted flex flex-col rounded-md text-lg font-bold shadow-md *:space-x-2">
          <div className="flex">
            <span>Ticket:</span>
            <span className="font-normal">{ticket.id}</span>
          </div>
          <div className="flex">
            <span>Tipo:</span>
            <span className="font-normal">
              {ticket.type
                ? ticket.type === 'internal'
                  ? 'Interno'
                  : 'Público'
                : 'Não definido'}
            </span>
          </div>
          <div className="flex">
            <span>Titulo:</span>
            <span className="block max-w-72 font-normal whitespace-break-spaces">
              {ticket.title}
            </span>
          </div>
          <div>
            <span>{tooltipMessage ?? 'Salvo em:'}</span>
            <span className="font-normal">
              {formatDistance(new Date(ticket.timestamp), new Date(), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
