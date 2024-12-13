import { useEffect, useRef } from "react";
import { Flex } from "../components/Flex";
import { Text, Title } from "../components/Typography";
import { SongControls } from "../patterns/Song/SongControls";
import { useSong } from "../patterns/Song/useSong";
import { useAudioContext } from "../providers/AudioContext";

export const AudioPlayerView: React.FC = () => {
  const { state, dispatch } = useAudioContext();
  const song = useSong(state.songId);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (!song?.id) return;

    switch (state.type) {
      case "play": {
        const audioFileName = `audio://${song.data.audioFilename}`;
        if (audioRef.current.src === audioFileName) {
          audioRef.current.play();
          dispatch({ ...state, type: "playing" });
        } else if (song.data.audioFilename) {
          audioRef.current.src = audioFileName;
          audioRef.current.loop = true;
          audioRef.current.play();
          dispatch({ ...state, type: "playing" });
        } else {
          dispatch({ ...state, type: "pause" });
        }
        return;
      }
      case "playing": {
        const timeout = setTimeout(() => {
          dispatch({
            ...state,
            type: "playing",
            time: Math.ceil(audioRef.current.currentTime)
          });
        }, 1000);
        return () => {
          clearTimeout(timeout);
        };
      }
      case "pause":
        audioRef.current.pause();
        return;
    }
  }, [state, dispatch, song.id, song.data.audioFilename]);

  if (!song) return <NoSong />;
  return (
    <SongControls
      playlistId={state.playlistId}
      song={song}
      css={{ background: "$translucent", height: "100%", padding: "0 $base" }}
    />
  );
};

const NoSong: React.FC = () => {
  return (
    <Flex
      css={{
        height: "100%",
        background: "$translucent",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Title size="compact">No song playing</Title>
      <Text secondary size="compact">
        Select a song from the interface
      </Text>
    </Flex>
  );
};
