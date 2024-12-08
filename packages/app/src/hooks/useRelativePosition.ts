import { useCallback, useEffect, useRef, useState } from "react";
import { useManagedState } from "./useManagedState";
import { useDismissable } from "./useDismissable";

export interface RelativePositionProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  placementOffset?: number;
  position?: "fixed" | "absolute";
  trigger?: ("hover" | "click")[];
  ignore?: ("mouse" | "keyboard" | "focus")[];
}

export const useRelativePosition = <
  T extends HTMLDivElement,
  K extends HTMLDivElement
>({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  placement = "bottom",
  placementOffset,
  position = "fixed",
  trigger = ["hover"],
  ignore = ["focus"]
}: RelativePositionProps) => {
  const portalRef = useRef<T | null>(null);
  const triggerRef = useRef<K | null>(null);
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useManagedState({
    defaultState: false,
    state: openProp,
    onStateChange: onOpenChangeProp
  });

  const onPointChange = useCallback(() => {
    const [trigger, portal] = [triggerRef.current, portalRef.current];
    if (!trigger || !portal) return;

    const { offsetWidth, offsetHeight } = trigger;
    const { bottom, left, top, right } = trigger.getBoundingClientRect();
    const { point } = calculatePoint(
      { bottom, left, top, right, width: offsetWidth, height: offsetHeight },
      { portal, desiredPlacement: placement, gap: placementOffset, position }
    );
    setPoint(point);
  }, [placement, position, placementOffset]);
  useEffect(() => onPointChange(), [onPointChange]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!triggerRef.current || !portalRef.current) return;
      if (open === true) onPointChange();
      setOpen(open);
    },
    [onPointChange, setOpen]
  );

  const hoverableProps = useHoverable({
    onClick: () => {
      if (!trigger.includes("click")) return;

      if (open) {
        onOpenChange(false);
        setClicked(false);
      } else {
        onOpenChange(true);
        setClicked(true);
      }
    },
    onEnter: () => {
      if (trigger.includes("hover")) {
        onOpenChange(true);
      }
    },
    onLeave: () => {
      if (trigger.includes("click") && clicked) return;
      if (trigger.includes("hover")) {
        onOpenChange(false);
      }
    }
  });

  const dismissiableProps = useDismissable(portalRef, {
    enabled: true,
    onDismiss: ({ type }) => {
      if (ignore.includes(type)) return;
      onOpenChange(false);
      setClicked(false);
    }
  });

  return {
    portalRef,
    triggerRef,
    point,
    open,
    onPointChange,
    onOpenChange,
    ...hoverableProps,
    ...dismissiableProps
  };
};

interface HoverableProps {
  onClick: MouseEventHandler;
  onEnter: MouseEventHandler;
  onLeave: MouseEventHandler;
  leaveDuration?: number;
  enterDuration?: number;
}

const useHoverable = ({
  onClick,
  onEnter,
  onLeave,
  enterDuration = 400,
  leaveDuration = 100
}: HoverableProps) => {
  const enterTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const leaveTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const onTriggerClick: MouseEventHandler = e => onClick(e);

  const onTriggerMouseEnter: MouseEventHandler = e => {
    clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => onEnter(e), enterDuration);
  };

  const onTriggerMouseLeave: MouseEventHandler = e => {
    clearTimeout(enterTimeout.current);

    leaveTimeout.current = setTimeout(() => onLeave(e), leaveDuration);
  };

  const onPopoverMouseEnter: MouseEventHandler = () => {
    if (leaveDuration !== 0) clearTimeout(leaveTimeout.current);
  };

  const onPopoverMouseLeave: MouseEventHandler = e => {
    clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => onLeave(e), leaveDuration);
  };

  return {
    onTriggerClick,
    onTriggerMouseEnter,
    onTriggerMouseLeave,
    onPopoverMouseEnter,
    onPopoverMouseLeave
  };
};

