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
          height: "100%",
          gap: "$sm",
          borderTop: "1px solid $border",
          overflow: "auto"
        }}
      >
        <Flex
          css={{
            padding: "$base",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <EditorPlayPauseButton playerRef={playerRef} />
          <EditorTimeDisplay playerRef={playerRef} />
        </Flex>
        <EditorTimeline />
      </Flex>
    </Flex>
  );
};
