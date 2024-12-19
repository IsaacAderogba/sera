import { CalculateMetadataFunction } from "remotion";

export const calculateRemotionMetadata: CalculateMetadataFunction<
  Record<string, any>
> = ({ props }) => {
  const { durationInFrames, fps, compositionHeight, compositionWidth } =
    props.metadata;

  return {
    fps,
    durationInFrames,
    height: compositionHeight,
    width: compositionWidth
  };
};
