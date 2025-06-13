import { Button } from "@/components/ui/button";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";

export default function ToggleDarkMode() {
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
  });

  return (
    <Button ref={ref} onClick={toggleSwitchTheme}>
      Toggle Dark Mode
    </Button>
  );
}
