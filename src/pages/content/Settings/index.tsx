import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { exportState, importState } from '@/lib/utils';
import { Tone } from '@/types';
import { useRef } from 'react';
import { useModeAnimation } from 'react-theme-switch-animation';
import { useStore } from 'zustand';
import { mppStore } from '../state';

const toneCycle: Tone[] = ['none', 'blue', 'red', 'green', 'purple'];

const getNextTone = (currentValue: Tone): Tone => {
  const currentIndex = toneCycle.indexOf(currentValue);

  if (currentIndex === -1) return toneCycle[0];

  const nextIndex = (currentIndex + 1) % toneCycle.length;
  return toneCycle[nextIndex];
};

export default function Settings() {
  const store = useStore(mppStore);

  const isDarkMode = store.theme === 'dark';

  const importRef = useRef<HTMLInputElement>(null);

  const { ref, toggleSwitchTheme } = useModeAnimation({
    isDarkMode,
    onDarkModeChange: (isDarkMode) =>
      store.setTheme(isDarkMode ? 'dark' : 'light'),
  });

  return (
    <div className="flex flex-col rounded-lg border">
      <span className="px-4 pt-3! pb-2 text-2xl! font-semibold!">Tema:</span>
      <Separator />
      <div className="m-2 flex flex-col items-start space-y-4 *:my-4">
        <span className="flex w-full items-center justify-between px-4">
          <Label className="m-0 align-bottom text-2xl font-normal!">
            Dark Mode
          </Label>
          <Switch
            ref={ref}
            className="mr-3! mb-1! scale-[180%] border border-zinc-400/40!"
            checked={isDarkMode}
            onClick={toggleSwitchTheme}
          />
        </span>
        <span className="flex w-full items-center justify-between px-4">
          <Label className="m-0 align-bottom text-2xl font-normal!">
            Tema: {store.tone}
          </Label>
          <Button
            className="font-medium!"
            disabled={!isDarkMode}
            onClick={() => store.setTone(getNextTone(store.tone))}
          >
            Próximo Tema
          </Button>
        </span>
        <div className="w-full">
          <Label className="pl-4 text-2xl font-normal!">
            Configurações de Tickets:
          </Label>
          <span className="flex w-full items-center justify-between px-4">
            <Button
              className="p-6! font-medium!"
              onClick={() => importRef.current?.click()}
            >
              Importar Tickets
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => importState(e, store, mppStore.setState)}
              />
            </Button>
            <Button
              className="p-6! font-medium!"
              onClick={() => exportState(store)}
            >
              Exportar Tickets
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}
