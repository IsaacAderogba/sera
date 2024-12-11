import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Button } from "../../components/Button";
import { Flex } from "../../components/Flex";
import { Text } from "../../components/Typography";
import { Song } from "../../preload/types";
import { usePlaylistSongs } from "../PlaylistSong/usePlaylistSongs";
import { useAudioContext } from "../../providers/AudioContext";

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
  song
}) => {
  const { state } = useAudioContext();
  const songs = usePlaylistSongs(playlistId);
  const { previous, next } = useMemo(() => {
    const index = songs.findIndex(s => s.id === song.id);
    return { previous: songs[index - 1], next: songs[index + 1] };
  }, [song.id, songs]);

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
        <Button variant="ghost" icon disabled={!previous}>
          <BackwardIcon width={20} />
        </Button>
        <Button variant="soft" icon>
          {state.songId === song.id && state.type !== "playing" ? (
            <PauseIcon width={20} />
          ) : (
            <PlayIcon width={20} />
          )}
        </Button>
        <Button variant="ghost" icon disabled={!next}>
          <ForwardIcon width={20} />
        </Button>
      </Flex>
      <Text size="compact">audio track progress</Text>
    </Flex>
  );
};
