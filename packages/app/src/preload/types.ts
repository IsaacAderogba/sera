declare global {
  interface Window {
    ipc: {
      invoke: Invoke;
      publish: Publish;
      subscribe: Subscribe;
      adapters: IPCAdaptersInterface;
    };
  }
}

export type Invoke = <T extends keyof IPCInvokeEvents>(
  subject: T,
  ...data: Parameters<IPCInvokeEvents[T]>
) => ReturnType<Awaited<IPCInvokeEvents[T]>>;

export type Publish = <T extends keyof IPCBroadcastEvents>(
  subject: T,
  ...data: Parameters<IPCBroadcastEvents[T]>
) => void;

export type Subscribe = <T extends keyof IPCBroadcastEvents>(
  subject: T,
  listener: (
    context: IPCContext,
    ...data: Parameters<IPCBroadcastEvents[T]>
  ) => void
) => () => void;

export type IPCBroadcastEvents = {
  change: (snapshot: ItemSnapshot) => Promise<void> | void;
  themePreferenceChange: (preference: ThemePreference) => Promise<void> | void;
  audioAction: (action: AudioAction) => Promise<void> | void;
};

export type IPCInvokeEvents = {
  canGoBack: () => Promise<boolean>;
  goBack: () => Promise<void>;
  canGoForward: () => Promise<boolean>;
  goForward: () => Promise<void>;

  generateBackgroundMusic: (song: Song) => Promise<string>;
};

export type ItemSnapshot<T extends Item = Item> = {
  action: "created" | "updated" | "deleted";
  data: T;
};

export type ThemePreference = "dark" | "light" | "system";
export type ThemeMode = "dark" | "light";

export type AudioAction =
  | AudioPlayAction
  | AudioPlayingAction
  | AudioPauseAction;

export type AudioPlayAction = AudioBaseAction & { type: "play" };
export type AudioPlayingAction = AudioBaseAction & { type: "playing" };
export type AudioPauseAction = AudioBaseAction & { type: "pause" };
export type AudioBaseAction = {
  playlistId: number;
  songId: number;
  time: number;
};

export interface IPCContext {
  platform: Platform;
  viewId: number;
  windowId: number;
}

export type Platform = "mac" | "windows" | "linux";

export type IPCAdaptersInterface = {
  [K in keyof ItemRecord]: IPCAdapter<ItemRecord[K]>;
};

export type IPCAdapter<Type extends Item> = {
  read: (id: number) => Promise<Type | undefined>;
  list: () => Promise<Type[]>;
  create: (
    record: Omit<Type, "id" | "type" | "createdAt" | "updatedAt">
  ) => Promise<Type>;
  update: (id: number, record: DeepPartial<Type>) => Promise<Type>;
  delete: (id: number) => Promise<void>;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Item = Profile | Playlist | Song | PlaylistSong;
export type ItemRecord = {
  profiles: Profile;
  playlists: Playlist;
  songs: Song;
  playlists_songs: PlaylistSong;
};

export interface Profile extends Node {
  type: "profile";
  token: string | null;
  data: object;
}

export interface Playlist extends Node {
  type: "playlist";
  profileId: number;
  data: {
    title: string;
  };
}

export interface Song extends Node {
  type: "song";
  profileId: number;
  data: {
    title: string;
    description: string;
    audioFilename?: string;
    audioMetadata?: {
      durationSeconds: number;
    };
  };
}

export interface PlaylistSong extends Node {
  type: "playlist_song";
  profileId: number;
  playlistId: number;
  songId: number;
  data: object;
}

interface Node {
  id: number;
  data: object;
  createdAt: string;
  updatedAt: string;
}
