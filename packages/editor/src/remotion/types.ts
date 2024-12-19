export interface CompositionRenderProps {
  titleText: string;
  titleColor: string;
  logoColor1: string;
  logoColor2: string;
  metadata: {
    durationInFrames: number;
    compositionWidth: number;
    compositionHeight: number;
    fps: number;
  };
}
