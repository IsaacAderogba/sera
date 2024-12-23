import React, { useMemo } from "react";
import { Box } from "../../components/Box";
import { Flex } from "../../components/Flex";
import { useSelector } from "../../providers/StoreContext";
import {
  calculateMetadata,
  formatSeconds,
  orderTrackItemsByTrack
} from "../../remotion/utilities";
import {
  TIMELINE_STEP_OVERCOUNT,
  TIMELINE_STEP_SIZE,
  TIMELINE_STEP_SIZE_WIDTH
} from "../../utilities/constants";

export interface EditorTimelineProps {}

export const EditorTimeline: React.FC<EditorTimelineProps> = () => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);
  const orderedTracks = useMemo(
    () => orderTrackItemsByTrack(composition),
    [composition]
  );
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  const durationInSeconds = metadata.durationInFrames / metadata.fps;
  const stepSizeInSeconds = TIMELINE_STEP_SIZE * timeline.scale;
  const numberOfSteps =
    Math.round(durationInSeconds / stepSizeInSeconds) + TIMELINE_STEP_OVERCOUNT;
  const steps = new Array(numberOfSteps).fill(0).map((_, index) => index);

  console.log({ stepSizeInSeconds });

  return (
    <Flex
      css={{
        position: "relative",
        flexDirection: "column",
        flex: 1,
        width: "fit-content",
        overflow: "auto"
      }}
    >
      <Flex
        css={{
          border: "1px solid blue",
          background: "$surface",
          position: "sticky",
          top: 0
        }}
      >
        <Flex css={{ minWidth: TIMELINE_STEP_SIZE_WIDTH }} />
        {steps.map(step => {
          return (
            <Flex
              key={step}
              css={{
                position: "relative",
                minWidth: TIMELINE_STEP_SIZE_WIDTH,
                height: "8px",
                marginTop: "14px",
                borderLeft: "1px solid $label",
                "&::after": {
                  position: "absolute",
                  content: formatSeconds(step * stepSizeInSeconds),
                  color: "$label",
                  fontSize: "$xs",
                  left: -17,
                  top: -18
                }
              }}
            >
              {/* <Text size="1" color="gray">
                {formatSeconds(step * stepSizeInSeconds)}
                need to get the relative coordinate that it clicked and use that to 
                move the ruler
              </Text> */}
            </Flex>
          );
        })}
      </Flex>
      <Flex
        css={{
          flexDirection: "column",
          minHeight: "4000px",
          width: "100%",
          border: "1px solid red"
          // overflowY: "scroll"
        }}
      >
        {orderedTracks.map(({ trackId, trackItemIds }) => {
          return (
            <Flex key={trackId} css={{ height: "80px", width: "100%" }}>
              <Flex css={{ minWidth: TIMELINE_STEP_SIZE_WIDTH }} />
              <Flex css={{ position: "relative", width: "100%" }}>
                {trackItemIds.map(id => {
                  const trackItem = composition.trackItems[id];

                  const offsetSteps = trackItem.from / stepSizeInSeconds;
                  const steps = trackItem.duration / stepSizeInSeconds;

                  const left = offsetSteps * TIMELINE_STEP_SIZE_WIDTH;
                  const width = steps * TIMELINE_STEP_SIZE_WIDTH;

                  return (
                    <Flex
                      css={{
                        border: "1px solid blue",
                        position: "absolute",
                        height: "100%",
                        left: `${left}px`,
                        width: `${width}px`
                      }}
                      key={id}
                    >
                      {trackItem.type}
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};
