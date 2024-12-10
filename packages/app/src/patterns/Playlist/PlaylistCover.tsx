import { Flex, FlexProps } from "../../components/Flex";
import { Tooltip } from "../../components/Tooltip";
import { Playlist } from "../../preload/ipc";

export interface PlaylistCoverProps extends FlexProps {
  playlist: Playlist;
}

export const PlaylistCover: React.FC<PlaylistCoverProps> = ({
  css = {},
  playlist
}) => {
  const title = playlist.data.title || "Unknown";
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
      {title[0]}
    </Tooltip>
  );
};
