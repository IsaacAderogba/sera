import { FlexProps } from "../../components/Flex";
import { Tooltip } from "../../components/Tooltip";
import { Text } from "../../components/Typography";
import { Song } from "../../preload/types";

export interface SongCoverProps extends FlexProps {
  song: Song;
}

export const SongCover: React.FC<SongCoverProps> = ({ css = {}, song }) => {
  const title = song.data.title || "Untitled";
  return (
    <Tooltip
      placement="right"
      content={title}
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "$neutral",
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: "$sm",
        ...css
      }}
    >
      <Text>{title[0]}</Text>
    </Tooltip>
  );
};
