import { Box } from "../components/Box";
import { Flex } from "../components/Flex";

export const ListView: React.FC = () => {
  return (
    <Flex
      css={{
        padding: "$base",
        width: "100%",
        gap: "$base"
      }}
    >
      <Box
        css={{
          boxShadow: "$sm",
          width: "100%",
          background: "$surface",
          padding: "$base",
          borderRadius: "$sm"
        }}
      >
        Playlist view
      </Box>
    </Flex>
  );
};
