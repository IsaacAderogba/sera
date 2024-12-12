import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { Playlist } from "../../preload/types";
import { useHistory } from "react-router-dom";
import { createRoutePath } from "../../utilities/route";
import { client } from "../../utilities/client";

export interface PlaylistDropdownProps {
  playlist: Playlist;
}

export const PlaylistDropdown: React.FC<PlaylistDropdownProps> = ({
  playlist
}) => {
  const history = useHistory();

  return (
    <Dropdown
      placement="bottom"
      triggerProps={{
        css: { border: "1px solid transparent", position: "relative" }
      }}
      defaultValue="2"
      options={[
        { type: "item", value: "create-song", label: "Create song" },
        { type: "divider", value: "divider" },
        { type: "item", value: "delete-playlist", label: "Delete playlist" }
      ]}
      onValueChange={async (value: string) => {
        switch (value) {
          case "delete-playlist": {
            await client.adapters.playlists.delete(playlist.id);
            const path = createRoutePath({
              path: "/profiles/:profileId",
              params: { profileId: playlist.profileId }
            });
            history.push(path);
            break;
          }
          case "create-song": {
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
          }
        }
      }}
    >
      <Button icon tabIndex={-1} variant="ghost">
        <EllipsisVerticalIcon width={20} />
      </Button>
    </Dropdown>
  );
};
