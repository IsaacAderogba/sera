import { useCallback, useEffect, useState } from "react";
import { Flex } from "../../components/Flex";
import { Input } from "../../components/Input";
import { Text } from "../../components/Typography";
import { Playlist, Song } from "../../preload/ipc";
import { PlaylistCover } from "./PlaylistCover";
import { client } from "../../utilities/client";
import { useDebounceCallback } from "../../hooks/useDebounce";

export interface PlaylistHeaderProps {
  playlist: Playlist;
  songs: Song[];
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ playlist }) => {
  const [title, onTitleChange] = useState(playlist.data.title || "");
  useEffect(() => onTitleChange(playlist.data.title || ""), [playlist.id]);

  const debouncedTitleUpdate = useDebounceCallback(
    client.adapters.playlists.update,
    [playlist.id]
  );

  return (
    <Flex css={{ padding: "$md", gap: "$sm", alignItems: "center" }}>
      <PlaylistCover
        playlist={playlist}
        css={{ height: "80px", width: "80px" }}
      />
      <Flex css={{ flexDirection: "column", width: "100%" }}>
        <Input
          autoFocus
          variant="ghost"
          placeholder="Playlist title..."
          value={title}
          onChange={e => {
            const title = e.target.value;
            onTitleChange(title);
            debouncedTitleUpdate(playlist.id, { data: { title } });
          }}
        />
        <Text size="compact" secondary css={{ paddingLeft: "9px" }}>
          Playlist - 14 songs, 49 mins, 23 seconds
        </Text>
      </Flex>
    </Flex>
  );
};
