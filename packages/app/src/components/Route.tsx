import { Route as NavRoute, RouteProps, useParams } from "react-router-dom";
import { RouteUnion } from "../utilities/route";

export const Route = (
  props: RouteProps & { path: RouteUnion["path"] | RouteUnion["path"][] }
) => <NavRoute {...props} />;

export const useRouteParams = <P extends RouteUnion>(_path: P["path"]) => {
  return useParams<P["params"]>();
};
