import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, Heading, IconButton, Text } from "@radix-ui/themes";
import { forwardRef } from "react";
import { Flex } from "../../components/Flex";
import {
  AudioTrack,
  TextTrack,
  Track,
  VideoTrack
} from "../../../electron/preload/types";
import { actions, dispatch } from "../../providers/StoreContext";

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
      <TrackDropdown track={track} />
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
      <TrackDropdown track={track} />
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
      <TrackDropdown track={track} />
    </Flex>
  );
});

const TrackDropdown: React.FC<{ track: Track }> = ({ track }) => {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" size="1">
          <EllipsisVerticalIcon width={16} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1" side="right">
        <DropdownMenu.Item
          color="red"
          onClick={() => {
            dispatch(
              actions.editor.commit({
                type: "delete-track",
                payload: { id: track.id }
              })
            );
          }}
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
