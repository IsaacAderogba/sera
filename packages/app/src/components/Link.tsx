import { forwardRef, ReactNode } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { createRoutePath, RouteUnion } from "../utilities/route";

export interface LinkProps<P extends RouteUnion>
  extends Omit<NavLinkProps, "to" | "params"> {
  to: P["path"];
  params?: P["params"];
  children?: ReactNode;
}

function LinkRef<P extends RouteUnion>(
  { to, params, children, ...props }: LinkProps<P>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <NavLink to={createRoutePath(to, params)} ref={ref} {...props}>
      {children}
    </NavLink>
  );
}
export const Link = forwardRef(LinkRef);
