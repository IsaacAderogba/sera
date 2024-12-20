import { ComponentProps } from "@stitches/react";
import { styled } from "../utilities/stitches";

export const Button = styled("button", {
  all: "unset",
  boxSizing: "border-box",
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
        color: "$disable !important",
        "&:hover, &:active": {
          opacity: "1 !important",
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
    ellipsis: {
      true: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
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
    danger: { true: {} },
    icon: { true: {} }
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
      variant: "solid",
      disabled: true,
      css: {
        background: "$disable !important",
        "&:hover, &:active": {
          background: "$disable !important"
        }
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
    },
    {
      size: "compact",
      icon: true,
      css: {
        padding: "0",
        minHeight: "20px",
        minWidth: "20px",
        maxHeight: "20px",
        maxWidth: "20px"
      }
    },
    {
      size: "default",
      icon: true,
      css: {
        padding: "0",
        minHeight: "24px",
        minWidth: "24px",
        maxHeight: "24px",
        maxWidth: "24px"
      }
    }
  ],

  defaultVariants: {
    size: "default",
    variant: "solid",
    disabled: false,
    danger: false
  }
});

export type ButtonProps = ComponentProps<typeof Button>;
