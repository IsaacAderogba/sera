import {
  UseDraggableArguments,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useSelector } from "../../providers/StoreContext";
import { useCombinedRefs } from "../../hooks/useManagedRefs";

export const useDropzoneDragData = () => {
  return useSelector(state => {
    const props = state.timeline.dropzoneDragData;
    return Array.isArray(props) ? props : props ? [props] : [];
  });
};

export type DropzoneFlexibleProps = Pick<
  UseDraggableArguments,
  "id" | "data" | "disabled"
>;

export function useDropzoneFlexible(props: DropzoneFlexibleProps) {
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable(props);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef
  } = useDraggable(props);

  const setNodeRef = useCombinedRefs(setDraggableNodeRef, setDroppableNodeRef);
  return { isOver, attributes, listeners, setNodeRef };
}

export const useDropzoneDraggable = useDraggable;
export const useDropzoneDroppable = useDroppable;
export const useDropzoneSortable = useSortable;
