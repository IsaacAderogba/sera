import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  IPCAdapter,
  Item,
  ItemSnapshot,
  Playlist,
  PlaylistSong,
  Profile,
  Song
} from "../preload/ipc";

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProfileProvider>
      <PlaylistProvider>
        <SongProvider>
          <PlaylistSongProvider>{children}</PlaylistSongProvider>
        </SongProvider>
      </PlaylistProvider>
    </ProfileProvider>
  );
};

export const [ProfileProvider, useProfileStore] = createStoreAdapter<Profile>(
  "profile",
  window.ipc.adapters.profiles
);
export const [PlaylistProvider, usePlaylistStore] =
  createStoreAdapter<Playlist>("playlist", window.ipc.adapters.playlists);
export const [SongProvider, useSongStore] = createStoreAdapter<Song>(
  "song",
  window.ipc.adapters.songs
);
export const [PlaylistSongProvider, usePlaylistSongStore] =
  createStoreAdapter<PlaylistSong>(
    "playlist_song",
    window.ipc.adapters.playlists_songs
  );

function createStoreAdapter<T extends Item>(
  type: T["type"],
  adapter: IPCAdapter<T>
) {
  const Context = createContext<DataStore<T> | undefined>(undefined);

  const Provider: React.FC<PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<Record<string, T>>({});

    const onSnapshotChange = useCallback((snapshots: ItemSnapshot<T>[]) => {
      setState(state => {
        const nextState = { ...state };

        for (const { action, data } of snapshots) {
          if (action === "deleted") {
            delete nextState[data.id];
          } else {
            nextState[data.id] = data;
          }
        }

        return nextState;
      });
    }, []);

    const store = useMemo(() => ({ state, setState }), [state]);

    useEffect(() => {
      adapter.list().then(data => {
        onSnapshotChange(data.map(data => ({ action: "created", data })));
      });

      return window.ipc?.subscribe("change", (_ctx, item) => {
        if (item.data.type !== type) return;
        onSnapshotChange([item as ItemSnapshot<T>]);
      });
    }, [onSnapshotChange]);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  function useDataStore() {
    const context = useContext(Context);
    if (!context) throw new Error("useContext must be used within a Provider");
    return context;
  }

  return [Provider, useDataStore] as const;
}

interface DataStore<T extends Item> {
  state: Record<string, T>;
  setState: Dispatch<SetStateAction<Record<string, T>>>;
}
