import { Composition } from "remotion";
import { DefaultComposition } from "./DefaultComposition";
import {
  calculateCompositionMetadata,
  calculateMetadata,
  initializeCompositionState
} from "./utilities";
import { useMemo } from "react";

export const RemotionRoot: React.FC = () => {
  const composition = initializeCompositionState();
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  return (
    <>
      <Composition
        id="DefaultComposition"
        component={DefaultComposition}
        durationInFrames={metadata.durationInFrames}
        fps={metadata.fps}
        width={metadata.width}
        height={metadata.height}
        defaultProps={composition}
        calculateMetadata={calculateCompositionMetadata}
      />
    </>
  );
};
