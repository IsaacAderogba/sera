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
import { DraggableData } from "../patterns/Dropzone/types";
import { initializeCompositionState } from "../remotion/utilities";
import { DeepPartial } from "../utilities/types";
import { StitchingState } from "@remotion/renderer";
import {
  CompositionState,
  Track,
  TrackItem
} from "../../electron/preload/types";

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
  const orderedTrackIds = [...state.orderedTrackIds];
  const tracks = { ...state.tracks };
  const trackItems = { ...state.trackItems };

  switch (action.type) {
    case "order-track-ids": {
      return { ...state, orderedTrackIds: action.payload.data };
    }
    case "create-track": {
      tracks[action.payload.data.id] = action.payload.data;
      orderedTrackIds.push(action.payload.data.id);

      for (const trackItem of action.payload.items) {
        trackItems[trackItem.id] = trackItem;
      }

      return { ...state, tracks, orderedTrackIds, trackItems };
    }
    case "update-track": {
      const { id, data } = action.payload;
      if (tracks[id]) {
        tracks[id] = merge({}, tracks[id], data);
      }

      return { ...state, tracks };
    }
    case "delete-track": {
      delete tracks[action.payload.id];

      for (const id in trackItems) {
        if (trackItems[id].trackId !== action.payload.id) continue;
        delete trackItems[id];
      }

      return {
        ...state,
        tracks,
        orderedTrackIds: orderedTrackIds.filter(id => id !== action.payload.id)
      };
    }
    case "create-track-item": {
      trackItems[action.payload.data.id] = action.payload.data;
      return { ...state, trackItems };
    }
    case "update-track-item": {
      const { id, data } = action.payload;
      if (trackItems[id]) {
        trackItems[id] = merge({}, trackItems[id], data);
      }
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
  | EditorOrderTrackIdsAction
  | EditorCreateTrackAction
  | EditorUpdateTrackAction
  | EditorDeleteTrackAction
  | EditorCreateTrackItemAction
  | EditorUpdateTrackItemAction
  | EditorDeleteTrackItemAction;

type EditorOrderTrackIdsAction = {
  type: "order-track-ids";
  payload: { data: string[] };
};
type EditorCreateTrackAction = {
  type: "create-track";
  payload: { data: Track; items: TrackItem[] };
};
type EditorUpdateTrackAction = {
  type: "update-track";
  payload: { id: string; data: DeepPartial<Track> };
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

export interface TimelineState {
  scale: number;
  draggableData: DraggableData[];
  renderProgress: RenderProgress;
}

export interface RenderProgress {
  renderedFrames: number;
  encodedFrames: number;
  encodedDoneIn: number | null;
  renderedDoneIn: number | null;
  renderEstimatedTime: number;
  progress: number;
  stitchStage: StitchingState;
}

function getTimelineState(): TimelineState {
  return {
    scale: 1,
    draggableData: [],
    renderProgress: {
      renderedFrames: 0,
      encodedFrames: 0,
      encodedDoneIn: null,
      renderedDoneIn: null,
      renderEstimatedTime: 0,
      progress: 0,
      stitchStage: "encoding"
    }
  };
}

const timelineSlice = createSlice({
  name: "timeline",
  initialState: getTimelineState(),
  reducers: {
    setState: (state, action: PayloadAction<DeepPartial<TimelineState>>) => {
      return merge({}, state, action.payload);
    }
  }
});

export type StoreState = {
  editor: EditorState;
  timeline: TimelineState;
};

export const store = configureStore({
  reducer: combineReducers({
    editor: editorSlice.reducer,
    timeline: timelineSlice.reducer
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
  editor: editorSlice.actions,
  timeline: timelineSlice.actions
};
