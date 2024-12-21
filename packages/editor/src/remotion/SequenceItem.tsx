import {
  Audio,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
  VideoConfig
} from "remotion";
import {
  AudioTrackItem,
  TextTrackItem,
  TrackItem,
  VideoTrackItem
} from "./types";

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
      <OffthreadVideo src={trackItem.data.src} />
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

const calculateFrames = (trackItem: TrackItem, options: VideoConfig) => {
  const { fps } = options;

  const from = (trackItem.from / 1000) * fps;
  const durationInFrames =
    (trackItem.duration / trackItem.playbackRate / 1000) * fps;

  return { from, durationInFrames };
};
