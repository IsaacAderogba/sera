import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Flex } from "../../components/Flex";
import { Text } from "../../components/Typography";
import { Song } from "../../preload/types";
import { usePlaylistSongs } from "../PlaylistSong/usePlaylistSongs";
import { useAudioContext } from "../../providers/AudioContext";
import { Tooltip } from "../../components/Tooltip";

export interface SongControlsProps {
  playlistId: number;
  song: Song;
  onPlay: (song: Song) => void;
  onPause: (song: Song) => void;
  onNext: (song: Song) => void;
  onPrevious: (song: Song) => void;
}

export const SongControls: React.FC<SongControlsProps> = ({
  playlistId,
  song,
  onPlay,
  onPause,
  onNext,
  onPrevious
}) => {
  const { state } = useAudioContext();
  const songs = usePlaylistSongs(playlistId);
  const { previous, next } = useMemo(() => {
    const index = songs.findIndex(s => s.id === song.id);
    return { previous: songs[index - 1], next: songs[index + 1] };
  }, [song.id, songs]);

  const isPlaying = useDelayedValue(
    state.songId === song.id && state.type !== "pause"
  );

  return (
    <Flex
      css={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "$xxs"
      }}
    >
      <Flex css={{ gap: "$sm" }}>
        <Tooltip placement="top" content="Play previous">
          <Button
            variant="ghost"
            icon
            disabled={!previous}
            onClick={() => {
              if (!previous) return;
              onPrevious(previous);
            }}
          >
            <BackwardIcon width={20} />
          </Button>
        </Tooltip>
        {isPlaying ? (
          <Tooltip placement="top" content="Pause">
            <Button variant="soft" icon onClick={() => onPause(song)}>
              <PauseIcon width={20} />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip placement="top" content="Play">
            <Button variant="soft" icon onClick={() => onPlay(song)}>
              <PlayIcon width={20} />
            </Button>
          </Tooltip>
        )}
        <Tooltip placement="top" content="Play next">
          <Button
            variant="ghost"
            icon
            disabled={!next}
            onClick={() => {
              if (!next) return;
              onNext(next);
            }}
          >
            <ForwardIcon width={20} />
          </Button>
        </Tooltip>
      </Flex>
      <Text size="compact">audio track progress</Text>
    </Flex>
  );
};

const useDelayedValue = (value: boolean, delay = 100): boolean => {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    if (value) return setDelayedValue(value);

    const handler = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return delayedValue;
};
