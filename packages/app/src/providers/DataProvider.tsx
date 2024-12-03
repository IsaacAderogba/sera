import {
  Context,
  createContext,
  Dispatch,
  Fragment,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Playlist, PlaylistSong, Profile, Song } from "../preload/ipc";

type ProfileStore = DataStore<Profile>;
type PlaylistStore = DataStore<Playlist>;
type SongStore = DataStore<Song>;
type PlaylistSongStore = DataStore<PlaylistSong>;

const ProfileContext = createContext<ProfileStore | undefined>(undefined);
const PlaylistContext = createContext<PlaylistStore | undefined>(undefined);
const SongContext = createContext<SongStore | undefined>(undefined);
const PlaylistSongContext = createContext<PlaylistSongStore | undefined>(
  undefined
);

export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const profileStore = useProfileStore({});
  const playlistStore = usePlaylistStore({});
  const songStore = useSongStore({});
  const playlistSongStore = usePlaylistSongStore({});

  useEffect(() => {
    // also need to populate the store here

    return window.ipc?.subscribe("change", (_ctx, item) => {
      /**
       * todo, update store based on data changes
       */
    });
  }, []);

  return (
    <ProfileContext.Provider value={profileStore}>
      <PlaylistContext.Provider value={playlistStore}>
        <SongContext.Provider value={songStore}>
          <PlaylistSongContext.Provider value={playlistSongStore}>
            {children}
          </PlaylistSongContext.Provider>
        </SongContext.Provider>
      </PlaylistContext.Provider>
    </ProfileContext.Provider>
  );
};

export const [useProfileContext, useProfileStore] =
  createDataAdapter(ProfileContext);
export const [usePlaylistContext, usePlaylistStore] =
  createDataAdapter(PlaylistContext);
export const [useSongContext, useSongStore] = createDataAdapter(SongContext);
export const [usePlaylistSongContext, usePlaylistSongStore] =
  createDataAdapter(PlaylistSongContext);

function createDataAdapter<T>(ctx: Context<T>) {
  function useDataContext() {
    const context = useContext(ctx);
    if (!context) throw new Error("useContext must be used within a Provider");
    return context;
  }

  function useDataStore<T>(defaultState: T) {
    const [state, setState] = useState<T>(defaultState);
    return useMemo(() => ({ state, setState }), [state]);
  }

  return [useDataContext, useDataStore];
}

interface DataStore<T> {
  state: Record<string, T>;
  setState: Dispatch<SetStateAction<Record<string, T>>>;
}
