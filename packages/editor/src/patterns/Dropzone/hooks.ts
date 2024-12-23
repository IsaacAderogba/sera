import { useSelector } from "../../providers/StoreContext";

export const useDropzoneDragData = () => {
  return useSelector(state => {
    const props = state.timeline.dropzoneDragData;
    return Array.isArray(props) ? props : props ? [props] : [];
  });
};
