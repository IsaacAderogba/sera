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

export interface CompositionState {
  tracks: Record<string, EditorTrack>;
  trackItems: Record<string, EditorTrackItem>;
  metadata: CompositionMetadata;
}

export interface CompositionMetadata {
  duration: number;
  fps: number;
  width: number;
  height: number;
}

export type EditorTrack = TextTrack | VideoTrack | AudioTrack;

export interface TextTrack extends Track {
  type: "text";
}

export interface VideoTrack extends Track {
  type: "video";
}

export interface AudioTrack extends Track {
  type: "audio";
}

interface Track {
  id: string;
  type: DataType;
}

export type EditorTrackItem = TextTrackItem | VideoTrackItem | AudioTrackItem;

export interface TextTrackItem extends TrackItem {
  type: "text";
  data: TextData;
}

export interface TextData extends BaseData {
  text: string;
}

export interface VideoTrackItem extends TrackItem {
  type: "video";
  data: VideoData;
}

export interface VideoData extends BaseData {
  src: string;
}

export interface AudioTrackItem extends TrackItem {
  type: "audio";
  data: AudioData;
}

export interface AudioData extends BaseData {
  src: string;
}

interface TrackItem {
  id: string;
  trackId: string;
  name: string;
  type: DataType;
  duration: number | null;
}

interface BaseData {}

export type DataType = "text" | "video" | "audio";
