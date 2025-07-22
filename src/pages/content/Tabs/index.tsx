import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tab } from '@/types';
import { useState } from 'react';
import { useStore } from 'zustand';
import Bookmarks from '../Bookmarks';
import History from '../History';
import LastSession from '../LastSession';
import Settings from '../Settings';
import { mppStore } from '../state';

const BOOKMARKED: Tab = 'BOOKMARKED';
const LAST_SESSION: Tab = 'LAST_SESSION';
const HISTORY: Tab = 'HISTORY';
const CONFIG: Tab = 'CONFIG';

export default function MenuTabs() {
  const store = useStore(mppStore);

  const [tab, setTab] = useState(store.lastTab);
  const [search, setSearch] = useState('');

  console.log('Current tab: ', tab);
  console.log('Search: ', search);

  return (
    <Tabs
      className="flex max-h-[560px] max-w-full grow gap-2 p-2!"
      defaultValue={store.lastTab}
      onValueChange={(value) => {
        setTab(value as Tab);
        store.setLastTab(value as Tab);
      }}
    >
      <TabsList className="bg-foreground/10 min-h-16 w-full shadow">
        <TabsTrigger value={BOOKMARKED}>Favoritos</TabsTrigger>
        <TabsTrigger value={LAST_SESSION}>Última Sessão</TabsTrigger>
        <TabsTrigger value={HISTORY}>Histórico</TabsTrigger>
        <TabsTrigger value={CONFIG}>Config</TabsTrigger>
      </TabsList>
      <div className="bg-foreground/10 max-h-[500px] grow rounded-md p-2">
        <span className="flex w-full items-center justify-between p-2!">
          <Input
            className="w-full p-6!"
            placeholder="Buscar..."
            hidden={tab === CONFIG}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
        <TabsContent value={BOOKMARKED} className="p-2">
          <Bookmarks search={search} />
        </TabsContent>
        <TabsContent value={LAST_SESSION} className="p-2">
          <LastSession search={search} />
        </TabsContent>
        <TabsContent value={HISTORY} className="p-2">
          <History search={search} />
        </TabsContent>
        <TabsContent value={CONFIG} className="p-2">
          <Settings search={search} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
