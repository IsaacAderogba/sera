import {
  matchPath,
  Route as NavRoute,
  RouteProps,
  useLocation
} from "react-router-dom";
import { useDeepMemo } from "../hooks/useDeepEquals";
import { RouteUnion } from "../utilities/route";

export const Route = (
  props: RouteProps & { path: RouteUnion["path"] | RouteUnion["path"][] }
) => <NavRoute {...props} />;

export const useRouteParams = (
  path: RouteUnion["path"][],
  props: Omit<RouteProps, "path"> = {}
) => {
  const location = useLocation();
  return useDeepMemo(() => {
    const result = matchPath<Record<string, string>>(location.pathname, {
      path,
      ...props
    });

    return result?.params || {};
  }, [path, location.pathname, props]);
};
