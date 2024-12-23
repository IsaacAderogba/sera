import { forwardRef } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import {
  AudioTrackItem,
  TextTrackItem,
  TrackItem,
  VideoTrackItem
} from "../../remotion/types";

export interface EditorTimelineTrackItemProps extends FlexProps {
  trackItem: TrackItem;
}

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
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        ...css,
        height: "100%",
        width: "100%",
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
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        ...css,
        height: "100%",
        width: "100%",
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
  return (
    <Flex
      {...props}
      css={{
        ...css,
        height: "100%",
        width: "100%",
        borderRadius: "$md",
        transition: "background 100ms",
        background: "$pinkA4",
        "&:hover": { background: "$pinkA5" }
      }}
    />
  );
});
