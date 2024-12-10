import { ComponentProps } from "@stitches/react";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useManagedState } from "../hooks/useManagedState";
import {
  RelativePositionProps,
  useRelativePosition
} from "../hooks/useRelativePosition";
import { CSS, styled } from "../utilities/stitches";
import { Divider } from "./Divider";
import { Portal } from "./Portal";
import { PropsWithChildren } from "react";

export interface DropdownProps extends RelativePositionProps {
  triggerProps?: TriggerProps;
  portalCSS?: CSS;
  options: Option[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void | Promise<void>;
}

export const Dropdown: React.FC<PropsWithChildren<DropdownProps>> = ({
  defaultValue: defaultValueProp = "",
  value: valueProp,
  onValueChange: onValueChangeProp,
  options,
  children,
  portalCSS = {},
  position = "fixed",
  triggerProps,
  ...props
}) => {
  const [value, onValueChange] = useManagedState({
    defaultState: defaultValueProp,
    state: valueProp,
    onStateChange: onValueChangeProp
  });

  const {
    onClickCapture,
    onFocusCapture,
    onPopoverMouseEnter,
    onPopoverMouseLeave,
    onTriggerClick,
    onTriggerMouseEnter,
    onTriggerMouseLeave,
    open,
    onOpenChange,
    point,
    portalRef,
    triggerRef
  } = useRelativePosition({
    placement: "bottom",
    placementOffset: 4,
    position,
    trigger: ["click"],
    ...props
  });

  const navigation = useKeyboardNavigation({
    enabled: open,
    defaultValue: value,
    values: options.filter(isDropdownItem).map(item => item.value)
  });

  return (
    <Trigger
      ref={triggerRef}
      onClick={onTriggerClick}
      onMouseEnter={onTriggerMouseEnter}
      onMouseLeave={onTriggerMouseLeave}
      onFocusCapture={onFocusCapture}
      onClickCapture={onClickCapture}
      {...triggerProps}
      css={{ ...triggerProps?.css, position: "relative" }}
      tabIndex={0}
      onKeyDown={event => {
        if (event.key !== "Enter") return;

        if (!open) {
          onOpenChange(true);
        } else if (navigation.value) {
          onValueChange(navigation.value);
          onOpenChange(false);
        }
      }}
    >
      {children}
      <Portal
        open={open}
        container={triggerRef.current || undefined}
        ref={portalRef}
        onMouseEnter={onPopoverMouseEnter}
        onMouseLeave={onPopoverMouseLeave}
        css={{
          position,
          top: `${point.y}px`,
          left: `${point.x}px`,
          boxShadow: "$sm",
          padding: "$xs",
          background: "$surface",
          ...portalCSS
        }}
      >
        {options.map(option => {
          if (option.type === "divider") {
            return <Divider key={option.value} />;
          }

          return (
            <DropdownOption
              key={option.value}
              active={option.value === navigation.value}
              onMouseOver={() => navigation.onValueChange(option.value)}
              onClick={() => {
                onValueChange(option.value);
                onOpenChange(false);
              }}
            >
              {option.label}
            </DropdownOption>
          );
        })}
      </Portal>
    </Trigger>
  );
};

export const DropdownOption = styled("div", {
  borderRadius: "$sm",
  minHeight: "1em",
  whiteSpace: "nowrap",
  variants: {
    size: {
      compact: {
        padding: "$xxs $xs",
        fontSize: "$sm",
        lineHeight: "$sm",
        letterSpacing: "$sm"
      },
      default: {
        padding: "$xs $sm",
        fontSize: "$base",
        lineHeight: "$base",
        letterSpacing: "$base"
      }
    },
    active: {
      true: {
        background: "$neutral"
      }
    }
  },
  defaultVariants: { size: "default", active: false }
});

const Trigger = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  color: "$text",
  borderRadius: "$sm",
  border: "1px solid",
  outline: "none",
  borderColor: "$border",
  "&:hover": { borderColor: "$disable" },
  "&:active": { borderColor: "$label" },
  "&:focus-visible": { borderColor: "$label" },
  transition: "borderColor 100ms",
  backgroundColor: "transparent",
  variants: {
    size: {
      compact: {},
      default: {}
    },
    danger: {
      true: {
        borderColor: "$danger",
        "&:active": { borderColor: "$danger" },
        "&:focus-visible": { borderColor: "$danger" },
        "&:hover": { borderColor: "$danger" }
      }
    }
  },
  defaultVariants: { danger: false }
});
type TriggerProps = ComponentProps<typeof Trigger>;

export function isDropdownItem(option: Option): option is DropdownItem {
  return option.type === "item";
}

export type Option = DropdownItem | DropdownDivider;
export type DropdownItem = {
  value: string;
  type: "item";
  label: React.ReactNode;
};
export type DropdownDivider = { value: string; type: "divider" };
