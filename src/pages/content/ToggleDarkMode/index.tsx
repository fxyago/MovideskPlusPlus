import { Button } from "@/components/ui/button";
import { Tone } from "@/types";
import { useModeAnimation } from "react-theme-switch-animation";
import { useStore } from "zustand";
import { mppStore } from "../state";

const toneCycle: Tone[] = ["none", "blue", "red", "green", "purple"];

const getNextTone = (currentValue: Tone): Tone => {
  const currentIndex = toneCycle.indexOf(currentValue);

  if (currentIndex === -1) return toneCycle[0];

  const nextIndex = (currentIndex + 1) % toneCycle.length;
  return toneCycle[nextIndex];
};

export default function ToggleDarkMode() {
  const store = useStore(mppStore);

  const { ref, toggleSwitchTheme } = useModeAnimation({
    isDarkMode: store.theme === "dark",
    onDarkModeChange: (isDarkMode) =>
      store.setTheme(isDarkMode ? "dark" : "light"),
  });

  return (
    <div className="flex flex-col items-center space-y-2 h-full">
      <Button
        ref={ref}
        className="hover:bg-muted h-fit w-full !m-4"
        onClick={toggleSwitchTheme}
      >
        Toggle Dark Mode
      </Button>
      <Button
        className="flex-col hover:bg-muted h-fit w-full !m-4"
        onClick={() => store.setTone(getNextTone(store.tone))}
      >
        <span>Cycle Dark Mode Themes</span>
        <span>Current Theme: {store.tone}</span>
      </Button>
    </div>
  );
}
