import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Heading, IconButton, Text } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import { AudioTrack, TextTrack, Track, VideoTrack } from "../../remotion/types";

export interface EditorTimelineTrackProps {
  track: Track;
}

export const EditorTimelineTrack: React.FC<EditorTimelineTrackProps> = ({
  track
}) => {
  const { id } = track;
  switch (track.type) {
    case "audio":
      return <EditorAudioTimelineTrack key={id} track={track} />;
    case "text":
      return <EditorTextTimelineTrack key={id} track={track} />;
    case "video":
      return <EditorVideoTimelineTrack key={id} track={track} />;
    default:
      return null;
  }
};

export interface EditorTextTimelineTrackProps {
  track: TextTrack;
}

export const EditorTextTimelineTrack: React.FC<
  EditorTextTimelineTrackProps
> = ({ track }) => {
  return (
    <Base
      css={{
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
    </Base>
  );
};

export interface EditorVideoTimelineTrackProps {
  track: VideoTrack;
}

export const EditorVideoTimelineTrack: React.FC<
  EditorVideoTimelineTrackProps
> = ({ track }) => {
  return (
    <Base
      css={{
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
    </Base>
  );
};

export interface EditorAudioTimelineTrackProps {
  track: AudioTrack;
}

export const EditorAudioTimelineTrack: React.FC<
  EditorAudioTimelineTrackProps
> = ({ track }) => {
  return (
    <Base
      css={{
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
    </Base>
  );
};

interface BaseProps extends FlexProps {}

const Base: React.FC<PropsWithChildren<BaseProps>> = ({
  children,
  css = {},
  ...props
}) => {
  return (
    <Flex
      {...props}
      css={{ height: "100%", width: "100%", borderRadius: "$md", ...css }}
    >
      {children}
    </Flex>
  );
};
