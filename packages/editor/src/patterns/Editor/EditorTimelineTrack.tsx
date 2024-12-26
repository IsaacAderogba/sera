import { CSS as CSSTransform } from "@dnd-kit/utilities";
import React, { forwardRef, PropsWithChildren, useMemo } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import { useSelector } from "../../providers/StoreContext";
import {
  calculateTrackItemDimensions,
  orderTrackItemsByTrack
} from "../../remotion/utilities";
import { TIMELINE_STEP_SIZE_WIDTH } from "../../utilities/constants";
import { useDropzoneDroppable, useDropzoneSortable } from "../Dropzone/hooks";
import { EditorTimelineTrackHeader } from "./EditorTimelineTrackHeader";
import {
  DraggableTimelineTrackItem,
  EditorTimelineTrackItem
} from "./EditorTimelineTrackItem";
import {
  useIsEditorTimelineTrackDroppable,
  useIsEditorTimelineTrackSortable
} from "./hooks";
import { Track } from "../../../electron/preload/types";

export interface EditorTimelineTrackProps extends FlexProps {
  track: Track;
}

export const createSortableeEditorTimelineTrackId = (id: string) =>
  `sortable-editor-timeline-track-${id}`;

export const SortableEditorTimelineTrack: React.FC<
  EditorTimelineTrackProps
> = ({ track, css = {}, children, ...props }) => {
  const isSortable = useIsEditorTimelineTrackSortable(track);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useDropzoneSortable({
    id: createSortableeEditorTimelineTrackId(track.id),
    data: {
      type: "track",
      data: track,
      size: { width: "100%", height: "48px" }
    },
    disabled: !isSortable
  });

  return (
    <Flex
      ref={setNodeRef}
      style={{
        transform: CSSTransform.Transform.toString(transform),
        transition: transform ? "transform 100ms ease" : transition
      }}
      {...attributes}
      {...props}
      css={{
        height: "48px",
        width: "100%",
        borderTop: "1px dashed $border",
        borderBottom: "1px dashed transparent",
        transition: `all 100ms`,
        ...css
      }}
    >
      <Flex
        css={{
          minWidth: TIMELINE_STEP_SIZE_WIDTH,
          maxWidth: TIMELINE_STEP_SIZE_WIDTH
        }}
      >
        <EditorTimelineTrackHeader
          ref={setActivatorNodeRef}
          track={track}
          {...listeners}
        />
      </Flex>
      {children}
    </Flex>
  );
};

export const EditorTimelineTrack = forwardRef<
  HTMLDivElement,
  PropsWithChildren<EditorTimelineTrackProps>
>(({ children, track, css = {}, ...props }, ref) => {
  return (
    <Flex
      ref={ref}
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

export const DroppableEditorTimelineTrackItems: React.FC<
  EditorTimelineTrackItemsProps
> = ({ track }) => {
  const composition = useSelector(state => state.editor.composition);
  const timelineState = useSelector(state => state.timeline);

  const result = useMemo(() => {
    return orderTrackItemsByTrack(composition, { order: "backward" }).find(
      result => result.trackId === track.id
    );
  }, [track.id, composition]);

  const isDroppable = useIsEditorTimelineTrackDroppable(track);
  const { setNodeRef, isOver } = useDropzoneDroppable({
    id: `droppable-editor-timeline-track-items-${track.id}`,
    data: {
      type: "track",
      data: track,
      position: "on"
    },
    disabled: !isDroppable
  });

  return (
    <Flex
      ref={setNodeRef}
      css={{
        position: "relative",
        width: "100%",
        border: "1px solid",
        borderRadius: "$sm",
        borderColor: isOver ? "$grayA8" : "transparent"
      }}
    >
      {result?.trackItemIds.map(id => {
        const trackItem = composition.trackItems[id];
        const { offset } = calculateTrackItemDimensions(trackItem, {
          timelineState
        });

        return (
          <Flex
            key={id}
            css={{
              position: "absolute",
              height: "100%",
              left: `${offset}px`,
              padding: "$xxs"
            }}
          >
            <DraggableTimelineTrackItem key={id} trackItem={trackItem} />
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
        const { offset, width } = calculateTrackItemDimensions(trackItem, {
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
