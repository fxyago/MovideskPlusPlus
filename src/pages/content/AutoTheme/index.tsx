import { useEffect } from "react";
import { useStore } from "zustand";
import { mppStore } from "../state";

export default function AutoTheme() {
  const store = useStore(mppStore);

  useEffect(() => {
    if (store.theme === "dark") document.documentElement.classList.add("dark");

    if (store.tone !== "none")
      document.documentElement.classList.add(`tone-${store.tone}`);
  }, []);

  return <></>;
}
