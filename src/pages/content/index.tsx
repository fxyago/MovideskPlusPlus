import { Toaster } from '@/components/ui/sonner';
import {
  bindTicketBookmark,
  fixCloseIcon,
  getOpenedTicketsWithDetails,
  mountSavedAppointments,
} from '@/lib/MovideskActions';
import {
  observeElementInsertion,
  onNavigateFromLogin,
  waitForElement,
} from '@/lib/utils';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import { MainMenu } from './Menu';
import { mppStore } from './state';
import './style.css';

waitForElement('#main-menu', (element) => {
  const toastFooter = document.createElement('footer');
  toastFooter.id = '__toast_root';
  element.appendChild(toastFooter);
  const rootContainer = document.querySelector('#__toast_root');
  if (!rootContainer) throw new Error("Can't find toast root element");
  const root = createRoot(rootContainer);
  root.render(<Toaster className="text-black" />);
});

waitForElement('.chat-group-dropdown-actions', (element) => {
  const rootButton = document.createElement('li');
  rootButton.classList.add('top-user-itens-icons-container');
  element.insertAdjacentElement('afterend', rootButton);
  createRoot(rootButton).render(MainMenu());
  setTimeout(() => {
    toast.success('Movidesk++ carregado!');
  }, 100);
});

waitForElement('#tabs', () => {
  setInterval(() => {
    const actionTabsElement = document
      .getElementsByClassName('top-user-itens')
      .item(0);
    const width = actionTabsElement?.clientWidth ?? 300;
    const widthText = `width: calc(100% - ${width}px);`;

    const ticketTabsElement = document.getElementById('tabs');

    if (ticketTabsElement) ticketTabsElement.style.cssText = widthText;
  }, 2000);
});

observeElementInsertion(
  ['tab-li', 'tab-ticket', 'tab-ticket-form'],
  bindTicketBookmark
);

observeElementInsertion(['ticket-appointments-container'], (el) => {
  mountSavedAppointments(el.closest('.ticket-appointments')!);
});

setTimeout(() => {
  document
    .querySelectorAll('.ticket-appointments')
    .forEach((element) => mountSavedAppointments(element as HTMLElement));
}, 1000);

setInterval(() => {
  document.querySelectorAll('tab-ticket-form').forEach((ticketElement) => {
    if (ticketElement instanceof HTMLElement) bindTicketBookmark(ticketElement);
  });

  fixCloseIcon();
}, 5000);

onNavigateFromLogin(() => {
  const state = mppStore.getState();
  state.setLastSession(...state.sessionBuffer);
});

setInterval(() => {
  const ticketsAbertos = getOpenedTicketsWithDetails() ?? [];

  const state = mppStore.getState();

  if (ticketsAbertos.length === 0) return;

  const timestamp = new Date().getTime();

  state.setSessionBuffer(
    ...ticketsAbertos.map((ticket) => ({
      ...ticket,
      timestamp,
    }))
  );

  ticketsAbertos.forEach((ticket) =>
    state.addToHistory({ ...ticket, timestamp })
  );
}, 10000);
