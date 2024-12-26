import { CalculateMetadataFunction, VideoConfig } from "remotion";
import { CompositionState, TrackItem } from "../../electron/preload/types";
import { TimelineState } from "../providers/StoreContext";
import {
  TIMELINE_STEP_SIZE,
  TIMELINE_STEP_SIZE_WIDTH
} from "../utilities/constants";

export const calculateCompositionMetadata: CalculateMetadataFunction<
  CompositionState
> = async ({ props }) => {
  return calculateMetadata(props);
};

export const calculateMetadata = (props: CompositionState) => {
  const { fps, height, width } = props.metadata;

  let maxDuration = 0;
  for (const id in props.trackItems) {
    const { from, duration } = props.trackItems[id];
    maxDuration = Math.max(maxDuration, from + duration);
  }
  const durationInFrames = Math.round(maxDuration * fps);

  return { fps, durationInFrames, height, width, props };
};

export const initializeCompositionState = (): CompositionState => {
  return {
    orderedTrackIds: [],
    tracks: {},
    trackItems: {},
    metadata: {
      fps: 30,
      width: 1920,
      height: 1080
    }
  };
};

export const orderTrackItemsByTrack = (
  state: CompositionState,
  props: { order: "forward" | "backward" }
) => {
  const output: { trackId: string; trackItemIds: string[] }[] = [];

  const trackIdToTrackItemIds: Record<string, string[]> = {};
  for (const trackItemId in state.trackItems) {
    const trackItem = state.trackItems[trackItemId];

    const trackItemIds = trackIdToTrackItemIds[trackItem.trackId];
    if (trackItemIds) {
      trackItemIds.push(trackItemId);
    } else {
      trackIdToTrackItemIds[trackItem.trackId] = [trackItemId];
    }
  }

  let trackIds = state.orderedTrackIds;
  if (props.order === "backward") trackIds = trackIds.slice().reverse();

  for (const trackId of trackIds) {
    const trackItemIds = trackIdToTrackItemIds[trackId] || [];
    output.push({ trackId, trackItemIds });
  }

  return output;
};

export const calculateTrackItemDimensions = (
  trackItem: TrackItem,
  props: { timelineState: TimelineState }
) => {
  const timeline = props.timelineState;
  const stepSizeInSeconds = TIMELINE_STEP_SIZE * timeline.scale;

  const offsetSteps = trackItem.from / stepSizeInSeconds;
  const steps = trackItem.duration / stepSizeInSeconds;

  const offset = offsetSteps * TIMELINE_STEP_SIZE_WIDTH;
  const width = steps * TIMELINE_STEP_SIZE_WIDTH;
  return { offset, width };
};

export const calculateFrames = (
  trackItem: TrackItem,
  options: Pick<VideoConfig, "fps">
) => {
  const { fps } = options;

  const from = trackItem.from * fps;
  const durationInFrames = (trackItem.duration / trackItem.playbackRate) * fps;

  return { from, durationInFrames };
};

export const formatSeconds = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
