import { ComponentProps } from "@stitches/react";
import { Song } from "../../preload/types";
import { styled } from "../../utilities/stitches";
import { Text } from "../../components/Typography";
import { Flex } from "../../components/Flex";
import { useAudioContext } from "../../providers/AudioContext";
import { PlayIcon } from "@heroicons/react/24/outline";
import { formatSeconds } from "../../utilities/lodash";

export interface SongPreviewProps extends StyledProps {
  trackNumber: number;
  song: Song;
}

export const SongPreview: React.FC<SongPreviewProps> = ({
  song,
  trackNumber,
  ...props
}) => {
  const { state } = useAudioContext();
  const isPlaying = state.songId === song.id && state.type !== "pause";

  return (
    <Styled {...props}>
      <Flex css={{ alignItems: "center", gap: "$base" }}>
        <Text secondary>{trackNumber}</Text>
        <Text>{song.data.title || "Untitled"}</Text>
        {isPlaying ? <PlayIcon width={16} /> : null}
      </Flex>
      <Text size="compact" secondary>
        {formatSeconds(song.data.audioMetadata?.durationSeconds)}
      </Text>
    </Styled>
  );
};

const Styled = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "&:hover": { background: "$neutral", opacity: 0.8 },
  transition: "all 100ms",
  variants: {
    size: {
      compact: {
        padding: "$xs",
        fontSize: "$sm",
        lineHeight: "$sm",
        letterSpacing: "$sm"
      },
      default: {
        padding: "$sm",
        fontSize: "$base",
        lineHeight: "$base",
        letterSpacing: "$base"
      }
    },
    active: {
      true: {
        background: "$neutral"
      }
    }
  },
  defaultVariants: { size: "default", active: false }
});

type StyledProps = ComponentProps<typeof Styled>;
