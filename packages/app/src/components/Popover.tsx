import { Fragment, PropsWithChildren } from "react";
import {
  RelativePositionProps,
  useRelativePosition
} from "../hooks/useRelativePosition";
import { FlexProps } from "./Flex";
import { Box } from "./Box";
import { Portal } from "./Portal";

export interface PopoverProps
  extends RelativePositionProps,
    Omit<FlexProps, "content"> {
  content: React.ReactNode;
}

export const Popover: React.FC<PropsWithChildren<PopoverProps>> = ({
  placement,
  ignore,
  onOpenChange,
  open: openProp,
  placementOffset,
  position = "fixed",
  trigger = ["click"],
  children,
  content,
  ...props
}) => {
  const {
    onClickCapture,
    onFocusCapture,
    onPopoverMouseEnter,
    onPopoverMouseLeave,
    onTriggerClick,
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
        onClick={onTriggerClick}
        onMouseEnter={onTriggerMouseEnter}
        onMouseLeave={onTriggerMouseLeave}
        onFocusCapture={onFocusCapture}
        onClickCapture={onClickCapture}
        {...props}
      >
        {children}
      </Box>
      <Portal
        open={open}
        ref={portalRef}
        onMouseEnter={onPopoverMouseEnter}
        onMouseLeave={onPopoverMouseLeave}
        css={{
          position,
          top: `${point.y}px`,
          left: `${point.x}px`,
          opacity: open ? 1 : 0,
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
