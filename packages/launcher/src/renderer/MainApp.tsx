/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SunIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Button, IconButton, Text, TextArea } from "@radix-ui/themes";
import { Item } from "../preload/types";
import { useAppContext } from "../providers/AppContext";
import { AppProvider } from "../providers/AppProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { styled } from "../utilities/stitches";
import { useThemeContext } from "../providers/ThemeContext";
import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

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
  const [loading, setLoading] = useState(false);
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
          loading={loading}
          highContrast
          size="2"
          onClick={async () => {
            if (!item) return;
            setLoading(true);

            try {
              if (item.audioFilename) {
                // todo
              } else {
                dispatch({
                  type: "update-item",
                  payload: {
                    id: item.id,
                    item: await window.ipc.invoke("generateMusic", item)
                  }
                });
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {item?.audioFilename ? "Save" : "Generate"}
        </Button>
      </Flex>
    </Flex>
  );
};

const ItemComponent: React.FC<{ item: Item }> = ({ item }) => {
  const { state, dispatch } = useAppContext();

  const [prompt, onPromptChange] = useState(item.prompt);
  useEffect(() => onPromptChange(item.prompt), [item.id]);
  const debouncedPromptUpdate = useDebounceCallback(
    (prompt: string) => {
      return dispatch({
        type: "update-item",
        payload: { id: item.id, item: { prompt } }
      });
    },
    [item.id]
  );

  const { items } = state;
  const selectedId = state.items[state.index]?.id;
  const isSelectedItem = item.id === selectedId;
  const isItemPlaying = isSelectedItem && state.audio.type !== "pause";

  const time = isSelectedItem ? state.audio.time : 0;
  const end = item.audioDuration;
  const current = end > 0 ? Math.round((time / end) * 100) : 0;

  return (
    <Flex css={{ flexDirection: "column", height: "100%" }}>
      <Flex css={{ padding: "$md $base", flex: 1, width: "100%" }}>
        <TextArea
          size="3"
          variant="soft"
          placeholder="Enter prompt..."
          style={{ width: "100%", background: "transparent", outline: "none" }}
          value={prompt}
          onChange={e => {
            const title = e.target.value;
            onPromptChange(title);
            debouncedPromptUpdate(title);
          }}
        />
      </Flex>
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
            style={{ position: "absolute", width: "28px", height: "28px" }}
            onClick={() => {
              if (!item.audioFilename) return;

              dispatch({
                type: "audio",
                payload: { type: isItemPlaying ? "pause" : "play" }
              });
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

function useDebounceCallback<T extends (...args) => void>(
  func: T,
  deps: DependencyList,
  delay = 500
) {
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, deps);

  const debouncedFunction = useCallback((...args) => {
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);

    clearTimeout(timer.current);
    timer.current = newTimer;
  }, deps);

  return debouncedFunction as T;
}

function formatSeconds(seconds = 0): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(1, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const OFFSET = 8;
const SCALE_FACTOR = 0.06;