function calculatePoint(
  bounds: Omit<DOMRect, "x" | "y" | "toJSON">,
  props: {
    portal: HTMLElement;
    desiredPlacement: Placement;
    gap?: number;
    position?: "fixed" | "absolute";
  }
) {
  const { portal, desiredPlacement, position = "fixed", gap = 8 } = props;
  const boundaries = {
    left: gap,
    top: gap,
    right: document.body.clientWidth - portal.offsetWidth - gap,
    bottom: window.innerHeight - portal.offsetHeight - gap
  };

  const oppositePlacements: Record<Placement, Placement> = {
    left: "right",
    leftBottom: "rightBottom",
    right: "left",
    rightBottom: "leftBottom",
    top: "bottom",
    bottom: "top",
    bottomLeft: "topLeft",
    topLeft: "bottomLeft"
  };

  const calculateAbsolutePlacement = (placement: Placement) => {
    const point = { x: 0, y: 0 };

    switch (placement) {
      case "rightBottom":
        point.x = bounds.width + gap;
        point.y = -(portal.offsetHeight - bounds.height);
        break;
      case "right":
        point.x = bounds.width + gap;
        point.y = (bounds.height - portal.offsetHeight) / 2;
        break;
      case "leftBottom":
      case "left":
        point.x = -(portal.offsetWidth + gap);
        point.y = (bounds.height - portal.offsetHeight) / 2;
        break;
      case "topLeft":
      case "top":
        point.x = (bounds.width + bounds.width - portal.offsetWidth) / 2;
        point.y = -(portal.offsetHeight + gap);
        break;
      case "bottomLeft":
      case "bottom":
      default:
        point.x = (bounds.width + bounds.width - portal.offsetWidth) / 2;
        point.y = bounds.height + gap;
    }

    return point;
  };

  function calculateFixedPlacement(placement: Placement) {
    const point = { x: 0, y: 0 };

    switch (placement) {
      case "rightBottom":
      case "right":
        point.x = bounds.right + gap;
        point.y = bounds.top + (bounds.height - portal.offsetHeight) / 2;
        break;
      case "leftBottom":
      case "left":
        point.x = bounds.left - (portal.offsetWidth + gap);
        point.y = bounds.top + (bounds.height - portal.offsetHeight) / 2;
        break;
      case "top":
        point.x = bounds.left + (bounds.width - portal.offsetWidth) / 2;
        point.y = bounds.top - (portal.offsetHeight + gap);
        break;
      case "topLeft":
        point.x = bounds.left;
        point.y = bounds.top - (portal.offsetHeight + gap);
        break;
      case "bottomLeft":
        point.x = bounds.left;
        point.y = bounds.bottom + gap;
        break;
      case "bottom":
      default:
        point.x = bounds.left + (bounds.width - portal.offsetWidth) / 2;
        point.y = bounds.bottom + gap;
    }

    return point;
  }

  function restrictPoint(point: Point) {
    const pt = { ...point };

    if (pt.x < boundaries.left) {
      pt.x = boundaries.left;
    } else if (pt.x > boundaries.right) {
      pt.x = boundaries.right;
    }

    if (pt.y < boundaries.top) {
      pt.y = boundaries.top;
    } else if (pt.y > boundaries.bottom) {
      pt.y = boundaries.bottom;
    }

    return pt;
  }

  function recurse(
    placement: Placement,
    depth: number
  ): { point: Point; placement: Placement } {
    if (position === "absolute") {
      return { point: calculateAbsolutePlacement(placement), placement };
    }

    const point = calculateFixedPlacement(placement);

    const horizontalFlip =
      point.x < boundaries.left || point.x > boundaries.right;

    const verticalFlip =
      point.y < boundaries.top || point.y > boundaries.bottom;

    if (depth === 2) {
      return {
        point: restrictPoint(calculateFixedPlacement(desiredPlacement)),
        placement: desiredPlacement
      };
    } else if (horizontalFlip || verticalFlip) {
      return recurse(oppositePlacements[placement], depth + 1);
    } else {
      return { point, placement };
    }
  }

  return recurse(desiredPlacement, 0);
}

export type Placement =
  | "top"
  | "bottom"
  | "bottomLeft"
  | "topLeft"
  | "right"
  | "rightBottom"
  | "left"
  | "leftBottom";
export type Point = { x: number; y: number };
type MouseEventHandler = (e: MouseEvent | React.MouseEvent) => void;
