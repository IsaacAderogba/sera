import { ComponentProps } from "@stitches/react";
import { Song } from "../../preload/ipc";
import { styled } from "../../utilities/stitches";

export interface SongPreviewProps extends StyledProps {
  song: Song;
}

export const SongPreview: React.FC<SongPreviewProps> = ({ song, ...props }) => {
  return <Styled {...props}>{song.id}</Styled>;
};

const Styled = styled("div", {
  display: "flex",
  "&:hover": { background: "$neutral", opacity: 0.8 },
  transition: "all 100ms",
  variants: {
    size: {
      compact: {
        padding: "$xxs $xs",
        fontSize: "$sm",
        lineHeight: "$sm",
        letterSpacing: "$sm"
      },
      default: {
        padding: "$xs $sm",
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
