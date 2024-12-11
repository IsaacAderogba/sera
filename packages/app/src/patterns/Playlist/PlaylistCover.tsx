import { FlexProps } from "../../components/Flex";
import { Tooltip } from "../../components/Tooltip";
import { Text } from "../../components/Typography";
import { Playlist } from "../../preload/types";

export interface PlaylistCoverProps extends FlexProps {
  playlist: Playlist;
}

export const PlaylistCover: React.FC<PlaylistCoverProps> = ({
  css = {},
  playlist
}) => {
  const title = playlist.data.title || "Untitled";
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
