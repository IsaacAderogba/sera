import {
  useDraggable,
  UseDraggableArguments,
  useDroppable,
  UseDroppableArguments
} from "@dnd-kit/core";
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { useCombinedRefs } from "../../hooks/useManagedRefs";
import { useSelector } from "../../providers/StoreContext";
import { DropzoneTrackDraggable, DropzoneTrackDroppable } from "./types";

export const useDropzoneDragData = () => {
  return useSelector(state => {
    const props = state.timeline.dropzoneDragData;
    return Array.isArray(props) ? props : props ? [props] : [];
  });
};

export function useDropzonable<T extends DropzoneTrackDraggable>(
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

export const useDropzoneDraggable = <T extends DropzoneTrackDraggable>(
  props: DropzoneProps<UseDraggableArguments, T>
) => useDraggable(props);

export const useDropzoneDroppable = <T extends DropzoneTrackDroppable>(
  props: DropzoneProps<UseDroppableArguments, T>
) => useDroppable(props);

export const useDropzoneSortable = <T extends DropzoneTrackDraggable>(
  props: DropzoneProps<UseSortableArguments, T>
) => useSortable(props);

type DropzoneProps<T, K> = Omit<T, "data"> & { data: K };
