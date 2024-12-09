import {
  Context,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
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
import { useAppContext } from "./AppContext";
import {
  PlaylistContext,
  PlaylistSongContext,
  ProfileContext,
  SongContext
} from "./DataContext";

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

const ProfileProvider = createProvider<Profile>("profile", {
  adapter: window.ipc.adapters.profiles,
  Context: ProfileContext
});

const PlaylistProvider = createProvider<Playlist>("playlist", {
  adapter: window.ipc.adapters.playlists,
  Context: PlaylistContext
});

const SongProvider = createProvider<Song>("song", {
  adapter: window.ipc.adapters.songs,
  Context: SongContext
});

const PlaylistSongProvider = createProvider<PlaylistSong>("playlist_song", {
  adapter: window.ipc.adapters.playlists_songs,
  Context: PlaylistSongContext
});

function createProvider<T extends Item>(
  type: T["type"],
  options: {
    adapter: IPCAdapter<T>;
    Context: Context<DataStore<T> | undefined>;
  }
) {
  const { adapter, Context } = options;
  const Provider: React.FC<PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<Record<string, T>>({});
    useEffect(() => {
      console.log(`[${type}]`, { ...state });
    }, [type, state]);

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

  return Provider;
}

interface DataStore<T extends Item> {
  state: Record<string, T>;
  setState: Dispatch<SetStateAction<Record<string, T>>>;
}
