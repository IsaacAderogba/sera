declare global {
  interface Window {
    ipc: {
      invoke: Invoke;
      publish: Publish;
      subscribe: Subscribe;
      adapters: AdaptersInterface;
    };
  }
}

export type Invoke = <T extends keyof IPCInvokeEvents>(
  subject: T,
  ...data: Parameters<IPCInvokeEvents[T]>
) => Promise<ReturnType<Awaited<IPCInvokeEvents[T]>>>;

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
  change: (object: {
    action: "created" | "updated" | "deleted";
    data: Item;
  }) => Promise<void>;
};

export type IPCInvokeEvents = {
  foo: (hi: string) => Promise<boolean>;
  bar: (oh: number) => Promise<number>;
};

export interface IPCContext {
  platform: Platform;
  viewId: number;
  windowId: number;
}

export type Platform = "mac" | "windows" | "linux";

export type AdaptersInterface = {
  [K in keyof ItemRecord]: Adapter<ItemRecord[K]>;
};

export type Adapter<Type extends Item> = {
  read: (id: number) => Promise<Type | undefined>;
  list: () => Promise<Type[]>;
  create: (
    record: Omit<Type, "id" | "createdAt" | "updatedAt">
  ) => Promise<Type>;
  update: (id: number, record: Partial<Type>) => Promise<Type>;
  delete: (id: number) => Promise<void>;
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
}

export interface Playlist extends Node {
  type: "playlist";
  profileId: number;
}

export interface Song extends Node {
  type: "song";
  profileId: number;
}

export interface PlaylistSong extends Node {
  type: "playlist_song";
  profileId: number;
  playlistId: number;
  songId: number;
}

interface Node {
  id: number;
  createdAt: string;
  updatedAt: string;
}
