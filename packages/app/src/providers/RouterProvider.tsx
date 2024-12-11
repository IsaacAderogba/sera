import { PropsWithChildren, useMemo } from "react";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import { AuthView } from "../views/AuthView";
import { AudioPlayerView } from "../views/AudioPlayerView";
import { ProfileView } from "../views/ProfileView";
import { useAppContext } from "./AppContext";
import { useProfileContext } from "./DataContext";
import { createRoutePath } from "../utilities/route";
import { Route, useRouteParams } from "../components/Route";

export const MainRouterProvider: React.FC<PropsWithChildren> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={["/", "/main"]} component={AuthRoute} />
        <Route path="/profiles/:profileId" component={ProfileRoute} />
      </Switch>
    </BrowserRouter>
  );
};

export const MenubarRouterProvider: React.FC<PropsWithChildren> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={["/", "/menubar"]} component={AuthRoute} />
        <Route path="/profiles/:profileId" component={ProfilePreviewRoute} />
      </Switch>
    </BrowserRouter>
  );
};

const AuthRoute: React.FC = () => {
  const loading = useIsLoading();

  const { state: profileState } = useProfileContext();
  const profile = useMemo(() => {
    return Object.values(profileState)[0];
  }, [profileState]);

  if (loading) return null; // return loading screen component
  if (profile) {
    return (
      <Redirect
        to={createRoutePath({
          path: "/profiles/:profileId",
          params: { profileId: profile.id }
        })}
      />
    );
  }

  return <AuthView />;
};

const ProfileRoute: React.FC = () => {
  const loading = useIsLoading();
  const hasProfile = useHasProfile();
  if (loading) return null;
  if (!hasProfile) return null;

  return <ProfileView />;
};

const ProfilePreviewRoute: React.FC = () => {
  const loading = useIsLoading();
  const hasProfile = useHasProfile();
  if (loading) return null;
  if (!hasProfile) return null;

  return <AudioPlayerView />;
};

const useHasProfile = () => {
  const { profileId } = useRouteParams(["/profiles/:profileId"]);

  const { state: profileState } = useProfileContext();
  return useMemo(() => {
    return Boolean(profileState[profileId]?.token);
  }, [profileId, profileState]);
};

const useIsLoading = () => {
  const { state: appState } = useAppContext();
  return useMemo(() => {
    const { dataStatus } = appState;
    return Object.values(dataStatus).some(status => status === "loading");
  }, [appState]);
};
