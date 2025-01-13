import { Flex } from "../../components/Flex";

export interface CommandLedgeProps {}

export const CommandLedge: React.FC = () => {
  return (
    <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
      <div>context</div>
      <div>command+k</div>
    </Flex>
  );
};
