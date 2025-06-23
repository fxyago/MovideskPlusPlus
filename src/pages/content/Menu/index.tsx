import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import mpp_logo from '@/assets/img/M++_Logo.png?inline';
import AutoTheme from '../AutoTheme';
import MenuTabs from '../Tabs';

export const MainMenu = () => {
  return (
    <>
      <AutoTheme />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-full items-center justify-center outline-none select-none">
          <img
            src={mpp_logo}
            alt="Movidesk++ logo"
            className="block h-12 align-middle outline-none select-none"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-muted mr-8 flex h-auto max-h-[560px] min-h-[160px] w-[360px] rounded-lg shadow-lg">
          <MenuTabs />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
