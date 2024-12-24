import { Track, TrackItem } from "../../remotion/types";

export type DraggableEventData = DropzoneEventData<DraggableData>;
export type DroppableEventData = DropzoneEventData<DroppableData>;

export type DropzoneEventData<T> = T | T[] | null;

export type DraggableData = DropzoneTrackDraggable | DropzoneTrackItemDraggable;
export type DroppableData = DropzoneTrackDroppable | DropzoneTrackItemDroppable;

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
  position: "before" | "on" | "after";
}

type DataType = "track" | "track-item";
