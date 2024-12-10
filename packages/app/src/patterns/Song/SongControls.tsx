import { Flex, FlexProps } from "../../components/Flex";
import { Song } from "../../preload/ipc";

export interface SongControlsProps extends FlexProps {
  song: Song;
}

export const SongControls: React.FC<SongControlsProps> = ({
  css = {},
  song
}) => {
  return (
    <Flex
      css={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...css
      }}
    >
      <Flex>Title</Flex>
      <Flex>Controls</Flex>
    </Flex>
  );
};
