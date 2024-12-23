import { PlayerRef } from "@remotion/player";
import { Box } from "../../components/Box";
import {
  TIMELINE_STEP_SIZE,
  TIMELINE_STEP_SIZE_WIDTH
} from "../../utilities/constants";
import { useSelector } from "../../providers/StoreContext";
import { useEffect, useMemo, useState } from "react";
import { calculateMetadata } from "../../remotion/utilities";

export interface EditorPlayheadProps {
  playerRef: React.RefObject<PlayerRef | null>;
}

export const EditorPlayhead: React.FC<EditorPlayheadProps> = ({
  playerRef
}) => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const { current } = playerRef;
    if (!current) return;

    const onFrameUpdate = () => {
      setFrame(current.getCurrentFrame());
    };

    current.addEventListener("frameupdate", onFrameUpdate);
    return () => {
      current.removeEventListener("frameupdate", onFrameUpdate);
    };
  }, [playerRef]);

  const stepSizeInSeconds = TIMELINE_STEP_SIZE * timeline.scale;
  const seconds = frame / metadata.fps;
  const steps = seconds / stepSizeInSeconds;
  const left = steps * TIMELINE_STEP_SIZE_WIDTH;

  return (
    <Box
      css={{
        pointerEvents: "none",
        position: "absolute",
        left: TIMELINE_STEP_SIZE_WIDTH + left,
        width: "1px",
        height: "100%",
        background: "$foreground"
      }}
    />
  );
};
