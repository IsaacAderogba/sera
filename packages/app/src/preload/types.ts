declare global {
  interface Window {
    ipc: {
      invoke: Invoke;
      publish: Publish;
      subscribe: Subscribe;

      users: UserAdapter;
      playlists: PlaylistAdapter;
      songs: SongAdapter;
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
  foo: () => Promise<void>;
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

export type Adapter<Type extends Record = Record> = {
  read: (id: string) => Promise<Type>;
  list: () => Promise<Type[]>;

  create: (
    record: Omit<Type, "id" | "createdAt" | "updatedAt">
  ) => Promise<Type>;
  update: (id: string, record: Partial<Type>) => Promise<Type>;
  delete: (id: string) => Promise<Type>;
};

export interface UserRecord extends Record {}
export type UserAdapter = Adapter<UserRecord>;

export interface PlaylistRecord extends Record {}
export type PlaylistAdapter = Adapter<PlaylistRecord>;

export interface SongRecord extends Record {}
export type SongAdapter = Adapter<SongRecord>;

interface Record {
  id: string;
  createdAt: string;
  updatedAt: string;
}
