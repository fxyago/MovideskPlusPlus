import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import mpp from "@assets/img/mpp.png";
import AutoTheme from "./AutoTheme";
import Bookmarks from "./Bookmarks";
import History from "./History";
import ToggleDarkMode from "./toggleDarkMode";

export const MainMenu = () => {
  return (
    <>
      <AutoTheme />
      <DropdownMenu>
        <DropdownMenuTrigger className="h-full outline-none select-none">
          <img
            src={mpp}
            alt="Movidesk++ logo"
            className="outline-none select-none block align-middle max-w-full h-auto"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-30 w-[320px] h-[520px] bg-muted rounded-md shadow-md">
          <Tabs className="size-full" defaultValue="LAST_SESSION">
            <TabsList className="w-full h-16 flex items-center justify-evenly">
              <TabsTrigger value="BOOKMARKED">Favoritos</TabsTrigger>
              <TabsTrigger value="LAST_SESSION">Tickets Antigos</TabsTrigger>
              <TabsTrigger value="HISTORY">Histórico</TabsTrigger>
              <TabsTrigger value="CONFIG">Config</TabsTrigger>
            </TabsList>
            <TabsContent value="BOOKMARKED" className="p-1">
              <Bookmarks />
            </TabsContent>
            <TabsContent value="LAST_SESSION" className="p-1">
              <div>Teste tickets antigos aqui!!</div>
            </TabsContent>
            <TabsContent value="HISTORY" className="p-1">
              <History />
            </TabsContent>
            <TabsContent value="CONFIG" className="p-1">
              <ToggleDarkMode />
            </TabsContent>
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
