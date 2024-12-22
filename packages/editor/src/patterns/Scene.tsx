import { Box } from "../components/Box";
import { useSelector } from "../providers/StoreContext";
import { Player } from "@remotion/player";
import { DefaultComposition } from "../remotion/DefaultComposition";
import { useMemo } from "react";
import { calculateMetadata } from "../remotion/utilities";

export const Scene: React.FC = () => {
  const composition = useSelector(state => state.editor.composition);
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  return (
    <Box className="no-drag">
      <Player
        controls
        component={DefaultComposition}
        inputProps={composition}
        compositionHeight={metadata.height}
        compositionWidth={metadata.width}
        durationInFrames={metadata.durationInFrames}
        fps={metadata.fps}
        style={{
          width: 320 * 2,
          height: 180 * 2
        }}
      />
    </Box>
  );
};
