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
  try {
    const toastFooter = document.createElement('footer');
    toastFooter.id = '__toast_root';
    element.appendChild(toastFooter);
    const rootContainer = document.querySelector('#__toast_root');
    if (!rootContainer) throw new Error("Can't find toast root element");
    const root = createRoot(rootContainer);
    root.render(<Toaster className="text-black" />);
  } catch (error) {
    console.error(error);
  }
});

waitForElement('.chat-group-dropdown-actions', (element) => {
  try {
    const rootButton = document.createElement('li');
    rootButton.classList.add('top-user-itens-icons-container');
    element.insertAdjacentElement('afterend', rootButton);
    createRoot(rootButton).render(MainMenu());
    setTimeout(() => {
      toast.success('Movidesk++ carregado!');
    }, 100);
  } catch (error) {
    console.error(error);
  }
});

waitForElement('#tabs', () => {
  chrome.alarms.create({
    periodInMinutes: 1,
    delayInMinutes: 0,
    when: Date.now(),
  }).then(() => {
    try {
      const actionTabsElement = document
        .getElementsByClassName('top-user-itens')
        .item(0);
      const width = actionTabsElement?.clientWidth ?? 300;
      const widthText = `width: calc(100% - ${width}px);`;
  
      const ticketTabsElement = document.getElementById('tabs');
  
      if (ticketTabsElement) ticketTabsElement.style.cssText = widthText;
    } catch (error) {
      console.error(error);
    }
  });
});

observeElementInsertion({
  targetClasses: ['tab-li', 'tab-ticket', 'tab-ticket-form'],
  exceptionClasses: ['create'],
  callback: bindTicketBookmark,
});

observeElementInsertion({
  targetClasses: ['ticket-appointments-container'],
  callback: (el) => {
    let appointmentsElement = el.closest<HTMLElement>('.ticket-appointments');
    if (appointmentsElement) mountSavedAppointments(appointmentsElement);
  },
});

setTimeout(() => {
  try {
    document
      .querySelectorAll('.ticket-appointments')
      .forEach((element) => mountSavedAppointments(element as HTMLElement));
  } catch (error) {
    console.error(error);
  }
}, 1000);

setInterval(() => {
  try {
    document.querySelectorAll('.tab-ticket-form').forEach((ticketElement) => {
      const isTicketBindable =
        ticketElement instanceof HTMLElement &&
        !ticketElement.classList.contains('create');

      if (isTicketBindable) bindTicketBookmark(ticketElement);
    });

    fixCloseIcon();
  } catch (error) {
    console.error(error);
  }
}, 5000);

onNavigateFromLogin(() => {
  try {
    const state = mppStore.getState();
    state.setLastSession(...state.sessionBuffer);
  } catch (error) {
    console.error(error);
  }
});

setInterval(() => {
  try {
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
  } catch (error) {
    console.error(error);
  }
}, 10000);
