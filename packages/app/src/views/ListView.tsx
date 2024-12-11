import { PropsWithChildren } from "react";
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
  const song = useSong(selectedId);
  const navigation = useKeyboardNavigation({
    enabled: true,
    defaultValue: selectedId,
    value: selectedId,
    values: songs.map(song => song.id),
    onValueChange: id => {
      if (!id) return;
      onNavigate(id);
    }
  });

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
          overflow: "hidden",
          height: "100%",
          width: "100%"
        }}
      >
        <Box>{children}</Box>
        <Divider css={{ margin: 0 }} />
        <Flex css={{ flexDirection: "column" }}>
          {songs.map((song, i) => {
            return (
              <SongPreview
                key={song.id}
                trackNumber={i + 1}
                active={selectedId === song.id}
                song={song}
                onClick={() => navigation.onValueChange(song.id)}
              />
            );
          })}
        </Flex>
      </Box>
      <Box
        css={{
          minHeight: song ? "56px" : 0,
          transition: `all 100ms`,
          boxShadow: "$sm",
          background: "$surface",
          borderRadius: "$sm",
          overflow: "hidden"
        }}
      >
        {song ? (
          <Flex
            css={{
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              padding: "$base"
            }}
          >
            <Flex css={{ alignItems: "center", flex: 1 }}>
              <SongGeneratorPopover song={song} />
            </Flex>
            <Flex
              css={{ alignItems: "center", justifyContent: "center", flex: 1 }}
            >
              <SongControls
                playlistId={playlistId}
                song={song}
                onPlay={() => {}}
                onPause={() => {}}
                onNext={() => {}}
                onPrevious={() => {}}
              />
            </Flex>
            <Flex css={{ flex: 1, justifyContent: "flex-end" }}>
              <SongDropdown song={song} />
            </Flex>
          </Flex>
        ) : null}
      </Box>
    </Flex>
  );
};
