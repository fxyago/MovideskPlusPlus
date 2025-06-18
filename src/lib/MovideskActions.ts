import { mppStore } from "@/pages/content/state";
import { titleToTicket } from "./utils";

export const openTicket = (ticketId: string) => {
  let input = document.getElementById(
    "go-straight-to-ticket"
  ) as HTMLInputElement | null;

  if (!input) return;

  input.value = ticketId;
  const enter = new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    which: 13,
    keyCode: 13,
    bubbles: true,
    cancelable: true,
  });
  input.dispatchEvent(enter);
  const change = new Event("change", { bubbles: true });
  input.dispatchEvent(change);
};

export const getOpenedTickets = () => {
  const ticketList = document.getElementsByClassName(
    "tab-li tab-ticket tab-ticket-form"
  );

  if (!ticketList || ticketList.length == 0) return;

  return new Array(...ticketList)
    .map((t) => {
      const ticketData = t
        .querySelector(".tab-title")
        ?.textContent?.split(/-(.*)/s) ?? ["-1", "null"];
      return { id: ticketData[0], title: ticketData[1] };
    })
    .filter((t) => t.id.toString() !== "-1");
};

export const bindTicketBookmark = (element: HTMLElement) => {
  const title = element.querySelector(".tab-title")?.textContent ?? "";
  let bookmarkButton = element.querySelector(".bookmark-button");

  if (!title.length || title === "Carregando" || bookmarkButton) return;

  bookmarkButton = document.createElement("button");

  const ticket = titleToTicket(title);

  const isBookmarked = mppStore.getState().isBookmarked(ticket.id);

  const className =
    "absolute top-1 left-1 bookmark-button z-20 opacity-0 [.bookmarked]:opacity-100 [.bookmarked]:fill-white in-focus:opacity-100";

  bookmarkButton.classList.add(...className.split(" "));

  if (isBookmarked) bookmarkButton.classList.add("bookmarked");

  bookmarkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
  element.appendChild(bookmarkButton);

  bookmarkButton.addEventListener("click", () => {
    const store = mppStore.getState();
    const isBookmarked = store.isBookmarked(title.split("-")[0]);

    if (isBookmarked) {
      console.log("Desfavoritando...");
      store.unbookmark(ticket.id);
    } else {
      console.log("Favoritando...");
      store.bookmark({ ...ticket, timestamp: new Date().getTime() });
    }
  });
};
