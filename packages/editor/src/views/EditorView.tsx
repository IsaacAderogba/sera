import { Flex } from "../components/Flex";
import { Scene } from "../patterns/Scene";
import { Timeline } from "../patterns/Timeline";

export const EditorView: React.FC = () => {
  return (
    <Flex
      className="drag"
      css={{
        height: "100%",
        flexDirection: "column",
        background: "$background"
      }}
    >
      <Scene />
      <Timeline />
    </Flex>
  );
};
