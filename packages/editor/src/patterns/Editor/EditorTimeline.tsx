import { PlayerRef } from "@remotion/player";
import React, { useMemo } from "react";
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
import { EditorPlayhead } from "./EditorPlayhead";
import { EditorTimelineItem } from "./EditorTimelineItem";
import { EditorTimelineTrack } from "./EditorTimelineTrack";

export interface EditorTimelineProps {
  playerRef: React.RefObject<PlayerRef | null>;
}

export const EditorTimeline: React.FC<EditorTimelineProps> = ({
  playerRef
}) => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);
  const orderedTracks = useMemo(
    () => orderTrackItemsByTrack(composition, { order: "forward" }),
    [composition]
  );
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  const durationInSeconds = metadata.durationInFrames / metadata.fps;
  const stepSizeInSeconds = TIMELINE_STEP_SIZE * timeline.scale;
  const numberOfSteps =
    Math.round(durationInSeconds / stepSizeInSeconds) + TIMELINE_STEP_OVERCOUNT;
  const steps = new Array(numberOfSteps).fill(0).map((_, index) => index);

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
        css={{ zIndex: 1, background: "$surface", position: "sticky", top: 0 }}
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
            />
          );
        })}
      </Flex>
      <Flex
        css={{ positon: "relative", flexDirection: "column", width: "100%" }}
      >
        <EditorPlayhead playerRef={playerRef} />
        {orderedTracks.map(({ trackId, trackItemIds }) => {
          const track = composition.tracks[trackId];
          return (
            <Flex
              key={trackId}
              css={{
                height: "48px",
                width: "100%",
                borderTop: "1px dashed $border",
                borderBottom: "1px dashed transparent"
              }}
            >
              <Flex
                css={{
                  minWidth: TIMELINE_STEP_SIZE_WIDTH,
                  maxWidth: TIMELINE_STEP_SIZE_WIDTH
                }}
              >
                <EditorTimelineTrack track={track} />
              </Flex>
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
                        position: "absolute",
                        height: "100%",
                        left: `${left}px`,
                        width: `${width}px`,
                        padding: "$xxs"
                      }}
                      key={id}
                    >
                      <EditorTimelineItem key={id} trackItem={trackItem} />
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
