import { Track } from "../../remotion/types";
import { useDraggableData } from "../Dropzone/hooks";
import { DraggableData, DraggableTrackItem } from "../Dropzone/types";

export const useIsEditorTimelineTrackSortable = (track: Track) => {
  const draggableData = useDraggableData();
  return isEditorTimelineTrackSortable(track, draggableData);
};

export const isEditorTimelineTrackSortable = (
  _track: Track,
  draggableData: DraggableData[]
) => {
  if (!draggableData.length) return true;

  // only tracks can be sorted
  if (draggableData.some(data => data.type !== "track")) return false;

  return true;
};

export const useIsEditorTimelineTrackDroppable = (track: Track) => {
  const draggableData = useDraggableData();
  return isEditorTimelineTrackDroppable(track, draggableData);
};

export const isEditorTimelineTrackDroppable = (
  track: Track,
  draggableData: DraggableData[]
): draggableData is DraggableTrackItem[] => {
  if (!draggableData.length) return false;

  // only track items can be dragged on to tracks
  if (draggableData.some(data => data.type !== "track-item")) return false;

  // track items must be dropped into track of corresponding type
  if (draggableData.some(({ data }) => data.type !== track.type)) return false;

  return true;
};
