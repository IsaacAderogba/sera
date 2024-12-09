import { Switch } from "react-router-dom";
import { Box } from "../components/Box";
import { Flex } from "../components/Flex";
import { Route, useRouteParams } from "../components/Route";
import { ThemeSwitchButton } from "../patterns/Button/ThemeSwitchButton";
import { ProfileDropdown } from "../patterns/Profile/ProfileDropdown";
import { useProfile } from "../patterns/Profile/useProfile";
import { AppSidebar } from "../patterns/Sidebar/AppSidebar";
import { BrowseView } from "./BrowseView";
import { PlaylistView } from "./PlaylistView";
import {
  NavigateBackButton,
  NavigateForwardButton
} from "../patterns/Button/NavigateButton";

export const ProfileView: React.FC = () => {
  const { profileId } = useRouteParams("/profiles/:profileId");
  const profile = useProfile(profileId);

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
        css={{
          height: 48,
          padding: "0 $base 0 72px",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid red"
        }}
      >
        <Flex css={{ alignItems: "center" }}>
          <NavigateBackButton />
          <NavigateForwardButton />
        </Flex>

        <Flex css={{ alignItems: "center", gap: "$sm" }}>
          <ThemeSwitchButton />
          {profile && <ProfileDropdown profile={profile} />}
        </Flex>
      </Flex>
      <Flex>
        <AppSidebar />
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
