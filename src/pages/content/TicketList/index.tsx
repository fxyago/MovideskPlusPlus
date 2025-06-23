export const TicketList = ({
  isListEmpty,
  emptyMessage,
  children,
}: {
  isListEmpty: boolean;
  emptyMessage: string;
  children?: React.ReactNode;
}) => {
  return (
    <span id="ticketHistory" className="flex size-full flex-col">
      {isListEmpty && (
        <span className="text-muted-foreground m-auto text-center">
          {emptyMessage}
        </span>
      )}
      {children}
    </span>
  );
};
