import {
  ChevronDownIcon,
  ChevronUpIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SunIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Button, IconButton, Text } from "@radix-ui/themes";
import { Item } from "../preload/types";
import { useAppContext } from "../providers/AppContext";
import { AppProvider } from "../providers/AppProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { styled } from "../utilities/stitches";
import { useThemeContext } from "../providers/ThemeContext";

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
  const { state } = useAppContext();

  const length = Math.min(2, state.items.length - 1);
  const item = state.items[state.index];

  return (
    <Flex css={{ flex: 1, position: "relative" }}>
      <Flex
        css={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 16,
          paddingLeft: "$md",
          paddingRight: "$md",
          paddingTop: length * OFFSET
        }}
      >
        <Flex
          className="no-drag"
          css={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}
        >
          {Array.from({ length }).map((_ignore, i) => {
            const index = i + 1;
            return (
              <Card
                key={index}
                css={{
                  padding: "12px",
                  transformOrigin: "top center",
                  top: index * -OFFSET,
                  scale: 1 - index * SCALE_FACTOR,
                  zIndex: length - index
                }}
              >
                {index}
              </Card>
            );
          })}
          <Card css={{ zIndex: length }}>
            {item ? <ItemComponent item={item} /> : null}
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
};

const PanelFooter: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { state: themeState, setThemePreference } = useThemeContext();
  const { index, items } = state;
  const { mode } = themeState;

  const item = items[index];

  return (
    <Flex
      className="no-grad"
      css={{
        justifyContent: "space-between",
        background: "$translucent",
        padding: "28px $md $md $md",
        borderTop: "1px solid $border",
        "-webkit-app-region": "no-drag"
      }}
    >
      <Flex css={{ flex: 1, justifyContent: "start" }}>
        <IconButton
          size="2"
          variant="ghost"
          style={{ margin: 0 }}
          onClick={() => {
            setThemePreference(mode === "dark" ? "light" : "dark");
          }}
        >
          <SunIcon width={20} />
        </IconButton>
        <IconButton
          size="2"
          variant="ghost"
          style={{ margin: 0 }}
          onClick={() => {
            dispatch({
              type: "create-item",
              payload: {
                item: { prompt: "", audioDuration: 0, audioFilename: "" }
              }
            });
          }}
        >
          <PlusIcon width={20} />
        </IconButton>
        <IconButton
          size="2"
          variant="ghost"
          disabled={index === 0 || !items.length}
          style={{ margin: 0 }}
          onClick={() => dispatch({ type: "navigate-up", payload: {} })}
        >
          <ChevronUpIcon width={20} />
        </IconButton>
        <IconButton
          size="2"
          variant="ghost"
          disabled={index === items.length - 1 || !items.length}
          style={{ margin: 0 }}
          onClick={() => dispatch({ type: "navigate-down", payload: {} })}
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
        <Button
          highContrast
          size="2"
          onClick={() => {
            // paste into foregrounded app or generate track
          }}
        >
          {item?.audioFilename ? "Paste in background" : "Generate"}
        </Button>
      </Flex>
    </Flex>
  );
};

const ItemComponent: React.FC<{ item: Item }> = ({ item }) => {
  const { state, dispatch } = useAppContext();
  const { items } = state;

  const selectedId = state.items[state.index]?.id;
  const isSelectedItem = item.id === selectedId;
  const isItemPlaying = isSelectedItem && state.audio.type !== "pause";

  const time = isSelectedItem ? state.audio.time : 0;
  const end = item.audioDuration;
  const current = end > 0 ? Math.round((time / end) * 100) : 0;

  return (
    <Flex css={{ flexDirection: "column", height: "100%" }}>
      <Flex css={{ padding: "$base", flex: 1 }}>editor</Flex>
      <Flex
        css={{
          padding: "$base",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Flex css={{ flex: 1, justifyContent: "start" }}>
          <IconButton
            size="2"
            variant="ghost"
            disabled={items.length <= 1}
            style={{ margin: 0 }}
            onClick={() =>
              dispatch({ type: "delete-item", payload: { id: item.id } })
            }
          >
            <TrashIcon width={20} />
          </IconButton>
        </Flex>
        <Flex
          css={{
            flex: 1,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            gap: "$sm"
          }}
        >
          <Text size="2">{formatSeconds(Math.min(time, end))}</Text>
          <Progress value={current} max="100" />
          <Text size="2">{formatSeconds(end)}</Text>
          <IconButton
            radius="full"
            variant="solid"
            color="gray"
            highContrast
            style={{
              margin: 0,
              position: "absolute",
              width: "28px",
              height: "28px"
            }}
          >
            {isItemPlaying ? <PauseIcon width={16} /> : <PlayIcon width={16} />}
          </IconButton>
        </Flex>
        <Flex css={{ flex: 1, justifyContent: "end" }}></Flex>
      </Flex>
    </Flex>
  );
};

const Span = styled("span");
const Box = styled("div");
const Flex = styled("div", { display: "flex" });
const Progress = styled("progress", {});
const Card = styled("div", {
  background: "$surface",
  border: "1px solid $border",
  borderRadius: "$sm",
  boxShadow: "$base",
  position: "absolute",
  width: "100%",
  height: "100%"
});

function formatSeconds(seconds = 0): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(1, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const OFFSET = 8;
const SCALE_FACTOR = 0.06;
