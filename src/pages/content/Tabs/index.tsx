import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tab } from '@/types';
import { useStore } from 'zustand';
import Bookmarks from '../Bookmarks';
import History from '../History';
import LastSession from '../LastSession';
import ToggleDarkMode from '../ToggleDarkMode';
import { mppStore } from '../state';

const BOOKMARKED: Tab = 'BOOKMARKED';
const LAST_SESSION: Tab = 'LAST_SESSION';
const HISTORY: Tab = 'HISTORY';
const CONFIG: Tab = 'CONFIG';

export default function MenuTabs() {
  const store = useStore(mppStore);

  return (
    <Tabs className="max-w-full grow gap-2 p-2!" defaultValue={store.lastTab}>
      <TabsList className="bg-foreground/10 min-h-16 w-full shadow">
        <TabsTrigger value={BOOKMARKED}>Favoritos</TabsTrigger>
        <TabsTrigger value={LAST_SESSION}>Última Sessão</TabsTrigger>
        <TabsTrigger value={HISTORY}>Histórico</TabsTrigger>
        <TabsTrigger value={CONFIG}>Config</TabsTrigger>
      </TabsList>
      <div className="bg-foreground/10 size-full rounded-md p-2 *:size-full">
        <TabsContent value={BOOKMARKED} className="p-2">
          <Bookmarks />
        </TabsContent>
        <TabsContent value={LAST_SESSION} className="p-2">
          <LastSession />
        </TabsContent>
        <TabsContent value={HISTORY} className="p-2">
          <History />
        </TabsContent>
        <TabsContent value={CONFIG} className="p-2">
          <ToggleDarkMode />
        </TabsContent>
      </div>
    </Tabs>
  );
}
