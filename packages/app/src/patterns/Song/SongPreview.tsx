import { ComponentProps } from "@stitches/react";
import { Song } from "../../preload/ipc";
import { styled } from "../../utilities/stitches";
import { Text } from "../../components/Typography";
import { Flex } from "../../components/Flex";

export interface SongPreviewProps extends StyledProps {
  trackNumber: number;
  song: Song;
}

export const SongPreview: React.FC<SongPreviewProps> = ({
  song,
  trackNumber,
  ...props
}) => {
  return (
    <Styled {...props}>
      <Flex css={{ alignItems: "center", gap: "$base" }}>
        <Text secondary>{trackNumber}</Text>
        <Text>{song.data.title || "Untitled"}</Text>
      </Flex>
      <Text size="compact" secondary>
        1:56
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
