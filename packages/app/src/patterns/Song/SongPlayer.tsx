import { Flex, FlexProps } from "../../components/Flex";
import { Song } from "../../preload/ipc";

export interface SongPlayerProps extends FlexProps {
  song: Song;
}

export const SongPlayer: React.FC<SongPlayerProps> = ({
  song,
  css = {},
  ...props
}) => {
  return (
    <Flex css={{ ...css }} {...props}>
      todo
    </Flex>
  );
};
