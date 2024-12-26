import { Player, PlayerRef } from "@remotion/player";
import { useMemo, useRef } from "react";
import { Box } from "../components/Box";
import { Flex } from "../components/Flex";
import { useSelector } from "../providers/StoreContext";
import { DefaultComposition } from "../remotion/DefaultComposition";
import { calculateMetadata } from "../remotion/utilities";
import { EditorPlayPauseButton } from "../patterns/Editor/EditorPlayPauseButton";
import { EditorTimeDisplay } from "../patterns/Editor/EditorTimeDisplay";
import { EditorTimeline } from "../patterns/Editor/EditorTimeline";
import {
  EditorRedoButton,
  EditorUndoButton
} from "../patterns/Editor/EditorHistoryButtons";
import { Separator } from "@radix-ui/themes";
import { EditorRenderButton } from "../patterns/Editor/EditorRenderButton";
import { EditorRenderDisplay } from "../patterns/Editor/EditorRenderDisplay";
import { cloneDeep } from "lodash-es";
import { EditorThemeButton } from "../patterns/Editor/EditorThemeButton";
import { EditorTrackButtons } from "../patterns/Editor/EditorTrackButtons";

export const EditorView: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const composition = useSelector(state => state.editor.composition);
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  const proxiedComposition = useMemo(() => {
    const clone = cloneDeep(composition);
    for (const id in clone.trackItems) {
      const trackItem = clone.trackItems[id];
      switch (trackItem.type) {
        case "video":
          trackItem.data.src = `video://${trackItem.data.src}`;
          break;
        case "audio":
          trackItem.data.src = `audio://${trackItem.data.src}`;
          break;
      }
    }

    return clone;
  }, [composition]);

  return (
    <Flex
      className="drag"
      css={{
        height: "100%",
        flexDirection: "column",
        background: "$translucent"
      }}
    >
      <Flex css={{ background: "$background", justifyContent: "center" }}>
        <Box className="no-drag" css={{ width: "100%", height: "300px" }}>
          <Player
            ref={playerRef}
            component={DefaultComposition}
            inputProps={proxiedComposition}
            compositionHeight={metadata.height}
            compositionWidth={metadata.width}
            durationInFrames={metadata.durationInFrames}
            fps={metadata.fps}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Flex>
      <Flex
        css={{
          flexDirection: "column",
          background: "$surface",
          flex: 1,
          gap: "$sm",
          overflow: "auto",
          borderTop: "1px solid $border"
        }}
      >
        <Flex
          css={{
            padding: "$base",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Flex css={{ flex: 1, justifyContent: "start" }}>
            <Flex className="no-drag" css={{ alignItems: "center" }}>
              <EditorThemeButton />
              <EditorPlayPauseButton playerRef={playerRef} />
              <Separator orientation="vertical" mx="1" />
              <EditorUndoButton />
              <EditorRedoButton />
            </Flex>
          </Flex>
          <Flex
            css={{ alignItems: "center", flex: 1, justifyContent: "center" }}
          >
            <EditorRenderDisplay />
          </Flex>
          <Flex css={{ alignItems: "center", flex: 1, justifyContent: "end" }}>
            <EditorTimeDisplay playerRef={playerRef} />
            <EditorRenderButton className="no-drag" />
          </Flex>
        </Flex>
        <Flex
          className="no-drag"
          css={{
            flexDirection: "column",
            overflow: "auto",
            gap: "$sm",
            paddingBottom: "$sm"
          }}
        >
          <EditorTimeline playerRef={playerRef} />
          <EditorTrackButtons />
        </Flex>
      </Flex>
    </Flex>
  );
};
