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

export const EditorView: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const composition = useSelector(state => state.editor.composition);
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

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
        <Box className="no-drag" css={{ width: "400px", height: "300px" }}>
          <Player
            ref={playerRef}
            controls
            component={DefaultComposition}
            inputProps={composition}
            compositionHeight={metadata.height}
            compositionWidth={metadata.width}
            durationInFrames={metadata.durationInFrames}
            fps={metadata.fps}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Flex>
      <Flex
        className="no-drag"
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
          <Flex
            css={{ alignItems: "center", flex: 1, justifyContent: "start" }}
          >
            <EditorPlayPauseButton playerRef={playerRef} />
            <Separator orientation="vertical" mx="1" />
            <EditorUndoButton />
            <EditorRedoButton />
          </Flex>
          <Flex
            css={{ alignItems: "center", flex: 1, justifyContent: "center" }}
          >
            <EditorRenderDisplay />
          </Flex>
          <Flex css={{ alignItems: "center", flex: 1, justifyContent: "end" }}>
            <EditorTimeDisplay playerRef={playerRef} />
            <EditorRenderButton />
          </Flex>
        </Flex>
        <Flex css={{ flexDirection: "column", overflow: "auto" }}>
          <EditorTimeline playerRef={playerRef} />
        </Flex>
      </Flex>
    </Flex>
  );
};
