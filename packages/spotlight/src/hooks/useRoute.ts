import { matchPath, RouteProps, useLocation } from "react-router-dom";
import { RouteParams } from "../utilities/route";
import { useMemo } from "react";

export const useRouteParams = <T extends keyof RouteParams>(
  path: T,
  props: Pick<RouteProps, "exact">
): RouteParams[T] => {
  const location = useLocation();
  return useMemo(() => {
    const result = matchPath<RouteParams[T]>(location.pathname, {
      path,
      exact: props.exact
    })?.params;

    return result! || {};
  }, [path, location.pathname, props.exact]);
};
