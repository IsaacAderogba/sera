import { forwardRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Box, BoxProps } from "../components/Box";
import { PortalContext, usePortal } from "./PortalContext";
import { Z_INDEX } from "../utilities/constants";

export interface PortalProps extends BoxProps {
  container?: HTMLElement;
}

export const Portal = forwardRef<HTMLDivElement, PortalProps>(
  ({ container = globalThis.document.body, ...props }, ref) => {
    return createPortal(<Box {...props} ref={ref} />, container);
  }
);

export const PortalProvider = forwardRef<HTMLDivElement, PortalProps>(
  ({ children, css, ...props }, ref) => {
    const portal = usePortal();
    const depth = portal ? portal.depth + 1 : Z_INDEX.Higher;
    const Container = portal ? Box : Portal;

    const value = useMemo(() => ({ depth }), [depth]);

    return (
      <PortalContext.Provider value={value}>
        <Container
          ref={ref}
          onClick={event => event.preventDefault()}
          className="glass"
          {...props}
          css={{
            zIndex: depth,
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            transition: `opacity 100ms ease-in`,
            ...css
          }}
        >
          {children}
        </Container>
      </PortalContext.Provider>
    );
  }
);
