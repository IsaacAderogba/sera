import { ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { createRoutePath, RouteUnion } from "../utilities/route";

export interface LinkProps<P extends RouteUnion>
  extends Omit<NavLinkProps, "to" | "params"> {
  to: P["path"];
  params?: P["params"];
  children?: ReactNode;
}

export function Link<P extends RouteUnion>({
  to,
  params,
  children,
  ...props
}: LinkProps<P>) {
  return (
    <NavLink to={createRoutePath(to, params)} {...props}>
      {children}
    </NavLink>
  );
}
