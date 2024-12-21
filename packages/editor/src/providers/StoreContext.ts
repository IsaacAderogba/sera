import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { merge } from "lodash-es";
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector
} from "react-redux";
import { createLogger } from "redux-logger";
import { CompositionState, EditorTrack, TrackItem } from "../remotion/types";
import { initializeCompositionState } from "../remotion/utilities";
import { DeepPartial } from "../utilities/types";

export interface EditorState {
  compositionUndo: CompositionState[];
  composition: CompositionState;
  compositionRedo: CompositionState[];
}

function getEditorState(): EditorState {
  return {
    compositionUndo: [],
    composition: initializeCompositionState(),
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
  state: CompositionState,
  action: EditorAction
): CompositionState {
  const tracks = { ...state.tracks };
  const trackItems = { ...state.trackItems };

  switch (action.type) {
    case "create-track": {
      tracks[action.payload.data.id] = action.payload.data;
      return { ...state, tracks };
    }
    case "update-track": {
      const { id, data } = action.payload;
      if (tracks[id]) tracks[id] = merge({}, tracks[id], data);
      return { ...state, tracks };
    }
    case "delete-track": {
      delete tracks[action.payload.id];
      return { ...state, tracks };
    }
    case "create-track-item": {
      trackItems[action.payload.data.id] = action.payload.data;
      return { ...state, trackItems };
    }
    case "update-track-item": {
      const { id, data } = action.payload;
      if (trackItems[id]) trackItems[id] = merge({}, trackItems[id], data);
      return { ...state, trackItems };
    }
    case "delete-track-item": {
      delete trackItems[action.payload.id];
      return { ...state, trackItems };
    }
    default:
      return state;
  }
}

type EditorAction =
  | EditorCreateTrackAction
  | EditorUpdateTrackAction
  | EditorDeleteTrackAction
  | EditorCreateTrackItemAction
  | EditorUpdateTrackItemAction
  | EditorDeleteTrackItemAction;

type EditorCreateTrackAction = {
  type: "create-track";
  payload: { data: EditorTrack };
};
type EditorUpdateTrackAction = {
  type: "update-track";
  payload: { id: string; data: DeepPartial<EditorTrack> };
};
type EditorDeleteTrackAction = {
  type: "delete-track";
  payload: { id: string };
};
type EditorCreateTrackItemAction = {
  type: "create-track-item";
  payload: { data: TrackItem };
};
type EditorUpdateTrackItemAction = {
  type: "update-track-item";
  payload: { id: string; data: DeepPartial<TrackItem> };
};
type EditorDeleteTrackItemAction = {
  type: "delete-track-item";
  payload: { id: string };
};

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
