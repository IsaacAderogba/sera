import { Track, TrackItem } from "../../../electron/preload/types";

export type DraggableEventData = DropzoneEventData<DraggableData>;
export type DroppableEventData = DropzoneEventData<DroppableData>;

export type DropzoneEventData<T> = T | T[] | null;

export type DraggableData = DraggableTrack | DraggableTrackItem;
export type DroppableData = DroppableTrack | DroppableTrackItem;

export interface DraggableTrack extends BaseDraggable {
  type: "track";
  data: Track;
}

export interface DraggableTrackItem extends BaseDraggable {
  type: "track-item";
  data: TrackItem;
}

interface BaseDraggable {
  type: DataType;
}

export interface DroppableTrack extends BaseDroppable {
  type: "track";
  data: Track;
}

export interface DroppableTrackItem extends BaseDroppable {
  type: "track-item";
  data: TrackItem;
}

interface BaseDroppable {
  type: DataType;
  position: "before" | "on" | "after";
}

type DataType = "track" | "track-item";
