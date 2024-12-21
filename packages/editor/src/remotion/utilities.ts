import { v4 } from "uuid";
import { CompositionState } from "./types";

export const initializeCompositionState = (): CompositionState => {
  const videoTrackId = v4();
  const videoTrackItemId = v4();
  const audioTrackId = v4();
  const audioTrackItemId = v4();
  const textTrackId = v4();
  const textTrackItemId = v4();

  return {
    tracks: {
      [videoTrackId]: { id: videoTrackId, type: "video" },
      [audioTrackId]: { id: audioTrackId, type: "audio" },
      [textTrackId]: { id: textTrackId, type: "text" }
    },
    trackItems: {
      [videoTrackItemId]: {
        id: videoTrackItemId,
        trackId: videoTrackId,
        name: "Video Example",
        type: "video",
        duration: null,
        data: { src: "video://video.mp4" }
      },
      [audioTrackItemId]: {
        id: audioTrackItemId,
        trackId: audioTrackId,
        name: "Audio Example",
        type: "audio",
        duration: null,
        data: { src: "audio://audio.mp3" }
      },
      [textTrackItemId]: {
        id: textTrackItemId,
        trackId: textTrackId,
        name: "Text Example",
        type: "text",
        duration: 5,
        data: { text: "Hello World" }
      }
    },
    metadata: {
      duration: 5,
      fps: 30,
      width: 1920,
      height: 1080
    }
  };
};
