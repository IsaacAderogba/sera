import { Track, TrackItem } from "../../remotion/types";

export type DropzoneDragData =
  | DropzoneTrackDraggable
  | DropzoneTrackItemDraggable;
export type DropzoneDropData =
  | DropzoneTrackDroppable
  | DropzoneTrackItemDroppable;

export interface DropzoneTrackDraggable extends BaseDraggable {
  type: "track";
  data: Track;
}

export interface DropzoneTrackItemDraggable extends BaseDraggable {
  type: "track-item";
  data: TrackItem;
}

interface BaseDraggable {
  type: DataType;
  size: { width: string; height: string };
}

export interface DropzoneTrackDroppable extends BaseDroppable {
  type: "track";
  data: Track;
}

export interface DropzoneTrackItemDroppable extends BaseDroppable {
  type: "track-item";
  data: TrackItem;
}

interface BaseDroppable {
  type: DataType;
  position: "before" | "after";
}

type DataType = "track" | "track-item";
