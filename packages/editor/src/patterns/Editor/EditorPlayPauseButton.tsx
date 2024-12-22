import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@radix-ui/themes";
import { PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useState } from "react";

export interface EditorPlayPauseButtonProps {
  playerRef: React.RefObject<PlayerRef | null>;
}

export const EditorPlayPauseButton: React.FC<EditorPlayPauseButtonProps> = ({
  playerRef
}) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const { current } = playerRef;
    setPlaying(current?.isPlaying() ?? false);
    if (!current) return;

    const onPlay = () => {
      setPlaying(true);
    };

    const onPause = () => {
      setPlaying(false);
    };

    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);

    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [playerRef]);

  const onToggle = useCallback(() => {
    playerRef.current?.toggle();
  }, [playerRef]);

  return (
    <IconButton onClick={onToggle} variant="ghost" style={{ margin: 0 }}>
      {playing ? <PauseIcon width={16} /> : <PlayIcon width={16} />}
    </IconButton>
  );
};
