import { styled } from "../utilities/stitches";

export const Card = styled("div", {
  background: "$surface",
  borderRadius: "$base",
  width: "100%",
  gap: "$lg",
  border: "1px solid $border",
  variants: {
    size: {
      compact: { padding: "$sm" },
      default: { padding: "$base" }
    }
  },
  defaultVariants: { size: "default" }
});
