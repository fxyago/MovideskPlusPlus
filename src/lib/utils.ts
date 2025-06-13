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
          resolve(null); // Resolve with null if timeout and element not found
        }
      }, timeout);
    }
  });
};

export const waitToast = (callback: () => void) =>
  waitForElement(".toaster", callback);
