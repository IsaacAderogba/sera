import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector
} from "react-redux";
import { createLogger } from "redux-logger";
import { CompositionRenderProps } from "../remotion/types";

export interface EditorState {
  compositionUndo: CompositionRenderProps[];
  composition: CompositionRenderProps;
  compositionRedo: CompositionRenderProps[];
}

function getEditorState(): EditorState {
  return {
    compositionUndo: [],
    composition: {
      titleText: "Welcome To Electron + Remotion",
      titleColor: "#000000",
      logoColor1: "#91EAE4",
      logoColor2: "#86A8E7",
      metadata: {
        durationInFrames: 150,
        compositionWidth: 1920,
        compositionHeight: 1080,
        fps: 30
      }
    },
    compositionRedo: []
  };
}

const editorSlice = createSlice({
  name: "editor",
  initialState: getEditorState(),
  reducers: {
    undo: state => {
      const { compositionUndo, composition, compositionRedo } = state;
      if (!compositionUndo.length) return state;

      return {
        ...state,
        compositionUndo: compositionUndo.slice(1),
        composition: compositionUndo[0],
        compositionRedo: [composition, ...compositionRedo]
      };
    },
    redo: state => {
      const { compositionUndo, composition, compositionRedo } = state;
      if (!compositionRedo.length) return state;

      return {
        ...state,
        compositionUndo: [composition, ...compositionUndo],
        composition: compositionRedo[0],
        compositionRedo: compositionRedo.slice(1)
      };
    },
    commit: (state, action: PayloadAction<EditorAction>) => {
      const { compositionUndo, composition } = state;
      const nextComposition = commitComposition(composition, action.payload);

      return {
        compositionUndo: [composition, ...compositionUndo].slice(0, 500),
        composition: nextComposition,
        compositionRedo: []
      };
    }
  }
});

function commitComposition(
  state: CompositionRenderProps,
  action: EditorAction
): CompositionRenderProps {
  switch (action.type) {
    default:
      return state;
  }
}

type EditorAction = EditorTodoAction;
type EditorTodoAction = { type: "todo"; data: Record<string, never> };

export type StoreState = {
  editor: EditorState;
};

export const store = configureStore({
  reducer: combineReducers({
    editor: editorSlice.reducer
  }),
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().prepend(createLogger({ collapsed: true }));
  }
});

export type Selector = TypedUseSelectorHook<StoreState>;
export const selector: Selector = selector => selector(store.getState());
export const useSelector: Selector = useReduxSelector;

export const dispatch = store.dispatch.bind(store);
export const actions = {
  editor: editorSlice.actions
};
