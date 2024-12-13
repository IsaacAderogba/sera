import { ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { createRoutePath, RouteUnion } from "../utilities/route";

export interface LinkProps<P extends RouteUnion>
  extends Omit<NavLinkProps, "to" | "params"> {
  route: P;
  children?: ReactNode;
}

export function Link<P extends RouteUnion>({
  route,
  children,
  ...props
}: LinkProps<P>) {
  return (
    <NavLink to={createRoutePath(route)} {...props}>
      {children}
    </NavLink>
  );
}
