import { useHistory } from "react-router-dom";
import { useRouteParams } from "../components/Route";
import { PlaylistHeader } from "../patterns/Playlist/PlaylistHeader";
import { usePlaylist } from "../patterns/Playlist/useProfile";
import { usePlaylistSongs } from "../patterns/PlaylistSong/usePlaylistSongs";
import { createRoutePath } from "../utilities/route";
import { ListView } from "./ListView";

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
    </ListView>
  );
};
