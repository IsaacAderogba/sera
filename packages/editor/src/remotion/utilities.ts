import { CalculateMetadataFunction, VideoConfig } from "remotion";
import { v4 } from "uuid";
import { CompositionState, TrackItem } from "./types";
import {
  TIMELINE_STEP_SIZE,
  TIMELINE_STEP_SIZE_WIDTH
} from "../utilities/constants";
import { TimelineState } from "../providers/StoreContext";

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
  const durationInFrames = maxDuration * fps;

  return { fps, durationInFrames, height, width, props };
};

export const initializeCompositionState = (): CompositionState => {
  const videoTrackId = v4();
  const videoTrackId2 = v4();
  const videoTrackItemId = v4();
  const audioTrackId = v4();
  const audioTrackId2 = v4();
  const audioTrackItemId = v4();
  const textTrackId = v4();
  const textTrackId2 = v4();
  const textTrackItemId = v4();
  const date = new Date().toISOString();

  return {
    orderedTrackIds: [
      textTrackId,
      textTrackId2,
      audioTrackId,
      audioTrackId2,
      videoTrackId,
      videoTrackId2
    ],
    tracks: {
      [videoTrackId]: {
        id: videoTrackId,
        type: "video",
        createdAt: date,
        updatedAt: date
      },
      [videoTrackId2]: {
        id: videoTrackId2,
        type: "video",
        createdAt: date,
        updatedAt: date
      },
      [audioTrackId]: {
        id: audioTrackId,
        type: "audio",
        createdAt: date,
        updatedAt: date
      },
      [audioTrackId2]: {
        id: audioTrackId2,
        type: "audio",
        createdAt: date,
        updatedAt: date
      },
      [textTrackId]: {
        id: textTrackId,
        type: "text",
        createdAt: date,
        updatedAt: date
      },
      [textTrackId2]: {
        id: textTrackId2,
        type: "text",
        createdAt: date,
        updatedAt: date
      }
    },
    trackItems: {
      [videoTrackItemId]: {
        id: videoTrackItemId,
        trackId: videoTrackId,
        name: "Video Example",
        type: "video",
        from: 5,
        duration: 5,
        playbackRate: 1,
        data: { src: "video://video.mp4" },
        createdAt: date,
        updatedAt: date
      },
      [audioTrackItemId]: {
        id: audioTrackItemId,
        trackId: audioTrackId,
        name: "Audio Example",
        type: "audio",
        from: 0,
        duration: 15,
        playbackRate: 1,
        data: { src: "audio://audio.mp3" },
        createdAt: date,
        updatedAt: date
      },
      [textTrackItemId]: {
        id: textTrackItemId,
        trackId: textTrackId,
        name: "Text Example",
        type: "text",
        from: 0,
        duration: 5,
        playbackRate: 1,
        data: { text: "Hello World" },
        createdAt: date,
        updatedAt: date
      }
    },
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

export const calculateTrackItemDimsensions = (
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
