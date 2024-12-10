import { PropsWithChildren, useCallback } from "react";
import { Box } from "../components/Box";
import { Divider } from "../components/Divider";
import { Flex } from "../components/Flex";
import { useValueRef } from "../hooks/useManagedRefs";
import { Song } from "../preload/ipc";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { SongPreview } from "../patterns/Song/SongPreview";
import { useSong } from "../patterns/Song/useSong";
import { SongPlayer } from "../patterns/Song/SongPlayer";

export interface ListViewProps {
  selectedId: number;
  songs: Song[];
  onNavigate: (id: number) => void;
}

export const ListView: React.FC<PropsWithChildren<ListViewProps>> = ({
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
        <Divider />
        <Flex css={{ flexDirection: "column" }}>
          {songs.map(song => {
            return (
              <SongPreview
                key={song.id}
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
          minHeight: song ? "80px" : 0,
          transition: `all 100ms`,
          boxShadow: "$sm",
          background: "$surface",
          borderRadius: "$sm",
          overflow: "hidden"
        }}
      >
        {song ? <SongPlayer song={song} /> : null}
      </Box>
    </Flex>
  );
};
