import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/Button";
import { Divider } from "../../components/Divider";
import { Flex, FlexProps } from "../../components/Flex";
import { Tooltip } from "../../components/Tooltip";
import { Playlist, Profile } from "../../preload/ipc";
import { client } from "../../utilities/client";
import { PlaylistCover } from "../Playlist/PlaylistCover";
import { useRouteParams } from "../../components/Route";
import { Link } from "../../components/Link";

export interface AppSidebarProps extends FlexProps {
  profile: Profile;
  playlists: Playlist[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  profile,
  playlists
}) => {
  const { playlistId } = useRouteParams([
    "/profiles/:profileId/playlists/:playlistId",
    "/profiles/:profileId/playlists/:playlistId/songs/:songId"
  ]);

  return (
    <Flex
      css={{
        flexBasis: "64px",
        flexShrink: 0,
        padding: "$base",
        flexDirection: "column",
        overflow: "hidden",
        alignItems: "center"
      }}
    >
      <Flex
        css={{ flex: 1, flexDirection: "column", gap: "$sm", width: "100%" }}
      >
        {playlists.map(playlist => {
          return (
            <Link
              key={playlist.id}
              style={{ textDecoration: "none" }}
              route={{
                path: "/profiles/:profileId/playlists/:playlistId",
                params: {
                  profileId: profile.id.toString(),
                  playlistId: playlist.id.toString()
                }
              }}
            >
              <PlaylistCover
                key={playlist.id}
                playlist={playlist}
                css={{
                  border: "1px solid",
                  borderColor:
                    playlist.id === parseInt(playlistId)
                      ? "$disable"
                      : "transparent"
                }}
              />
            </Link>
          );
        })}
      </Flex>
      <Divider />
      <Tooltip content="Create playlist" placement="right">
        <Button
          icon
          variant="ghost"
          onClick={async () => {
            await client.adapters.playlists.create({
              profileId: profile.id,
              data: {}
            });
          }}
        >
          <PlusIcon width={20} />
        </Button>
      </Tooltip>
    </Flex>
  );
};
