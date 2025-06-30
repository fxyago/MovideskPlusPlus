import { Ticket } from '@/types';
import { Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import { mppStore } from '../state';

export const LastAppointments = (ticket: Ticket) => {
  return (
    <div
      id={`ticket-${ticket.id}-last-appointments`}
      className="bg-yellow-600 p-4 *:text-zinc-800!"
    >
      <div className="flex items-center justify-between">
        <h5 className="font-semibold text-zinc-800!">
          Apontamentos salvos da última sessão:
        </h5>
        <span className="space-x-4">
          <button
            className="font-semibold text-zinc-800!"
            about="Ocultar apontamentos salvos desse ticket"
            onClick={() => {
              document
                .getElementById(`ticket-${ticket.id}-last-appointments`)!
                .classList.add('hidden');
              toast.success('Apontamentos de última sessão ocultados');
            }}
          >
            <X />
          </button>
          <button
            className="font-semibold text-zinc-800!"
            about="Deletar e ocultar apontamentos salvos desse ticket"
            onClick={() => {
              mppStore.getState().removeSavedAppointments(ticket.id);
              document
                .getElementById(`ticket-${ticket.id}-last-appointments`)!
                .classList.add('hidden');
              toast.success('Apontamentos salvos deletados');
            }}
          >
            <Trash />
          </button>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {ticket.details!.appointments.map((appointment, index) => (
          <div
            key={`ticket-${ticket.id}-last-appointments-${index}`}
            className="flex items-center gap-20"
          >
            <div className="flex flex-col font-semibold">
              <span className="text-zinc-800!">Data:</span>
              <span className="font-normal text-zinc-800!">
                {appointment.date}
              </span>
            </div>
            <div className="flex flex-col font-semibold">
              <span className="text-zinc-800!">Início:</span>
              <span className="font-normal text-zinc-800!">
                {appointment.start}
              </span>
            </div>
            <div className="flex flex-col font-semibold">
              <span className="text-zinc-800!">Fim:</span>
              <span className="font-normal text-zinc-800!">
                {appointment.end.length ? appointment.end : '--:--'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
