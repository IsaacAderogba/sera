import { forwardRef, ReactNode } from "react";
import {
  NavLink,
  NavLinkProps,
  Route as NavRoute,
  RouteProps
} from "react-router-dom";
import { createRoutePath, RoutePath } from "./useRoute";

export const Route = (
  props: RouteProps & { path: RoutePath["path"] | RoutePath["path"][] }
) => <NavRoute {...props} />;

export interface LinkProps<P extends RoutePath>
  extends Omit<NavLinkProps, "to" | "params"> {
  to: P["path"];
  params?: P["params"];
  children?: ReactNode;
}

function Link<P extends RoutePath>(
  { to, params, children, ...props }: LinkProps<P>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <NavLink to={createRoutePath(to, params)} ref={ref} {...props}>
      {children}
    </NavLink>
  );
}
export const RouteLink = forwardRef(Link);
