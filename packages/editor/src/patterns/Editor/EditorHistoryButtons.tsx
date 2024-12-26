import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from "@heroicons/react/24/outline";
import { IconButton } from "@radix-ui/themes";
import { actions, dispatch, useSelector } from "../../providers/StoreContext";

export const EditorUndoButton: React.FC = () => {
  const undoable = useSelector(state =>
    Boolean(state.editor.compositionUndo.length)
  );

  return (
    <IconButton
      disabled={!undoable}
      variant="ghost"
      style={{ margin: 0 }}
      onClick={() => {
        dispatch(actions.editor.undo());
      }}
    >
      <ArrowUturnLeftIcon width={16} />
    </IconButton>
  );
};

export const EditorRedoButton: React.FC = () => {
  const redoable = useSelector(state =>
    Boolean(state.editor.compositionRedo.length)
  );

  return (
    <IconButton
      disabled={!redoable}
      variant="ghost"
      style={{ margin: 0 }}
      onClick={() => {
        dispatch(actions.editor.redo());
      }}
    >
      <ArrowUturnRightIcon width={16} />
    </IconButton>
  );
};
