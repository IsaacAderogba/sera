import { styled } from "../utilities/stitches";
import { ComponentProps } from "@stitches/react";
import { useManagedState } from "../hooks/useManagedState";

export type CheckboxProps = ComponentProps<typeof HiddenCheckbox> & {
  children?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  size,
  checked,
  onCheckedChange,
  css,
  children,
  ...props
}) => {
  const [state, setState] = useManagedState({
    defaultState: false,
    state: checked,
    onStateChange: onCheckedChange
  });

  return (
    <CheckboxContainer>
      <HiddenCheckbox
        type="checkbox"
        checked={state}
        onChange={e => setState(e.target.checked)}
        {...props}
      />
      <StyledCheckbox
        size={size}
        checked={state}
        css={css}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key !== "Enter") return;
          setState(state => !state);
        }}
      >
        <span className="checkmark">✓</span>
      </StyledCheckbox>
      {children}
    </CheckboxContainer>
  );
};

const CheckboxContainer = styled("label", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$sm",
  size: { compact: {}, default: {} }
});

const HiddenCheckbox = styled("input", {
  display: "none",
  variants: { size: { compact: {}, default: {} }, danger: { true: {} } }
});

const StyledCheckbox = styled("div", {
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 100ms",
  border: "1px solid $border",
  color: "$text",
  "&:hover": { borderColor: "$disable" },
  ".checkmark": { color: "transparent" },
  "&:focus-visible": { outline: "solid $label", outlineOffset: "1px" },

  variants: {
    size: {
      compact: { width: "20px", height: "20px" },
      default: { width: "24px", height: "24px" }
    },
    checked: {
      true: {
        ".checkmark": {
          color: "$foreground"
        }
      }
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
  defaultVariants: { size: "default", checked: false, danger: false }
});
