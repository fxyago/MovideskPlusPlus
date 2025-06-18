import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { openTicket } from "@/lib/MovideskActions";
import { cn } from "@/lib/utils";
import { TicketWithTimestamp } from "@/types";

export const Ticket = ({
  ticket,
  className,
}: {
  ticket: TicketWithTimestamp;
  className?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "truncate w-full justify-start rounded-none h-fit border-bottom border-background/80 px-8 py-4 text-lg font-medium hover:brightness-125",
              className
            )}
            onClick={() => openTicket(ticket.id)}
          >
            {ticket.id} - {ticket.title}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-foreground *:text-base bg-muted rounded-md shadow-md flex flex-col">
          <span>Ticket: {ticket.id}</span>
          <span>Título: {ticket.title}</span>
          <span>Salvo em: {new Date(ticket.timestamp).toLocaleString()}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
