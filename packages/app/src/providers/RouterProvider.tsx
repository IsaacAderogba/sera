import { Fragment, PropsWithChildren, useMemo } from "react";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import { Route } from "../patterns/Route/Route";
import { createRoutePath, useRouteParams } from "../patterns/Route/useRoute";
import { AuthView } from "../views/AuthView";
import { ProfilePreviewView } from "../views/ProfilePreviewView";
import { ProfileView } from "../views/ProfileView";
import { useAppStore } from "./AppProvider";
import { useProfileStore } from "./DataProvider";

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

  const { state: profileState } = useProfileStore();
  const profile = useMemo(() => {
    return Object.values(profileState)[0];
  }, [profileState]);

  if (loading) return null; // return loading screen component
  if (profile) {
    const profileId = `${profile.id}`;
    return (
      <Redirect to={createRoutePath("/profiles/:profileId", { profileId })} />
    );
  }

  return (
    <Fragment>
      <AuthView />
    </Fragment>
  );
};

const ProfileRoute: React.FC = () => {
  // const loading = useIsLoading();
  // const hasProfile = useHasProfile();
  // if (loading) return null; // return loading screen component
  // if (!hasProfile) return null; // return auth view component

  return <ProfileView />;
};

const ProfilePreviewRoute: React.FC = () => {
  const loading = useIsLoading();
  const hasProfile = useHasProfile();
  if (loading) return null; // return loading screen component
  if (!hasProfile) return null; // return auth view component

  return <ProfilePreviewView />;
};

const useHasProfile = () => {
  const { profileId } = useRouteParams("/profiles/:profileId");
  const { state: profileState } = useProfileStore();
  return useMemo(() => {
    return Boolean(profileState[profileId]);
  }, [profileId, profileState]);
};

const useIsLoading = () => {
  const { state: appState } = useAppStore();
  return useMemo(() => {
    const { dataStatus } = appState;
    return Object.values(dataStatus).some(status => status === "loading");
  }, [appState]);
};
