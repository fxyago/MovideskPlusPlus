import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import mpp_logo from '@assets/img/M++_Logo.png';
import AutoTheme from '../AutoTheme';
import MenuTabs from '../Tabs';

export const MainMenu = () => {
  return (
    <>
      <AutoTheme />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center outline-none select-none size-full">
          <img
            src={mpp_logo}
            alt="Movidesk++ logo"
            className="outline-none select-none block align-middle h-12"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-[360px] min-h-[160px] h-auto max-h-[560px] bg-muted rounded-lg shadow-lg mr-8">
          <MenuTabs />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
