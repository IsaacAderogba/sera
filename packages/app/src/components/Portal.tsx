import { createContext, forwardRef, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { Box, BoxProps } from "./Box";
import { Z_INDEX } from "../utilities/constants";

const PortalContext = createContext<PortalStore | undefined>(undefined);
const usePortal = () => useContext(PortalContext);

export interface PortalStore {
  depth: number;
}

export interface PortalProps extends BoxProps {
  container?: HTMLElement;
}

const ReactPortal = forwardRef<HTMLDivElement, PortalProps>(
  ({ container = globalThis.document.body, ...props }, ref) => {
    return createPortal(<Box {...props} ref={ref} />, container);
  }
);

export const Portal = forwardRef<HTMLDivElement, PortalProps>(
  ({ children, css, ...props }, ref) => {
    const portal = usePortal();
    const depth = portal ? portal.depth + 1 : Z_INDEX.Higher;
    const Container = portal ? Box : ReactPortal;

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
            transition: `opacity 100ms ease-in`,
            background: "$translucent",
            border: "1px solid $border",
            borderRadius: "$sm",
            ...css
          }}
        >
          {children}
        </Container>
      </PortalContext.Provider>
    );
  }
);
