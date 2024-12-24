import { DropzoneEventData, DraggableData, DroppableData } from "./types";

export const flattenDropzoneEventData = <
  T extends DraggableData | DroppableData
>(
  data: DropzoneEventData<T>
) => {
  if (!data) return [];
  return Array.isArray(data) ? data : data ? [data] : [];
};
