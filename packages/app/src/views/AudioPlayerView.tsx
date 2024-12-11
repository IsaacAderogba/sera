import { useAudioContext } from "../providers/AudioContext";

export const AudioPlayerView: React.FC = () => {
  const { state } = useAudioContext();

  console.log("state", state);

  return <>profile preview</>;
};
