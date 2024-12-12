import { useEffect, useMemo, useState } from "react";
import { Flex } from "../../components/Flex";
import { Input } from "../../components/Input";
import { Text } from "../../components/Typography";
import { useDebounceCallback } from "../../hooks/useDebounce";
import { Playlist, Song } from "../../preload/types";
import { client } from "../../utilities/client";
import { PlaylistCover } from "./PlaylistCover";
import { Button } from "../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "../../components/Tooltip";
import { useHistory } from "react-router-dom";
import { createRoutePath } from "../../utilities/route";
import { formatSeconds } from "../../utilities/lodash";

export interface PlaylistHeaderProps {
  playlist: Playlist;
  songs: Song[];
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  playlist,
  songs
}) => {
  const history = useHistory();

  const [title, onTitleChange] = useState(playlist.data.title || "");
  useEffect(() => onTitleChange(playlist.data.title || ""), [playlist.id]);
  const debouncedTitleUpdate = useDebounceCallback(
    client.adapters.playlists.update,
    [playlist.id]
  );

  const formattedSeconds = useMemo(() => {
    let seconds = 0;
    for (const song of songs) {
      if (!song.data.audioMetadata) continue;
      seconds += song.data.audioMetadata.durationSeconds;
    }

    return formatSeconds(seconds);
  }, [songs]);

  return (
    <Flex css={{ padding: "$md", gap: "$sm", alignItems: "center" }}>
      <PlaylistCover
        playlist={playlist}
        css={{ height: "80px", width: "80px" }}
      />
      <Flex css={{ flexDirection: "column", width: "100%", gap: "$xs" }}>
        <Flex css={{ alignItems: "center" }}>
          <Tooltip content="Add song">
            <Button
              icon
              variant="ghost"
              size="compact"
              onClick={async () => {
                const { profileId } = playlist;
                const song = await client.adapters.songs.create({
                  profileId: playlist.profileId,
                  data: { title: "", description: "" }
                });

                await client.adapters.playlists_songs.create({
                  profileId,
                  playlistId: playlist.id,
                  songId: song.id,
                  data: {}
                });

                const path = createRoutePath({
                  path: "/profiles/:profileId/playlists/:playlistId/songs/:songId",
                  params: {
                    profileId,
                    playlistId: playlist.id,
                    songId: song.id
                  }
                });
                history.push(path);
              }}
            >
              <PlusIcon width={20} />
            </Button>
          </Tooltip>
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
        </Flex>
        <Text size="compact" secondary css={{ paddingLeft: "$xs" }}>
          Playlist - {songs.length} songs, {formattedSeconds}s
        </Text>
      </Flex>
    </Flex>
  );
};
