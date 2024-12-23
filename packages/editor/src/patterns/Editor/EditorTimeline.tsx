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
import { Box } from "../../components/Box";

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
          const seconds = step * stepSizeInSeconds;
          return (
            <Flex
              key={step}
              onClick={event => {
                if (!playerRef.current) return;
                if (!(event.target instanceof HTMLElement)) return;

                const mouseX = event.clientX;
                const rect = event.target.getBoundingClientRect();
                const relativeX = mouseX - rect.left;

                const x = Math.max(
                  0,
                  Math.min(relativeX, TIMELINE_STEP_SIZE_WIDTH)
                );

                const step = x / TIMELINE_STEP_SIZE_WIDTH;
                const xSeconds = step * stepSizeInSeconds;

                const accumulatedSeconds = seconds + xSeconds;
                const frame = Math.floor(accumulatedSeconds * metadata.fps);
                playerRef.current.seekTo(frame);
              }}
              css={{
                position: "relative",
                minWidth: TIMELINE_STEP_SIZE_WIDTH,
                padding: "4px 0",
                marginTop: "10px",
                "&::after": {
                  pointerEvents: "none",
                  position: "absolute",
                  content: formatSeconds(seconds),
                  color: "$label",
                  fontSize: "$xs",
                  left: -17,
                  top: -14
                }
              }}
            >
              <Box
                css={{ height: "10px", width: "1px", background: "$label" }}
              />
            </Flex>
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
