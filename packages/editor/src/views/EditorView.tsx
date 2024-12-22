import { Player } from "@remotion/player";
import { useMemo } from "react";
import { Box } from "../components/Box";
import { Flex } from "../components/Flex";
import { useSelector } from "../providers/StoreContext";
import { DefaultComposition } from "../remotion/DefaultComposition";
import { calculateMetadata } from "../remotion/utilities";

export const EditorView: React.FC = () => {
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
      <Box
        css={{
          background: "$surface",
          height: "100%",
          borderTop: "1px solid $border"
        }}
      >
        Timeline
      </Box>
    </Flex>
  );
};
