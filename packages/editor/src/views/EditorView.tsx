import { Flex } from "../components/Flex";
import { Scene } from "../patterns/Scene";
import { Timeline } from "../patterns/Timeline";

export const EditorView: React.FC = () => {
  return (
    <Flex css={{ flexDirection: "column" }}>
      <Scene />
      <Timeline />
    </Flex>
  );
};
