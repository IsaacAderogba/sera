import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Heading, IconButton, Text } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import { AudioTrack, TextTrack, Track, VideoTrack } from "../../remotion/types";

export interface EditorTimelineTrackHeaderProps {
  track: Track;
}

export const EditorTimelineTrackHeader: React.FC<
  EditorTimelineTrackHeaderProps
> = ({ track }) => {
  const { id } = track;
  switch (track.type) {
    case "audio":
      return <EditorAudioTimelineTrackHeader key={id} track={track} />;
    case "text":
      return <EditorTextTimelineTrackHeader key={id} track={track} />;
    case "video":
      return <EditorVideoTimelineTrackHeader key={id} track={track} />;
    default:
      return null;
  }
};

export interface EditorTextTimelineTrackHeaderProps {
  track: TextTrack;
}

export const EditorTextTimelineTrackHeader: React.FC<
  EditorTextTimelineTrackHeaderProps
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

export interface EditorVideoTimelineTrackHeaderProps {
  track: VideoTrack;
}

export const EditorVideoTimelineTrackHeader: React.FC<
  EditorVideoTimelineTrackHeaderProps
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

export interface EditorAudioTimelineTrackHeaderProps {
  track: AudioTrack;
}

export const EditorAudioTimelineTrackHeader: React.FC<
  EditorAudioTimelineTrackHeaderProps
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
