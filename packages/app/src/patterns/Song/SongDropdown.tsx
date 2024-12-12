import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { Song } from "../../preload/types";
import { useHistory } from "react-router-dom";
import { createRoutePath } from "../../utilities/route";
import { client } from "../../utilities/client";

export interface SongDropdownProps {
  playlistId: number;
  song: Song;
}

export const SongDropdown: React.FC<SongDropdownProps> = ({
  playlistId,
  song
}) => {
  const history = useHistory();

  return (
    <Dropdown
      placement="top"
      triggerProps={{
        css: { border: "1px solid transparent", position: "relative" }
      }}
      defaultValue="2"
      options={[{ type: "item", value: "delete-song", label: "Delete song" }]}
      onValueChange={async (value: string) => {
        switch (value) {
          case "delete-song": {
            await client.adapters.songs.delete(song.id);
            const path = createRoutePath({
              path: "/profiles/:profileId/playlists/:playlistId",
              params: { profileId: song.profileId, playlistId }
            });
            history.push(path);

            break;
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
