import { Switch } from "react-router-dom";
import { Flex } from "../components/Flex";
import { Route, useRouteParams } from "../components/Route";
import { AppHeader } from "../patterns/Header/AppHeader";
import { AppSidebar } from "../patterns/Sidebar/AppSidebar";
import { BrowseView } from "./BrowseView";
import { PlaylistView } from "./PlaylistView";
import { useProfile } from "../patterns/Profile/useProfile";

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
      <AppHeader profile={profile} />
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
