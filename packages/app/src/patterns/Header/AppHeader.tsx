import { Box } from "../../components/Box";
import { Flex } from "../../components/Flex";
import { ThemeSwitchButton } from "../Button/ThemeSwitchButton";

export const AppHeader: React.FC = () => {
  return (
    <Flex
      css={{
        padding: "$base $base $base 80px",
        justifyContent: "space-between"
      }}
    >
      <Box>direction controls</Box>
      <Flex>
        <ThemeSwitchButton />
      </Flex>
    </Flex>
  );
};
