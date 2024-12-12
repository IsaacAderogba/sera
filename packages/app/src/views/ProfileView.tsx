import { Switch } from "react-router-dom";
import { Flex } from "../components/Flex";
import { Route, useRouteParams } from "../components/Route";
import {
  NavigateBackButton,
  NavigateForwardButton
} from "../patterns/Button/NavigateButton";
import { ThemeSwitchButton } from "../patterns/Button/ThemeSwitchButton";
import { usePlaylists } from "../patterns/Playlist/usePlaylists";
import { ProfileDropdown } from "../patterns/Profile/ProfileDropdown";
import { useProfile } from "../patterns/Profile/useProfile";
import { AppSidebar } from "../patterns/Sidebar/AppSidebar";
import { BrowseView } from "./BrowseView";
import { PlaylistView } from "./PlaylistView";

export const ProfileView: React.FC = () => {
  const { profileId } = useRouteParams(["/profiles/:profileId"]);
  const profile = useProfile(profileId);
  const playlists = usePlaylists(profileId);

  return (
    <Flex
      css={{
        background: "$translucent",
        height: "100%",
        width: "100%",
        flexDirection: "column"
      }}
    >
      <Flex
        className="drag"
        css={{
          height: 48,
          padding: "0 $base 0 80px",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Flex className="no-drag" css={{ alignItems: "center" }}>
          <NavigateBackButton />
          <NavigateForwardButton />
        </Flex>

        <Flex className="no-drag" css={{ alignItems: "center", gap: "$sm" }}>
          <ThemeSwitchButton />
          {profile && <ProfileDropdown profile={profile} />}
        </Flex>
      </Flex>
      <Flex css={{ flex: 1, overflow: "auto" }}>
        {profile && <AppSidebar profile={profile} playlists={playlists} />}
        <Switch>
          <Route
            path="/profiles/:profileId/playlists/:playlistId"
            component={PlaylistView}
          />
          <Route path="/profiles/:profileId" component={BrowseView} />
        </Switch>
      </Flex>
    </Flex>
  );
};
