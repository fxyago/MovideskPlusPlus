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
