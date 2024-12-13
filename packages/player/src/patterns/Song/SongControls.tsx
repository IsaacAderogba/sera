import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Flex, FlexProps } from "../../components/Flex";
import { Tooltip } from "../../components/Tooltip";
import { Text } from "../../components/Typography";
import { useCallbackRef } from "../../hooks/useManagedRefs";
import { Song } from "../../preload/types";
import { useAudioContext } from "../../providers/AudioContext";
import { usePlaylistSongs } from "../PlaylistSong/usePlaylistSongs";
import { SongProgress } from "./SongProgress";

export interface SongControlsProps extends FlexProps {
  playlistId: number;
  song: Song;
  onSongChange?: (song: Song) => void;
}

export const SongControls: React.FC<SongControlsProps> = ({
  playlistId,
  song,
  onSongChange,
  css = {}
}) => {
  const { state, dispatch } = useAudioContext();
  const songs = usePlaylistSongs(playlistId);
  const { previous, next } = useMemo(() => {
    const index = songs.findIndex(s => s.id === song.id);
    return { previous: songs[index - 1], next: songs[index + 1] };
  }, [song.id, songs]);

  const isSongPlaying = useDelayedValue(
    state.songId === song.id && state.type !== "pause"
  );

  const onChangeSong = useCallbackRef((type: "play" | "pause", song: Song) => {
    onSongChange?.(song);
    if (song.data.audioFilename) {
      dispatch({ type, playlistId, songId: song.id });
    } else {
      dispatch({ type: "pause", playlistId, songId: song.id });
    }
  });

  return (
    <Flex
      css={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "$xxs",
        width: "100%",
        ...css
      }}
    >
      <Flex
        css={{
          width: "100%",
          overflow: "hidden",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "$sm"
        }}
      >
        <Text ellipsis secondary size="compact">
          {song.data.title || "Untitled"}
        </Text>
        <Flex css={{ gap: "$sm", flexShrink: 0 }}>
          <Button
            variant="ghost"
            icon
            disabled={!previous}
            onClick={() => onChangeSong("play", previous)}
          >
            <BackwardIcon width={20} />
          </Button>

          {song.data.audioFilename ? (
            <Button
              variant="soft"
              icon
              onClick={() =>
                onChangeSong(isSongPlaying ? "pause" : "play", song)
              }
            >
              {isSongPlaying ? (
                <PauseIcon width={20} />
              ) : (
                <PlayIcon width={20} />
              )}
            </Button>
          ) : (
            <Tooltip placement="top" content="Generated song required">
              <Button variant="soft" icon danger={!song.data.audioFilename}>
                <PlayIcon width={20} />
              </Button>
            </Tooltip>
          )}
          <Tooltip placement="top" content="Play next">
            <Button
              variant="ghost"
              icon
              disabled={!next}
              onClick={() => onChangeSong("play", next)}
            >
              <ForwardIcon width={20} />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <SongProgress
        song={song}
        time={state.songId === song.id ? state.time || 0 : 0}
      />
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
