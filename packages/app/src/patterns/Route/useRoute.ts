import { useParams } from "react-router-dom";

export const useRouteParams = <P extends RoutePath>(_path: P["path"]) => {
  return useParams<P["params"]>();
};

export const createRoutePath = <P extends RoutePath>(
  path: P["path"],
  params?: P["params"]
) => {
  let route: string = path;
  const paramObj: { [i: string]: string } = params || {};

  for (const key of Object.keys(paramObj)) {
    route = route.replace(`:${key}`, paramObj[key]);
  }

  return route;
};

export type RoutePath =
  | { path: "/"; params: Record<string, never> }
  | { path: "/main"; params: Record<string, never> }
  | { path: "/menubar"; params: Record<string, never> }
  | { path: "/profiles/:profileId"; params: { profileId: string } }
  | { path: "/profiles/:profileId/playlists"; params: { profileId: string } }
  | {
      path: "/profiles/:profileId/playlists/:playlistId";
      params: { profileId: string; playlistId: string };
    }
  | {
      path: "/profiles/:profileId/playlists/:playlistId/songs";
      params: { profileId: string; playlistId: string };
    }
  | {
      path: "/profiles/:profileId/playlists/:playlistId/songs/:songId";
      params: { profileId: string; playlistId: string; songId: string };
    }
  | { path: "/profiles/:profileId/songs"; params: { profileId: string } }
  | {
      path: "/profiles/:profileId/songs/:songId";
      params: { profileId: string; songId: string };
    };