import { ComponentProps } from "@stitches/react";
import { styled } from "../utilities/stitches";

export const Input = styled("input", {
  width: "100%",
  color: "$text",
  borderRadius: "$sm",
  border: "1px solid",
  outline: "none",
  borderColor: "$border",
  "&::placeholder": { color: "$label", opacity: 0.7 },
  "&:hover": { borderColor: "$disable" },
  "&:active": { borderColor: "$label" },
  "&:focus-visible": { borderColor: "$label" },
  transition: "borderColor 100ms",
  backgroundColor: "transparent",
  variants: {
    size: {
      compact: {
        padding: "$xxs $xs",
        fontSize: "$sm",
        lineHeight: "$xs",
        letterSpacing: "$sm"
      },
      default: {
        padding: "$xs $sm",
        fontSize: "$base",
        lineHeight: "$sm",
        letterSpacing: "$base"
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
  defaultVariants: { size: "default", danger: false }
});

export type InputProps = ComponentProps<HTMLInputElement>;
