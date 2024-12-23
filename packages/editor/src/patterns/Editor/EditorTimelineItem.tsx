import { PropsWithChildren } from "react";
import { Flex, FlexProps } from "../../components/Flex";
import {
  AudioTrackItem,
  TextTrackItem,
  TrackItem,
  VideoTrackItem
} from "../../remotion/types";

export interface EditorTimelineItemProps {
  trackItem: TrackItem;
}

export const EditorTimelineItem: React.FC<EditorTimelineItemProps> = ({
  trackItem
}) => {
  const { id } = trackItem;
  switch (trackItem.type) {
    case "audio":
      return <EditorAudioTimelineItem key={id} trackItem={trackItem} />;
    case "text":
      return <EditorTextTimelineItem key={id} trackItem={trackItem} />;
    case "video":
      return <EditorVideoTimelineItem key={id} trackItem={trackItem} />;
    default:
      return null;
  }
};

export interface EditorTextTimelineItemProps {
  trackItem: TextTrackItem;
}

export const EditorTextTimelineItem: React.FC<EditorTextTimelineItemProps> = ({
  trackItem
}) => {
  return <Timeline css={{ background: "$greenA4" }}></Timeline>;
};

export interface EditorVideoTimelineItemProps {
  trackItem: VideoTrackItem;
}

export const EditorVideoTimelineItem: React.FC<
  EditorVideoTimelineItemProps
> = ({ trackItem }) => {
  return <Timeline css={{ background: "$blueA4" }}></Timeline>;
};

export interface EditorAudioTimelineItemProps {
  trackItem: AudioTrackItem;
}

export const EditorAudioTimelineItem: React.FC<
  EditorAudioTimelineItemProps
> = ({ trackItem }) => {
  /**
   * so, also need to make the channel
   */
  return <Timeline css={{ background: "$pinkA4" }}></Timeline>;
};

interface TimelineProps extends FlexProps {}

const Timeline: React.FC<PropsWithChildren<TimelineProps>> = ({
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
