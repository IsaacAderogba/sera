import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ComponentProps } from "@stitches/react";
import { useManagedState } from "../hooks/useManagedState";
import { useRelativePosition } from "../hooks/useRelativePosition";
import { styled } from "../utilities/stitches";
import { Box } from "./Box";
import { Portal } from "./Portal";
import { Divider } from "./Divider";

interface SelectProps extends TriggerProps {
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void | Promise<void>;
}

export const Select: React.FC<SelectProps> = ({
  defaultValue: defaultValueProp = "",
  value: valueProp,
  onValueChange: onValueChangeProp,

  options,
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
    position: "absolute",
    trigger: ["click"]
  });

  const children = options
    .filter(isSelectItem)
    .find(option => option.value === value)?.label;

  return (
    <Trigger
      ref={triggerRef}
      onClick={onTriggerClick}
      onMouseEnter={onTriggerMouseEnter}
      onMouseLeave={onTriggerMouseLeave}
      onFocusCapture={onFocusCapture}
      onClickCapture={onClickCapture}
      css={{ position: "relative", ...props.css }}
      {...props}
    >
      <Option>{children}</Option>
      <ChevronDownIcon width={20} />
      <Portal
        container={triggerRef.current || undefined}
        ref={portalRef}
        onMouseEnter={onPopoverMouseEnter}
        onMouseLeave={onPopoverMouseLeave}
        css={{
          position: "absolute",
          top: `${point.y}px`,
          left: 0,
          // left: `${point.x}px`,
          opacity: open ? 1 : 0,
          boxShadow: "$sm",
          padding: "$xs $sm",
          background: "$surface",
          width: "100%"
        }}
      >
        {options.map(option => {
          if (option.type === "divider") {
            return <Divider key={option.value} />;
          }

          return (
            <Option
              key={option.value}
              onClick={() => {
                onValueChange(option.value);
                onOpenChange(false);
              }}
            >
              {option.label}
            </Option>
          );
        })}
      </Portal>
    </Trigger>
  );
};

const Option = styled("div", {
  variants: {
    size: {
      compact: {
        minHeight: "16px",
        padding: "$xxs $xs",
        fontSize: "$sm",
        lineHeight: "$sm",
        letterSpacing: "$sm"
      },
      default: {
        minHeight: "20px",
        padding: "$xs $sm",
        fontSize: "$base",
        lineHeight: "$base",
        letterSpacing: "$base"
      }
    }
  },
  defaultVariants: { size: "default" }
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

function isSelectItem(option: SelectOption): option is SelectItem {
  return option.type === "item";
}

type SelectOption = SelectItem | SelectDivider;
type SelectItem = { value: string; type: "item"; label: React.ReactNode };
type SelectDivider = { value: string; type: "divider" };
