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
import { AppContext } from "./AppProvider";
import { ThemeContext } from "./ThemeProvider";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeContext");
  }
  return context;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContext");
  }
  return context;
};

export const [ProfileProvider, useProfileContext] = createStoreAdapter<Profile>(
  "profile",
  window.ipc.adapters.profiles
);
export const [PlaylistProvider, usePlaylistContext] =
  createStoreAdapter<Playlist>("playlist", window.ipc.adapters.playlists);
export const [SongProvider, useSongContext] = createStoreAdapter<Song>(
  "song",
  window.ipc.adapters.songs
);
export const [PlaylistSongProvider, usePlaylistSongContext] =
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

    const { setState: setAppState } = useAppContext();
    useEffect(() => {
      adapter.list().then(data => {
        onSnapshotChange(data.map(data => ({ action: "created", data })));
        setAppState(state => ({
          ...state,
          dataStatus: { ...state.dataStatus, [type]: "loaded" }
        }));
      });

      return window.ipc?.subscribe("change", (_ctx, item) => {
        if (item.data.type !== type) return;
        onSnapshotChange([item as ItemSnapshot<T>]);
      });
    }, [onSnapshotChange, setAppState]);

    const value = useMemo(() => ({ state, setState }), [state]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
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
