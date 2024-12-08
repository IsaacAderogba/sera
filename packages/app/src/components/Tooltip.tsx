import { Fragment, PropsWithChildren } from "react";
import {
  RelativePositionProps,
  useRelativePosition
} from "../hooks/useRelativePosition";
import { FlexProps } from "./Flex";
import { Box } from "./Box";
import { Portal } from "./Portal";

export interface TooltipProps
  extends RelativePositionProps,
    Omit<FlexProps, "content"> {
  content: React.ReactNode;
}

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  placement,
  ignore,
  onOpenChange,
  open: openProp,
  placementOffset,
  position = "fixed",
  trigger,
  children,
  content,
  ...props
}) => {
  const {
    onClickCapture,
    onFocusCapture,
    onPopoverMouseEnter,
    onPopoverMouseLeave,
    onTriggerMouseEnter,
    onTriggerMouseLeave,
    open,
    point,
    portalRef,
    triggerRef
  } = useRelativePosition({
    placement,
    ignore,
    onOpenChange,
    open: openProp,
    placementOffset,
    position,
    trigger
  });

  return (
    <Fragment>
      <Box
        ref={triggerRef}
        onMouseEnter={onTriggerMouseEnter}
        onMouseLeave={onTriggerMouseLeave}
        onFocusCapture={onFocusCapture}
        onClickCapture={onClickCapture}
        {...props}
      >
        {children}
      </Box>
      <Portal
        ref={portalRef}
        onMouseEnter={onPopoverMouseEnter}
        onMouseLeave={onPopoverMouseLeave}
        open={open}
        css={{
          position,
          top: `${point.y}px`,
          left: `${point.x}px`,
          pointerEvents: "none",
          boxShadow: "$sm",
          padding: "$xs $sm",
          background: "$translucent",
          backdropFilter: "blur(4px)"
        }}
      >
        {content}
      </Portal>
    </Fragment>
  );
};
