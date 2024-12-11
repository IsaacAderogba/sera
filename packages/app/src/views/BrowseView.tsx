import { useRouteParams } from "../components/Route";
import { useSongs } from "../patterns/Song/useSongs";
import { ListView } from "./ListView";

export const BrowseView: React.FC = () => {
  return null;
  // const { profileId, songId } = useRouteParams([
  //   "/profiles/:profileId/songs/:songId",
  //   "/profiles/:profileId"
  // ]);

  // const songs = useSongs(profileId);

  // return <ListView selectedId={songId} songs={songs} onNavigate={() => {}} />;
};
