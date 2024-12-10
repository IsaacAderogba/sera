import { Flex, FlexProps } from "../../components/Flex";
import { Tooltip } from "../../components/Tooltip";
import { Playlist } from "../../preload/ipc";

export interface PlaylistCoverProps extends FlexProps {
  playlist: Playlist;
}

export const PlaylistCover: React.FC<PlaylistCoverProps> = ({
  css = {},
  ...props
}) => {
  return (
    <Tooltip placement="right" content="A">
      <Flex
        css={{
          justifyContent: "center",
          alignItems: "center",
          background: "$neutral",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "$sm",
          ...css
        }}
        {...props}
      >
        A
      </Flex>
    </Tooltip>
  );
};
