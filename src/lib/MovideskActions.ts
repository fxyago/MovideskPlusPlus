import { mppStore } from '@/pages/content/state';
import { Appointment, Ticket } from '@/types';
import { toast } from 'sonner';
import { titleToTicket } from './utils';

import { LastAppointments } from '@/pages/content/LastAppointments';
import { createRoot } from 'react-dom/client';

export const openTicket = (ticketId: string) => {
  let input = document.getElementById(
    'go-straight-to-ticket'
  ) as HTMLInputElement | null;

  if (!input) return;

  input.value = ticketId;
  const enter = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    which: 13,
    keyCode: 13,
    bubbles: true,
    cancelable: true,
  });
  input.dispatchEvent(enter);
  const change = new Event('change', { bubbles: true });
  input.dispatchEvent(change);
};

export const getOpenedTickets = () => {
  const ticketList = document.getElementsByClassName(
    'tab-li tab-ticket tab-ticket-form'
  );

  if (!ticketList || ticketList.length == 0) return;

  return new Array(...ticketList)
    .map((t) => {
      const ticketData = t
        .querySelector('.tab-title')
        ?.textContent?.split(/-(.*)/s) ?? ['-1', 'null'];
      return {
        id: ticketData[0],
        title: ticketData[1],
        type: t.classList.contains('internal') ? 'internal' : 'public',
      } as Ticket;
    })
    .filter((t) => t.id.toString() !== '-1');
};

const extractAppointments = (appointmentsElements: Element[]) => {
  const appointments = [] as Appointment[];

  appointmentsElements.forEach((appointmentElement) => {
    const appointmentDate =
      appointmentElement.querySelector<HTMLInputElement>('.appointment-date')
        ?.value ?? '';
    const start =
      appointmentElement.querySelector<HTMLInputElement>(
        '.time-appointment-period-start input'
      )?.value ?? '';
    const end =
      appointmentElement.querySelector<HTMLInputElement>(
        '.time-appointment-period-end input'
      )?.value ?? '';

    appointments.push({
      date: appointmentDate,
      start,
      end,
    });
  });

  return appointments;
};

export const getOpenedTicketsWithDetails = () => {
  const ticketList = document.getElementsByClassName(
    'tab-li tab-ticket tab-ticket-form'
  );

  if (!ticketList || ticketList.length == 0) return;

  return new Array(...ticketList)
    .map((t) => {
      const ticketData = t
        .querySelector('.tab-title')
        ?.textContent?.split(/-(.*)/s)
        .map((t) => t.trim()) ?? ['-1', 'null'];

      const ticketPane = document.querySelector(
        `.tab-pane[data-tab-group="${ticketData[0]}"]`
      );

      const appointmentsElements = ticketPane
        ? new Array(
            ...ticketPane.querySelectorAll(
              '.ticket-appointments-container:not([style*="display: none"])'
            )
          )
        : [];

      const text = ticketPane?.querySelector('.fr-element.fr-view')?.innerHTML;
      const appointments = extractAppointments(appointmentsElements);

      return {
        id: ticketData[0],
        title: ticketData[1],
        type: t.classList.contains('internal') ? 'internal' : 'public',
        details: {
          text,
          appointments,
        },
      } as Ticket;
    })
    .filter((t) => t.id.toString() !== '-1');
};

export const fixCloseIcon = () => {
  document.querySelectorAll('button.close').forEach((element) => {
    element.nodeValue = '\u00d7';
  });
};

export const removeBookmarkedFromElement = (ticketId: string) => {
  const ticket = document.getElementsByClassName(
    `tab-ticket-${ticketId} bookmarked`
  );

  if (!ticket) return;

  ticket.item(0)?.classList.remove('bookmarked');
};

export const bindTicketBookmark = (element: HTMLElement) => {
  const title = element.querySelector('.tab-title')?.textContent ?? '';
  let bookmarkButton = element.querySelector('.bookmark-button');

  if (!title.length || title === 'Carregando' || bookmarkButton) return;

  bookmarkButton = document.createElement('button');

  const ticket = titleToTicket(title);

  const isBookmarked = mppStore.getState().isBookmarked(ticket.id);

  const className =
    'absolute top-1 left-1 bookmark-button z-10 opacity-0 group-hover:opacity-100 group-[.bookmarked]:opacity-100 group-[.bookmarked]:**:[svg]:fill-current';

  bookmarkButton.classList.add(...className.split(' '));

  element.classList.add('group');
  if (isBookmarked) element.classList.add('bookmarked');

  bookmarkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
  element.appendChild(bookmarkButton);

  bookmarkButton.addEventListener('click', () => {
    const store = mppStore.getState();
    const isBookmarked = store.isBookmarked(title.split('-')[0]);

    if (isBookmarked) {
      store.unbookmark(ticket.id);
      element.classList.remove('bookmarked');
      toast.success(`Ticket ${ticket.id} removido dos favoritos!`);
    } else {
      store.bookmark({
        ...ticket,
        type: element.classList.contains('internal') ? 'internal' : 'public',
        timestamp: new Date().getTime(),
      });
      element.classList.add('bookmarked');
      toast.success(`Ticket ${ticket.id} adicionado aos favoritos!`);
    }
  });
};

export const mountSavedAppointments = (element: HTMLElement) => {
  const pane = element.closest('.tab-pane[data-tab-group]');
  if (!pane) return;

  const ticketId = pane.getAttribute('data-tab-group');
  if (!ticketId) return;

  const ticket = mppStore.getState().lastSession.find((t) => t.id === ticketId);
  if (!ticket || !ticket.details?.appointments) return;

  const elementExists = document.getElementById(
    `ticket-${ticket.id}-last-appointments`
  );
  if (elementExists) return;

  const root = document.createElement('div');
  root.id = `ticket-${ticket.id}-last-appointments`;

  element.insertAdjacentElement('beforebegin', root);

  createRoot(root).render(LastAppointments(ticket));
};
