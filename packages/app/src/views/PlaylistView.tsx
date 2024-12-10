import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/Button";
import { useRouteParams } from "../components/Route";
import { usePlaylistSongs } from "../patterns/PlaylistSong/usePlaylistSongs";
import { ListView } from "./ListView";
import { client } from "../utilities/client";
import { useHistory } from "react-router-dom";
import { createRoutePath } from "../utilities/route";
import { PlaylistHeader } from "../patterns/Playlist/PlaylistHeader";
import { usePlaylist } from "../patterns/Playlist/useProfile";

export const PlaylistView: React.FC = () => {
  const history = useHistory();
  const { profileId, playlistId, songId } = useRouteParams([
    "/profiles/:profileId/playlists/:playlistId/songs/:songId",
    "/profiles/:profileId/playlists/:playlistId"
  ]);

  const playlist = usePlaylist(playlistId);
  const songs = usePlaylistSongs(playlistId);

  return (
    <ListView
      selectedId={songId}
      songs={songs}
      onNavigate={id => {
        const path = createRoutePath({
          path: "/profiles/:profileId/playlists/:playlistId/songs/:songId",
          params: { profileId, playlistId, songId: id }
        });
        history.push(path);
      }}
    >
      <PlaylistHeader playlist={playlist} songs={songs} />
      {/* <Button
        onClick={async () => {
          if (!profileId || !playlistId) return;
          const song = await client.adapters.songs.create({
            profileId,
            data: {}
          });

          const playlistSong = await client.adapters.playlists_songs.create({
            profileId,
            playlistId,
            songId: song.id,
            data: {}
          });

          console.log("playlist song", playlistSong);
        }}
      >
        <PlusIcon width={20} />
      </Button> */}
    </ListView>
  );
};
