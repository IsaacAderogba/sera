import { Flex } from "../../components/Flex";
import { Progress } from "../../components/Progress";
import { Text } from "../../components/Typography";
import { Song } from "../../preload/types";
import { formatSeconds } from "../../utilities/lodash";

export interface SongProgressProps {
  song: Song;
  time: number;
}

export const SongProgress: React.FC<SongProgressProps> = ({ song, time }) => {
  const end = song.data.audioMetadata?.durationSeconds || 0;
  const current = end > 0 ? Math.round((time / end) * 100) : 0;

  return (
    <Flex
      css={{
        gap: "$sm",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Text size="compact" secondary>
        {formatSeconds(Math.min(time, end))}
      </Text>
      <Progress value={current} max="100" />
      <Text size="compact" secondary>
        {formatSeconds(end)}
      </Text>
    </Flex>
  );
};
