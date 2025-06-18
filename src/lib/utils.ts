import { Ticket } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const observeElementInsertion = (
  targetClasses: string[],
  callback: (addedNode: HTMLElement) => void
) => {
  if (!Array.isArray(targetClasses) || targetClasses.length === 0) {
    console.error("targetClasses must be a non-empty array of strings.");
    return;
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        for (const addedNode of mutation.addedNodes) {
          if (
            addedNode.nodeType === Node.ELEMENT_NODE &&
            addedNode instanceof HTMLElement
          ) {
            const hasAllClasses = targetClasses.every((cls) =>
              addedNode.classList.contains(cls)
            );

            if (hasAllClasses) callback(addedNode);
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log(
    `MutationObserver iniciado, aguardando por inserção de elementos com as seguintes classes: "${targetClasses.join(
      ", "
    )}"`
  );
};

export const waitToast = (callback: () => void) =>
  waitForElement(".toaster", callback);

export const titleToTicket = (ticketTitle: string): Ticket => {
  const id = ticketTitle.split("-")[0];
  const title = ticketTitle.split("-")[1];
  return { id, title };
};

export const onPageLeave = (callback: () => void) => {
  window.addEventListener("pagehide", callback);
  window.addEventListener("beforeunload", callback);
};
