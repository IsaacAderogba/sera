import { Audio, Sequence, useVideoConfig, Video } from "remotion";

import { calculateFrames } from "./utilities";
import {
  AudioTrackItem,
  TextTrackItem,
  TrackItem,
  VideoTrackItem
} from "../../electron/preload/types";

export interface SequenceItemProps {
  trackItem: TrackItem;
}

export const SequenceItem: React.FC<SequenceItemProps> = ({ trackItem }) => {
  const { id } = trackItem;
  switch (trackItem.type) {
    case "audio":
      return <AudioSequenceItem key={id} trackItem={trackItem} />;
    case "text":
      return <TextSequenceItem key={id} trackItem={trackItem} />;
    case "video":
      return <VideoSequenceItem key={id} trackItem={trackItem} />;
    default:
      return null;
  }
};

export interface TextSequenceItemProps {
  trackItem: TextTrackItem;
}

export const TextSequenceItem: React.FC<TextSequenceItemProps> = ({
  trackItem
}) => {
  const videoConfig = useVideoConfig();
  const { from, durationInFrames } = calculateFrames(trackItem, videoConfig);

  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "64px",
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 5px black"
        }}
      >
        {trackItem.data.text}
      </div>
    </Sequence>
  );
};

export interface VideoSequenceItemProps {
  trackItem: VideoTrackItem;
}

export const VideoSequenceItem: React.FC<VideoSequenceItemProps> = ({
  trackItem
}) => {
  const videoConfig = useVideoConfig();
  const { from, durationInFrames } = calculateFrames(trackItem, videoConfig);

  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Video src={trackItem.data.src} pauseWhenBuffering />
    </Sequence>
  );
};

export interface AudioSequenceItemProps {
  trackItem: AudioTrackItem;
}

export const AudioSequenceItem: React.FC<AudioSequenceItemProps> = ({
  trackItem
}) => {
  const videoConfig = useVideoConfig();
  const { from, durationInFrames } = calculateFrames(trackItem, videoConfig);

  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Audio src={trackItem.data.src} />
    </Sequence>
  );
};
