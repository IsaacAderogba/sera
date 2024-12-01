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

export type AdaptersInterface = {
  [K in keyof ItemRecord]: Adapter<ItemRecord[K]>;
};

export type Adapter<Type extends Item> = {
  read: (id: string) => Promise<Type>;
  list: () => Promise<Type[]>;
  create: (
    record: Omit<Type, "id" | "createdAt" | "updatedAt">
  ) => Promise<Type>;
  update: (id: string, record: Partial<Type>) => Promise<Type>;
  delete: (id: string) => Promise<Type>;
};

export type Item = User | Playlist | Song;
export type ItemRecord = {
  user: User;
  playlist: Playlist;
  song: Song;
};

export interface User extends Node {
  type: "user";
}

export interface Playlist extends Node {
  type: "playlist";
}

export interface Song extends Node {
  type: "song";
}

interface Node {
  id: string;
  createdAt: string;
  updatedAt: string;
}
