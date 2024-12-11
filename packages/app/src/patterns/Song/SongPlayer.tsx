import { Flex, FlexProps } from "../../components/Flex";
import { Song } from "../../preload/types";
import { SongControls } from "./SongControls";
import { SongDropdown } from "./SongDropdown";
import { SongGeneratorPopover } from "./SongGeneratorPopover";

export interface SongPlayerProps extends FlexProps {
  song: Song;
}

export const SongPlayer: React.FC<SongPlayerProps> = ({
  song,
  css = {},
  ...props
}) => {
  return (
    <Flex
      css={{
        ...css,
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        padding: "$base"
      }}
      {...props}
    >
      <Flex css={{ alignItems: "center", flex: 1 }}>
        <SongGeneratorPopover song={song} />
      </Flex>
      <Flex css={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <SongControls song={song} />
      </Flex>
      <Flex css={{ flex: 1, justifyContent: "flex-end" }}>
        <SongDropdown song={song} />
      </Flex>
    </Flex>
  );
};
