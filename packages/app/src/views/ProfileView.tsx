import { Switch } from "react-router-dom";
import { Box } from "../components/Box";
import { Flex } from "../components/Flex";
import { AppHeader } from "../patterns/Header/AppHeader";
import { AppSidebar } from "../patterns/Sidebar/AppSidebar";
import { Route } from "../components/Route";
import { PlaylistView } from "./PlaylistView";
import { BrowseView } from "./BrowseView";

export const ProfileView: React.FC = () => {
  return (
    <Flex
      css={{
        background: "$translucent",
        height: "100%",
        width: "100%",
        flexDirection: "column"
      }}
    >
      <AppHeader />
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
