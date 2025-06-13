import { Toaster } from "@/components/ui/sonner";
import { waitForElement } from "@/lib/utils";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";
import { MainMenu } from "./menu";
import "./style.css";

if (localStorage.getItem("theme") === "dark")
  document.documentElement.classList.add("dark");

waitForElement("#main-menu", (element) => {
  const toastFooter = document.createElement("footer");
  toastFooter.id = "__toast_root";
  element.appendChild(toastFooter);
  const rootContainer = document.querySelector("#__toast_root");
  if (!rootContainer) throw new Error("Can't find toast root element");
  const root = createRoot(rootContainer);
  root.render(<Toaster className="text-black" />);
});

waitForElement(".chat-group-dropdown-actions", (element) => {
  const rootButton = document.createElement("li");
  rootButton.classList.add("top-user-itens-icons-container");
  element.insertAdjacentElement("afterend", rootButton);
  createRoot(rootButton).render(MainMenu());
  setTimeout(() => {
    toast.success("Movidesk++ carregado!");
  }, 100);
});

waitForElement("#tabs", () => {
  setInterval(() => {
    const actionTabsElement = document
      .getElementsByClassName("top-user-itens")
      .item(0);
    const width = actionTabsElement?.clientWidth ?? 300;
    const widthText = `width: calc(100% - ${width}px);`;

    const ticketTabsElement = document.getElementById("tabs");

    if (ticketTabsElement) ticketTabsElement.style.cssText = widthText;
  }, 2000);
});
