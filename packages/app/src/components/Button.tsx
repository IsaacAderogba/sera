import { styled } from "../utilities/stitches";

export const Button = styled("button", {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$xs",
  borderRadius: "$sm",
  fontFamily: "$sans",
  fontWeight: "$normal",
  fontSize: "$sm",
  transition: "all 100ms",
  "&:hover": { opacity: 0.9 },
  "&:active": { opacity: 0.75 },
  "&:focus-visible": { outline: "solid $label", outlineOffset: "1px" },
  variants: {
    disabled: {
      true: {
        border: "1px solid transparent !important",
        cursor: "not-allowed",
        color: "$label !important",
        background: "$disable !important",
        "&:hover, &:active": {
          opacity: "1 !important",
          background: "$disable !important",
          borderColor: "transparent !important"
        }
      }
    },
    size: {
      compact: {
        padding: "$xxs $xs"
      },
      default: {
        padding: "6px 12px"
      }
    },
    variant: {
      solid: {
        border: "1px solid $foreground",
        background: "$foreground",
        color: "$background"
      },
      soft: {
        border: "1px solid transparent",
        background: "$neutral",
        color: "$text",
        "&:hover": { background: "$neutral" }
      },
      outline: {
        border: "1px solid $border",
        color: "$text",
        "&:hover": { borderColor: "$disable", background: "$neutral" }
      },
      ghost: {
        border: "1px solid transparent",
        color: "$text",
        "&:hover": { background: "$neutral" }
      }
    },
    danger: { true: {} }
  },
  compoundVariants: [
    {
      variant: "solid",
      danger: true,
      css: {
        border: "1px solid $danger",
        background: "$danger",
        color: "white"
      }
    },
    {
      variant: "soft",
      danger: true,
      css: { color: "$danger" }
    },
    {
      variant: "outline",
      danger: true,
      css: {
        border: "1px solid $danger",
        color: "$danger",
        "&:hover": { borderColor: "$danger", background: "$neutral" }
      }
    },
    {
      variant: "ghost",
      danger: true,
      css: { color: "$danger" }
    }
  ],

  defaultVariants: {
    size: "default",
    variant: "solid",
    disabled: false,
    danger: false
  }
});
