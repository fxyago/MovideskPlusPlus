import { mppStore } from '@/pages/content/state';
import { Ticket, Tone } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { groupBy, maxBy } from './lowerdash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const waitForElement = async (
  selector: string,
  callback: (element: HTMLElement) => void,
  timeout?: number
): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const observer = new MutationObserver((_mutationsList, observer) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        observer.disconnect();
        callback(element);
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (timeout) {
      setTimeout(() => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) {
          observer.disconnect();
          resolve(null);
        }
      }, timeout);
    }
  });
};

export const observeElementInsertion = ({
  targetClasses,
  exceptionClasses = [],
  callback,
}: {
  targetClasses: string[];
  exceptionClasses?: string[];
  callback: (addedNode: HTMLElement) => void;
}) => {
  if (!Array.isArray(targetClasses) || targetClasses.length === 0) {
    console.error('targetClasses must be a non-empty array of strings.');
    return;
  }

  const observer = new MutationObserver((mutationsList, _observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const addedNode of mutation.addedNodes) {
          if (
            addedNode.nodeType === Node.ELEMENT_NODE &&
            addedNode instanceof HTMLElement
          ) {
            const matches =
              targetClasses.every((cls) => addedNode.classList.contains(cls)) &&
              !exceptionClasses.some((cls) =>
                addedNode.classList.contains(cls)
              );

            if (matches) callback(addedNode);
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log(
    `MutationObserver iniciado, aguardando por inserção de elementos com as seguintes classes: "${targetClasses.join(
      ', '
    )}"`
  );
};

export const waitToast = (callback: () => void) =>
  waitForElement('.toaster', callback);

const splitOnFirts = (str: string, delimiter: string) => {
  const index = str.indexOf(delimiter);

  if (index === -1) return [str, ''];

  const partBefore = str.substring(0, index);
  const partAfter = str.substring(index + delimiter.length);
  return [partBefore, partAfter];
};

export const titleToTicket = (ticketTitle: string): Ticket => {
  const split = splitOnFirts(ticketTitle, '-');

  const id = split[0];
  const title = split[1];
  return { id, title };
};

export const mergeAndFilter = <T>({
  arr1,
  arr2,
  groupProperty,
  maxCallback,
}: {
  arr1: T[];
  arr2: T[];
  groupProperty: string;
  maxCallback?: (obj: T) => any;
}): T[] => {
  const combinedArray = [...arr1, ...arr2];
  const groupedByProperty = groupBy(combinedArray, groupProperty as any);

  return Object.values(groupedByProperty).map((group) => {
    if (maxCallback) {
      const maxItem = maxBy(group, maxCallback);
      return maxItem!;
    } else {
      return group[0];
    }
  });
};

export const onNavigateFromLogin = (callback: () => void) => {
  window.addEventListener('beforeunload', () => {
    if (window.location.pathname.includes('/Account/Login')) callback();
  });
};

export const onNavigate = (callback: () => void) => {
  window.addEventListener('beforeunload', (event) => {
    if (window.location.pathname.includes('/Account/Login')) return;
    callback();
    event.preventDefault();
  });
};

export const onToneConfigChange = (currentTone: Tone, previousTone: Tone) => {
  if (currentTone !== previousTone) {
    document.documentElement.classList.remove(`tone-${previousTone}`);
    if (currentTone !== 'none') {
      document.documentElement.classList.add(`tone-${currentTone}`);
    }
  }
};

export const onCustomToneChange = (
  currentUseCustomTone: boolean,
  previousUseCustomTone: boolean
) => {
  if (currentUseCustomTone === previousUseCustomTone) return;

  const docClasslist = document.documentElement.classList;
  if (currentUseCustomTone) docClasslist.remove('custom-tone');
  else docClasslist.add('custom-tone');
};

export const filterData = (obj: any) => {
  const filtededObj: any = {};
  for (const key in obj) {
    if (typeof obj[key] !== 'function') {
      filtededObj[key] = obj[key];
    }
  }
  return filtededObj;
};

export const exportState = (state: ReturnType<typeof mppStore.getState>) => {
  const data = filterData(state);
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const formatString = 'yyyy-MM-dd_HH-mm-ss';
  a.download = `MovideskPlusPlus ${format(new Date(), formatString)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Tickets exportados com sucesso!');
};

export const importState = (
  event: ChangeEvent<HTMLInputElement>,
  currentState: ReturnType<typeof mppStore.getState>,
  setState: typeof mppStore.setState
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e) => {
    const imported = JSON.parse(e.target?.result as string) as Partial<
      typeof currentState
    >;
    setState({ ...currentState, ...imported });
  };

  toast.success('Tickets importados com sucesso!');
};
