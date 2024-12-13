import { CSS, styled } from "../utilities/stitches";

export const extraSmallTextSize: CSS = {
  fontSize: "$xs",
  lineHeight: "$xs",
  letterSpacing: "$xs"
};
export const smallTextSize: CSS = {
  fontSize: "$sm",
  lineHeight: "$sm",
  letterSpacing: "$sm"
};
export const baseTextSize: CSS = {
  fontSize: "$base",
  lineHeight: "$base",
  letterSpacing: "$base"
};
export const mediumTextSize: CSS = {
  fontSize: "$md",
  lineHeight: "$md",
  letterSpacing: "$md"
};
export const largeTextSize: CSS = {
  fontSize: "$lg",
  lineHeight: "$lg",
  letterSpacing: "$lg"
};
export const extraLargeTextSize: CSS = {
  fontSize: "$xl",
  lineHeight: "$xl",
  letterSpacing: "$xl"
};
export const extraExtraLargeTextSize: CSS = {
  fontSize: "$xxl",
  lineHeight: "$xxl",
  letterSpacing: "$xxl"
};

export const Title = styled("h6", {
  display: "block",
  color: "$text",
  fontFamily: "$sans",
  fontWeight: "$medium",
  variants: {
    variant: {
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {}
    },
    size: { default: {}, compact: {} },
    ellipsis: {
      true: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    },
    danger: {
      true: {
        color: "$danger"
      }
    }
  },
  compoundVariants: [
    { variant: "h1", size: "default", css: extraExtraLargeTextSize },
    { variant: "h1", size: "compact", css: extraLargeTextSize },
    { variant: "h2", size: "default", css: extraLargeTextSize },
    { variant: "h2", size: "compact", css: largeTextSize },
    { variant: "h3", size: "default", css: largeTextSize },
    { variant: "h3", size: "compact", css: mediumTextSize },
    { variant: "h4", size: "default", css: mediumTextSize },
    { variant: "h4", size: "compact", css: baseTextSize },
    { variant: "h5", size: "default", css: baseTextSize },
    { variant: "h5", size: "compact", css: smallTextSize },
    { variant: "h6", size: "default", css: smallTextSize },
    { variant: "h6", size: "compact", css: extraSmallTextSize }
  ],
  defaultVariants: { variant: "h5", size: "default", ellipsis: false }
});

export const Text = styled("span", {
  color: "$text",
  fontFamily: "$sans",
  fontWeight: "$normal",
  whiteSpace: "pre-wrap",
  variants: {
    size: { compact: smallTextSize, default: baseTextSize },
    secondary: {
      true: {
        color: "$label"
      }
    },
    strong: {
      true: {
        fontWeight: "$medium"
      }
    },
    italic: {
      true: {
        fontStyle: "italic"
      }
    },
    ellipsis: {
      true: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }
  },
  defaultVariants: {
    size: "default",
    strong: false,
    italic: false,
    ellipsis: false
  }
});
