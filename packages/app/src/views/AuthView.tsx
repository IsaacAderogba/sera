import { Flex } from "../components/Flex";
import { Logo } from "../components/Logo";
import { Text, Title } from "../components/Typography";

export const AuthView: React.FC = () => {
  return (
    <Flex
      css={{
        background: "$translucent",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        justify: "center",
        align: "center",
        p: "$md",
        overflow: "auto",
        "-webkit-app-region": "drag"
      }}
    >
      <Flex
        css={{
          flexDirection: "column",
          alignItems: "center",
          gap: "$lg",
          "-webkit-app-region": "no-drag"
        }}
      >
        <Logo />
        <Flex
          css={{
            background: "$surface",
            borderRadius: "$base",
            padding: "$lg",
            maxWidth: "420px",
            width: "100%",
            gap: "$lg",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid $border"
          }}
        >
          <Title>welcome back heading</Title>
          <Text>auth form</Text>
        </Flex>
        <Text size="compact" secondary>
          Don't have a token? Create one <a href="#">link</a>.
        </Text>
      </Flex>
    </Flex>
  );
};
