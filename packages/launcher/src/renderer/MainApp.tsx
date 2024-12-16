import { ThemeProvider } from "../providers/ThemeProvider";
import { ComponentProps } from "@stitches/react";
import { styled } from "../utilities/stitches";
import { AppProvider } from "../providers/AppProvider";

export const MainApp: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <Flex
          className="drag"
          css={{
            background: "$translucent",
            height: "100%",
            flexDirection: "column",
            overflow: "auto"
          }}
        >
          <PanelBody />
          <PanelFooter />
        </Flex>
      </ThemeProvider>
    </AppProvider>
  );
};

const PanelBody: React.FC = () => {
  return <Flex css={{ flex: 1, position: "relative" }}>body</Flex>;
};

const PanelFooter: React.FC = () => {
  return (
    <Flex
      className="no-grad"
      css={{
        justifyContent: "space-between",
        background: "$translucent",
        p: "24px $md $base $md",
        borderTop: "1px solid $border",
        "-webkit-app-region": "no-drag"
      }}
    >
      footer
    </Flex>
  );
};

const Box = styled("div");
type BoxProps = ComponentProps<typeof Box>;
const Flex = styled("div", { display: "flex" });
type FlexProps = ComponentProps<typeof Flex>;
