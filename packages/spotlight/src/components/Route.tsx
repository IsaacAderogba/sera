import {
  Route as NavRoute,
  RouteProps as NavRouteProps
} from "react-router-dom";
import { RouteParams } from "../utilities/route";

export type RouteProps<T extends keyof RouteParams> = NavRouteProps<T>;

export function Route<T extends keyof RouteParams>(props: RouteProps<T>) {
  return <NavRoute {...props} />;
}
