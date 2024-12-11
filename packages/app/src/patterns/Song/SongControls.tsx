import { Flex, FlexProps } from "../../components/Flex";
import { Text } from "../../components/Typography";
import { Song } from "../../preload/types";

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
      <Text size="compact" secondary>
        {song.data.title || "Untitled"}
      </Text>
      <Flex>Controls</Flex>
    </Flex>
  );
};
