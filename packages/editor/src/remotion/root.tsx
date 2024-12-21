import { Composition } from "remotion";
import { calculateRemotionMetadata } from "../_remotion/calculateRemotionMetadata";
import { DefaultComposition } from "./DefaultComposition";
import { initializeCompositionState } from "./utilities";

export const RemotionRoot: React.FC = () => {
  const state = initializeCompositionState();

  return (
    <>
      <Composition
        id="DefaultComposition"
        // @ts-expect-error - skipping schema validation
        component={DefaultComposition}
        durationInFrames={state.metadata.duration * state.metadata.fps}
        fps={state.metadata.fps}
        width={state.metadata.width}
        height={state.metadata.height}
        defaultProps={state}
        calculateMetadata={calculateRemotionMetadata}
      />
    </>
  );
};
