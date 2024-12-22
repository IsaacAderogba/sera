import { Composition } from "remotion";
import { DefaultComposition } from "./DefaultComposition";
import { calculateMetadata, initializeCompositionState } from "./utilities";

export const RemotionRoot: React.FC = () => {
  const state = initializeCompositionState();

  return (
    <>
      <Composition
        id="DefaultComposition"
        component={DefaultComposition}
        durationInFrames={state.metadata.duration * state.metadata.fps}
        fps={state.metadata.fps}
        width={state.metadata.width}
        height={state.metadata.height}
        defaultProps={state}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
