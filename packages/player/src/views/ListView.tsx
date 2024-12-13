import { PropsWithChildren, useRef, useState } from "react";
import { Box } from "../components/Box";
import { Divider } from "../components/Divider";
import { Flex } from "../components/Flex";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { SongControls } from "../patterns/Song/SongControls";
import { SongDropdown } from "../patterns/Song/SongDropdown";
import { SongGeneratorPopover } from "../patterns/Song/SongGeneratorPopover";
import { SongPreview } from "../patterns/Song/SongPreview";
import { useSong } from "../patterns/Song/useSong";
import { Song } from "../preload/types";
import { Grid } from "../components/Grid";
import { useDismissable } from "../hooks/useDismissable";

export interface ListViewProps {
  selectedId: number;
  playlistId: number;
  songs: Song[];
  onNavigate: (id: number) => void;
}

export const ListView: React.FC<PropsWithChildren<ListViewProps>> = ({
  playlistId,
  selectedId,
  songs,
  onNavigate,
  children
}) => {
  const [navigationEnabled, setNavigationEnabled] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const dismissiableProps = useDismissable(listRef, {
    enabled: true,
    onDismiss: () => setNavigationEnabled(false)
  });

  useKeyboardNavigation({
    enabled: navigationEnabled,
    defaultValue: selectedId,
    value: selectedId,
    values: songs.map(song => song.id),
    onValueChange: id => {
      if (!id) return;
      onNavigate(id);
    }
  });

  const song = useSong(selectedId);

  return (
    <Flex
      css={{
        height: "100%",
        width: "100%",
        padding: "$base",
        gap: "$base",
        flexDirection: "column"
      }}
    >
      <Box
        css={{
          boxShadow: "$sm",
          background: "$surface",
          borderRadius: "$sm",
          overflow: "auto",
          height: "100%",
          width: "100%"
        }}
      >
        <Box>{children}</Box>
        <Divider css={{ margin: 0 }} />
        <Flex
          {...dismissiableProps}
          ref={listRef}
          onPointerDown={() => setNavigationEnabled(true)}
          css={{ height: "100%", overflow: "auto", flexDirection: "column" }}
        >
          {songs.map((song, i) => {
            return (
              <SongPreview
                key={song.id}
                trackNumber={i + 1}
                active={selectedId === song.id}
                song={song}
                onClick={() => onNavigate(song.id)}
              />
            );
          })}
        </Flex>
      </Box>
      <Box
        css={{
          flexBasis: song ? "60px" : 0,
          transition: `all 100ms`,
          boxShadow: "$sm",
          background: "$surface",
          borderRadius: "$sm",
          overflow: "hidden"
        }}
      >
        {song ? (
          <Grid
            css={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              padding: "0 $base",
              gap: "$base"
            }}
          >
            <Flex css={{ alignItems: "center" }}>
              <SongGeneratorPopover song={song} />
            </Flex>
            <Flex css={{ alignItems: "center", justifyContent: "center" }}>
              <SongControls
                playlistId={playlistId}
                song={song}
                onSongChange={song => {
                  if (song.id === selectedId) return;
                  onNavigate(song.id);
                }}
              />
            </Flex>
            <Flex css={{ justifyContent: "flex-end" }}>
              <SongDropdown playlistId={playlistId} song={song} />
            </Flex>
          </Grid>
        ) : null}
      </Box>
    </Flex>
  );
};
