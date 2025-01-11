export const createRoutePath = <T extends keyof RouteParams>(
  path: T,
  params: RouteParams[T]
) => {
  let name: string = path;

  for (const key of Object.keys(params || {})) {
    name = name.replace(`:${key}`, params[key]);
  }

  return name;
};

export type RouteParams = {
  "/": Record<string, never>;
  "/projects/:projectId": { projectId: string };
};
