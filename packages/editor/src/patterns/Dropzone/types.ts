import { Track, TrackItem } from "../../remotion/types";

export type DropzoneDragData = DropzoneTrack | DropzoneTrackItem;
export type DropzoneDropProps = DropzoneTrackItem;

export interface DropzoneTrack extends BaseDropzone {
  type: "track";
  data: Track;
}

export interface DropzoneTrackItem extends BaseDropzone {
  type: "track-item";
  data: TrackItem;
}

interface BaseDropzone {
  type: DataType;
  position: "before" | "after";
  size: { width: number; height: number };
}

type DataType = "track" | "track-item";
