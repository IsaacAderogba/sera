import { NavLinkProps, NavLink } from "react-router-dom";
import { RouteParams } from "../utilities/route";

export interface LinkProps<T extends keyof RouteParams>
  extends Omit<NavLinkProps, "to" | "params"> {
  to: T;
  params: RouteParams[T];
}

export function Link<T extends keyof RouteParams>(props: LinkProps<T>) {
  return <NavLink {...props} />;
}
