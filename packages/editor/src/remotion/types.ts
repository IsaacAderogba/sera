export interface CompositionProps {
  titleText: string;
  titleColor: string;
  logoColor1: string;
  logoColor2: string;
  metadata: {
    durationInFrames: number;
    compositionWidth: number;
    compositionHeight: number;
    fps: number;
  };
}

export type CompositionState = {
  tracks: Record<string, Track>;
  trackItems: Record<string, TrackItem>;
  metadata: CompositionMetadata;
};

export interface CompositionMetadata {
  duration: number;
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
}

interface BaseData {}

export type DataType = "text" | "video" | "audio";
