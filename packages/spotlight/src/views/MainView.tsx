import { Flex } from "../components/Flex";

export const MainView: React.FC = () => {
  return (
    <Flex
      className="drag"
      css={{
        background: "$translucent",
        height: "100%",
        flexDirection: "column",
        overflow: "auto"
      }}
    >
      <div>editor</div>
      <div>command portal</div>
      <div>context lip</div>
    </Flex>
  );
};
