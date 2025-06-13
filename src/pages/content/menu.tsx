import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import mpp from "@assets/img/mpp.png";
import ToggleDarkMode from "./toggleDarkMode";

export const MainMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-full outline-none select-none">
        <img
          src={mpp}
          alt="Movidesk++ logo"
          className="outline-none select-none block align-middle max-w-full h-auto"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1000] w-[320px] h-[520px] bg-muted rounded-md shadow-md">
        <Tabs className="size-full" defaultValue="LAST_SESSION">
          <TabsList className="w-full h-16 flex items-center justify-evenly">
            <TabsTrigger value="BOOKMARKED">Favoritos</TabsTrigger>
            <TabsTrigger value="LAST_SESSION">Tickets Antigos</TabsTrigger>
            <TabsTrigger value="HISTORY">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="BOOKMARKED" className="p-1">
            <div>Tickets favoritados!!</div>
            <ToggleDarkMode />
          </TabsContent>
          <TabsContent value="LAST_SESSION" className="p-1">
            <div>Teste tickets antigos aqui!!</div>
          </TabsContent>
          <TabsContent value="HISTORY" className="p-1">
            <div>Histórico de acessos!!</div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
