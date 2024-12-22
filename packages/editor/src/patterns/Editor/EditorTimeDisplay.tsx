import { PlayerRef } from "@remotion/player";
import { useSelector } from "../../providers/StoreContext";
import { useEffect, useMemo, useState } from "react";
import { calculateMetadata } from "../../remotion/utilities";
import { Text } from "@radix-ui/themes";
import { Flex } from "../../components/Flex";

export interface EditorTimeDisplayProps {
  playerRef: React.RefObject<PlayerRef | null>;
}

export const EditorTimeDisplay: React.FC<EditorTimeDisplayProps> = ({
  playerRef
}) => {
  const composition = useSelector(state => state.editor.composition);
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

  return (
    <Flex css={{ alignItems: "center" }}>
      <Text size="2">{calculateTime(frame, metadata.fps)} /</Text>
      <Text size="2" color="gray">
        {calculateTime(metadata.durationInFrames, metadata.fps)}
      </Text>
    </Flex>
  );
};

const calculateTime = (frame: number, fps: number): string => {
  const hours = Math.floor(frame / fps / 3600);

  const remainingMinutes = frame - hours * fps * 3600;
  const minutes = Math.floor(remainingMinutes / 60 / fps);

  const remainingSec = frame - hours * fps * 3600 - minutes * fps * 60;
  const seconds = Math.floor(remainingSec / fps);

  const frameAfterSec = Math.round(frame % fps);

  const hoursStr = String(hours);
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");
  const frameStr = String(frameAfterSec).padStart(2, "0");

  if (hours > 0) {
    return `${hoursStr}:${minutesStr}:${secondsStr}.${frameStr}`;
  }

  return `${minutesStr}:${secondsStr}.${frameStr}`;
};
