import { ComponentProps } from "@stitches/react";
import { styled } from "../utilities/stitches";

export const Divider = styled("div", {
  background: "$border",
  opacity: 0.6,
  variants: {
    orientation: {
      horizontal: { width: "100%", height: "1px" },
      vertical: { height: "100%", width: "1px" }
    },
    size: {
      compact: { margin: "$xxs 0" },
      default: { margin: "$xs 0" }
    }
  },
  defaultVariants: { size: "default", orientation: "horizontal" }
});

export type DividerProps = ComponentProps<typeof Divider>;
