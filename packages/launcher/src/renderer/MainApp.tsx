import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { Button, IconButton } from "@radix-ui/themes";
import { ComponentProps } from "@stitches/react";
import { AppProvider } from "../providers/AppProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { styled } from "../utilities/stitches";
import { useAppContext } from "../providers/AppContext";

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
  const { state } = useAppContext();
  const { index, items } = state;

  return (
    <Flex
      className="no-grad"
      css={{
        justifyContent: "space-between",
        background: "$translucent",
        padding: "$base",
        borderTop: "1px solid $border",
        "-webkit-app-region": "no-drag"
      }}
    >
      <Flex css={{ flex: 1, justifyContent: "start" }}>
        <IconButton size="1" variant="ghost" style={{ margin: 0 }}>
          <PlusIcon width={20} />
        </IconButton>
        <IconButton
          size="1"
          variant="ghost"
          disabled={index === 0 || !items.length}
          style={{ margin: 0 }}
        >
          <ChevronUpIcon width={20} />
        </IconButton>
        <IconButton
          size="1"
          variant="ghost"
          disabled={index === items.length - 1 || !items.length}
          style={{ margin: 0 }}
        >
          <ChevronDownIcon width={20} />
        </IconButton>
      </Flex>
      <Flex
        css={{
          flex: 1,
          justifyContent: "center",
          fontFamily: "$sans",
          fontSize: "$xs",
          alignItems: "center",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap"
        }}
      >
        <Span css={{ color: "$text" }}>{index + 1}&nbsp;</Span>
        <Span css={{ color: "$label", opacity: 0.5 }}>/ {items.length}</Span>
      </Flex>
      <Flex css={{ flex: 1, justifyContent: "end" }}>
        <Button highContrast size="1">
          Generate
        </Button>
      </Flex>
    </Flex>
  );
};

const Span = styled("span");
type SpanProps = ComponentProps<typeof Span>;
const Box = styled("div");
type BoxProps = ComponentProps<typeof Box>;
const Flex = styled("div", { display: "flex" });
type FlexProps = ComponentProps<typeof Flex>;
