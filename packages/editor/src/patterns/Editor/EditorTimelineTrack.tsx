import { forwardRef, useMemo } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import { useSelector } from "../../providers/StoreContext";
import { Track } from "../../remotion/types";
import {
  TIMELINE_STEP_SIZE,
  TIMELINE_STEP_SIZE_WIDTH
} from "../../utilities/constants";
import { EditorTimelineTrackItem } from "./EditorTimelineTrackItem";
import { EditorTimelineTrackHeader } from "./EditorTimelineTrackHeader";

export interface EditorTimelineTrackProps extends FlexProps {
  track: Track;
}

export const EditorTimelineTrack = forwardRef<
  HTMLDivElement,
  EditorTimelineTrackProps
>(({ track, css = {}, ...props }, ref) => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);
  const stepSizeInSeconds = TIMELINE_STEP_SIZE * timeline.scale;

  const trackItemIds = useMemo(() => {
    const trackItemIds: string[] = [];

    for (const trackItemId in composition.trackItems) {
      const trackItem = composition.trackItems[trackItemId];
      if (trackItem.trackId !== track.id) continue;
      trackItemIds.push(trackItem.id);
    }

    return trackItemIds;
  }, [track.id, composition]);

  return (
    <Flex
      ref={ref}
      key={track.id}
      {...props}
      css={{
        height: "48px",
        width: "100%",
        borderTop: "1px dashed $border",
        borderBottom: "1px dashed transparent",
        ...css
      }}
    >
      <Flex
        css={{
          minWidth: TIMELINE_STEP_SIZE_WIDTH,
          maxWidth: TIMELINE_STEP_SIZE_WIDTH
        }}
      >
        <EditorTimelineTrackHeader track={track} />
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
              <EditorTimelineTrackItem key={id} trackItem={trackItem} />
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
});
