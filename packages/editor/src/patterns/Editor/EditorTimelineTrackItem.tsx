import { forwardRef } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import {
  AudioTrackItem,
  TextTrackItem,
  TrackItem,
  VideoTrackItem
} from "../../../electron/preload/types";
import { useDropzoneDraggable } from "../Dropzone/hooks";
import { useSelector } from "../../providers/StoreContext";
import { calculateTrackItemDimensions } from "../../remotion/utilities";

export interface EditorTimelineTrackItemProps extends FlexProps {
  trackItem: TrackItem;
}

export const DraggableTimelineTrackItem: React.FC<
  EditorTimelineTrackItemProps
> = ({ trackItem, ...props }) => {
  const { attributes, listeners, setNodeRef } = useDropzoneDraggable({
    id: `draggable-timeline-track-item-${trackItem.id}`,
    data: {
      type: "track-item",
      data: trackItem
    }
  });

  return (
    <EditorTimelineTrackItem
      ref={setNodeRef}
      trackItem={trackItem}
      {...listeners}
      {...attributes}
      {...props}
    />
  );
};

export const EditorTimelineTrackItem = forwardRef<
  HTMLDivElement,
  EditorTimelineTrackItemProps
>(({ trackItem, ...props }, ref) => {
  const { id } = trackItem;
  switch (trackItem.type) {
    case "audio":
      return (
        <EditorAudioTimelineItem
          key={id}
          trackItem={trackItem}
          {...props}
          ref={ref}
        />
      );
    case "text":
      return (
        <EditorTextTimelineItem
          key={id}
          trackItem={trackItem}
          {...props}
          ref={ref}
        />
      );
    case "video":
      return (
        <EditorVideoTimelineItem
          key={id}
          trackItem={trackItem}
          {...props}
          ref={ref}
        />
      );
    default:
      return null;
  }
});

export interface EditorTextTimelineItemProps extends FlexProps {
  trackItem: TextTrackItem;
}

export const EditorTextTimelineItem = forwardRef<
  HTMLDivElement,
  EditorTextTimelineItemProps
>(({ trackItem, css = {}, ...props }, ref) => {
  const timelineState = useSelector(state => state.timeline);
  const { width } = calculateTrackItemDimensions(trackItem, { timelineState });
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        ...css,
        height: "100%",
        width: `${width}px`,
        borderRadius: "$md",
        transition: "background 100ms",
        background: "$greenA4",
        "&:hover": { background: "$greenA5" }
      }}
    ></Flex>
  );
});

export interface EditorVideoTimelineItemProps extends FlexProps {
  trackItem: VideoTrackItem;
}

export const EditorVideoTimelineItem = forwardRef<
  HTMLDivElement,
  EditorVideoTimelineItemProps
>(({ trackItem, css = {}, ...props }, ref) => {
  const timelineState = useSelector(state => state.timeline);
  const { width } = calculateTrackItemDimensions(trackItem, { timelineState });
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        ...css,
        height: "100%",
        width: `${width}px`,
        borderRadius: "$md",
        transition: "background 100ms",
        background: "$blueA4",
        "&:hover": { background: "$blueA5" }
      }}
    ></Flex>
  );
});

export interface EditorAudioTimelineItemProps extends FlexProps {
  trackItem: AudioTrackItem;
}

export const EditorAudioTimelineItem = forwardRef<
  HTMLDivElement,
  EditorAudioTimelineItemProps
>(({ trackItem, css = {}, ...props }, ref) => {
  const timelineState = useSelector(state => state.timeline);
  const { width } = calculateTrackItemDimensions(trackItem, { timelineState });
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        ...css,
        height: "100%",
        width: `${width}px`,
        borderRadius: "$md",
        transition: "background 100ms",
        background: "$pinkA4",
        "&:hover": { background: "$pinkA5" }
      }}
    />
  );
});
