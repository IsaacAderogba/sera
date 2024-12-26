import type { RenderMediaOnProgress } from "@remotion/renderer";

declare global {
  interface Window {
    ipc: {
      invoke: Invoke;
      publish: Publish;
      subscribe: Subscribe;
    };
  }
}

export type Invoke = <T extends keyof IPCInvokeEvents>(
  subject: T,
  ...data: Parameters<IPCInvokeEvents[T]>
) => ReturnType<IPCInvokeEvents[T]>;

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
  themeChange: (preference: ThemePreference) => Promise<void>;
  renderChange: RenderMediaOnProgress;
};

export type IPCInvokeEvents = {
  render: (props: CompositionState) => Promise<void>;
  bundle: (props: any) => Promise<void>;
  importTrackItem: (file: File) => Promise<TrackItem | null>;
};

export interface IPCContext {
  platform: Platform;
  viewId: number;
  windowId: number;
}

export type Platform = "mac" | "windows" | "linux";

export type ThemePreference = "dark" | "light" | "system";
export type ThemeMode = "dark" | "light";

export type CompositionState = {
  orderedTrackIds: string[];
  tracks: Record<string, Track>;
  trackItems: Record<string, TrackItem>;
  metadata: CompositionMetadata;
};

export interface CompositionMetadata {
  fps: number;
  width: number;
  height: number;
}

export type Track = TextTrack | VideoTrack | AudioTrack;

export interface TextTrack extends BaseTrack {
  type: "text";
}

export interface VideoTrack extends BaseTrack {
  type: "video";
}

export interface AudioTrack extends BaseTrack {
  type: "audio";
}

interface BaseTrack {
  id: string;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export type TrackItem = TextTrackItem | VideoTrackItem | AudioTrackItem;

export interface TextTrackItem extends BaseTrackItem {
  type: "text";
  data: TextData;
}

export interface TextData extends BaseData {
  text: string;
}

export interface VideoTrackItem extends BaseTrackItem {
  type: "video";
  data: VideoData;
}

export interface VideoData extends BaseData {
  src: string;
}

export interface AudioTrackItem extends BaseTrackItem {
  type: "audio";
  data: AudioData;
}

export interface AudioData extends BaseData {
  src: string;
}

interface BaseTrackItem {
  id: string;
  trackId: string;
  name: string;
  type: DataType;
  from: number;
  duration: number;
  playbackRate: number;
  createdAt: string;
  updatedAt: string;
}

interface BaseData {}

export type DataType = "text" | "video" | "audio";
