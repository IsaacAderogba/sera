import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Heading, IconButton, Text } from "@radix-ui/themes";
import { forwardRef } from "react";
import { Flex } from "../../components/Flex";
import {
  AudioTrack,
  TextTrack,
  Track,
  VideoTrack
} from "../../../electron/preload/types";

export interface EditorTimelineTrackHeaderProps {
  track: Track;
}

export const EditorTimelineTrackHeader = forwardRef<
  HTMLDivElement,
  EditorTimelineTrackHeaderProps
>(({ track, ...props }, ref) => {
  const { id } = track;
  switch (track.type) {
    case "audio":
      return (
        <EditorAudioTimelineTrackHeader
          key={id}
          track={track}
          ref={ref}
          {...props}
        />
      );
    case "text":
      return (
        <EditorTextTimelineTrackHeader
          key={id}
          track={track}
          ref={ref}
          {...props}
        />
      );
    case "video":
      return (
        <EditorVideoTimelineTrackHeader
          key={id}
          track={track}
          ref={ref}
          {...props}
        />
      );
    default:
      return null;
  }
});

export interface EditorTextTimelineTrackHeaderProps {
  track: TextTrack;
}

export const EditorTextTimelineTrackHeader = forwardRef<
  HTMLDivElement,
  EditorTextTimelineTrackHeaderProps
>(({ track, ...props }, ref) => {
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        height: "100%",
        width: "100%",
        borderRadius: "$md",
        padding: "$sm",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Flex css={{ flexDirection: "column" }}>
        <Heading size="1" weight="medium">
          Text
        </Heading>
        <Text size="1" color="gray">
          Example text track
        </Text>
      </Flex>
      <IconButton variant="ghost" size="1">
        <EllipsisVerticalIcon width={16} />
      </IconButton>
    </Flex>
  );
});

export interface EditorVideoTimelineTrackHeaderProps {
  track: VideoTrack;
}

export const EditorVideoTimelineTrackHeader = forwardRef<
  HTMLDivElement,
  EditorVideoTimelineTrackHeaderProps
>(({ track, ...props }, ref) => {
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        height: "100%",
        width: "100%",
        borderRadius: "$md",
        padding: "$sm",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Flex css={{ flexDirection: "column" }}>
        <Heading size="1" weight="medium">
          Video
        </Heading>
        <Text size="1" color="gray">
          Example video track
        </Text>
      </Flex>
      <IconButton variant="ghost" size="1">
        <EllipsisVerticalIcon width={16} />
      </IconButton>
    </Flex>
  );
});

export interface EditorAudioTimelineTrackHeaderProps {
  track: AudioTrack;
}

export const EditorAudioTimelineTrackHeader = forwardRef<
  HTMLDivElement,
  EditorAudioTimelineTrackHeaderProps
>(({ track, ...props }, ref) => {
  return (
    <Flex
      {...props}
      ref={ref}
      css={{
        height: "100%",
        width: "100%",
        borderRadius: "$md",
        padding: "$sm",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Flex css={{ flexDirection: "column" }}>
        <Heading size="1" weight="medium">
          Audio
        </Heading>
        <Text size="1" color="gray">
          Example audio track
        </Text>
      </Flex>
      <IconButton variant="ghost" size="1">
        <EllipsisVerticalIcon width={16} />
      </IconButton>
    </Flex>
  );
});
