export const createRoutePath = <P extends RouteUnion>(route: P) => {
  let name: string = route.path;
  const paramObj: { [i: string]: any } = route.params || {};

  for (const key of Object.keys(paramObj)) {
    name = name.replace(`:${key}`, paramObj[key]);
  }

  return name;
};

export type RouteUnion =
  | SlashRoute
  | MainRoute
  | MenubarRoute
  | ProfileRoute
  | ProfileSongRoute
  | ProfilePlaylistRoute
  | ProfilePlaylistSongRoute;

export type SlashRoute = { path: "/"; params: Record<string, never> };
export type MainRoute = { path: "/main"; params: Record<string, never> };
export type MenubarRoute = { path: "/menubar"; params: Record<string, never> };
export type ProfileRoute = {
  path: "/profiles/:profileId";
  params: { profileId: number };
};
export type ProfileSongRoute = {
  path: "/profiles/:profileId/songs/:songId";
  params: { profileId: number; songId: number };
};
export type ProfilePlaylistRoute = {
  path: "/profiles/:profileId/playlists/:playlistId";
  params: { profileId: number; playlistId: number };
};
export type ProfilePlaylistSongRoute = {
  path: "/profiles/:profileId/playlists/:playlistId/songs/:songId";
  params: { profileId: number; playlistId: number; songId: number };
};
