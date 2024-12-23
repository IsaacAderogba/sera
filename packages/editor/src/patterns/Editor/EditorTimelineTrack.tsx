import { CSS as CSSTransform } from "@dnd-kit/utilities";
import React, { forwardRef, PropsWithChildren, useMemo } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import { useSelector } from "../../providers/StoreContext";
import { Track } from "../../remotion/types";
import {
  calculateTrackItemDimsensions,
  orderTrackItemsByTrack
} from "../../remotion/utilities";
import { TIMELINE_STEP_SIZE_WIDTH } from "../../utilities/constants";
import { useDropzoneSortable } from "../Dropzone/hooks";
import { EditorTimelineTrackHeader } from "./EditorTimelineTrackHeader";
import {
  EditorTimelineDraggableTrackItem,
  EditorTimelineTrackItem
} from "./EditorTimelineTrackItem";

export interface EditorTimelineTrackProps extends FlexProps {
  track: Track;
}

export const EditorTimelineSortableTrack: React.FC<
  EditorTimelineTrackProps
> = ({ track, css = {}, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useDropzoneSortable({
      id: track.id,
      data: {
        type: "track",
        data: track,
        size: { width: "100%", height: "48px" }
      }
    });

  return (
    <EditorTimelineTrack
      ref={setNodeRef}
      track={track}
      style={{
        transform: CSSTransform.Transform.toString(transform),
        transition: transform ? "transform 100ms ease" : transition
      }}
      {...attributes}
      {...listeners}
      {...props}
      css={{
        transition: `all 100ms`,
        ...(isOver ? { background: "red" } : {}),
        ...css
      }}
    />
  );
};

export const EditorTimelineTrack = forwardRef<
  HTMLDivElement,
  PropsWithChildren<EditorTimelineTrackProps>
>(({ children, track, css = {}, ...props }, ref) => {
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
      {children}
    </Flex>
  );
});

export interface EditorTimelineTrackItemsProps {
  track: Track;
}

export const EditorTimelineSortableTrackItems: React.FC<
  EditorTimelineTrackItemsProps
> = ({ track }) => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);

  const result = useMemo(() => {
    return orderTrackItemsByTrack(composition, { order: "backward" }).find(
      result => result.trackId === track.id
    );
  }, [track.id, composition]);

  return (
    <Flex css={{ position: "relative", width: "100%" }}>
      {result?.trackItemIds.map(id => {
        const trackItem = composition.trackItems[id];
        const { offset, width } = calculateTrackItemDimsensions(trackItem, {
          timelineState: timeline
        });

        return (
          <Flex
            key={id}
            css={{
              position: "absolute",
              height: "100%",
              left: `${offset}px`,
              width: `${width}px`,
              padding: "$xxs"
            }}
          >
            <EditorTimelineDraggableTrackItem key={id} trackItem={trackItem} />
          </Flex>
        );
      })}
    </Flex>
  );
};

export const EditorTimelineTrackItems: React.FC<
  EditorTimelineTrackItemsProps
> = ({ track }) => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);

  const result = useMemo(() => {
    return orderTrackItemsByTrack(composition, { order: "backward" }).find(
      result => result.trackId === track.id
    );
  }, [track.id, composition]);

  return (
    <Flex css={{ position: "relative", width: "100%" }}>
      {result?.trackItemIds.map(id => {
        const trackItem = composition.trackItems[id];
        const { offset, width } = calculateTrackItemDimsensions(trackItem, {
          timelineState: timeline
        });

        return (
          <Flex
            key={id}
            css={{
              position: "absolute",
              height: "100%",
              left: `${offset}px`,
              width: `${width}px`,
              padding: "$xxs"
            }}
          >
            <EditorTimelineTrackItem key={id} trackItem={trackItem} />
          </Flex>
        );
      })}
    </Flex>
  );
};
