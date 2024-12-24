import {
  useDraggable,
  UseDraggableArguments,
  useDroppable,
  UseDroppableArguments
} from "@dnd-kit/core";
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { useCombinedRefs } from "../../hooks/useManagedRefs";
import { useSelector } from "../../providers/StoreContext";
import { DraggableData, DroppableData } from "./types";

export const useDraggableData = () => {
  return useSelector(state => state.timeline.draggableData);
};

export function useDropzonable<T extends DraggableData>(
  props: DropzoneProps<UseDraggableArguments, T>
) {
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable(props);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef
  } = useDraggable(props);

  const setNodeRef = useCombinedRefs(setDraggableNodeRef, setDroppableNodeRef);
  return { isOver, attributes, listeners, setNodeRef };
}

export const useDropzoneDraggable = <T extends DraggableData>(
  props: DropzoneProps<UseDraggableArguments, T>
) => useDraggable(props);

export const useDropzoneDroppable = <T extends DroppableData>(
  props: DropzoneProps<UseDroppableArguments, T>
) => useDroppable(props);

export const useDropzoneSortable = <T extends DraggableData>(
  props: DropzoneProps<UseSortableArguments, T>
) => useSortable(props);

type DropzoneProps<T, K> = Omit<T, "data"> & { data: K };
