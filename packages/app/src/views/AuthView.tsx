import { Flex } from "../components/Flex";
import { Logo } from "../components/Logo";

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
        gap: "$lg",
        p: "$md",
        overflow: "auto",
        "-webkit-app-region": "drag"
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
          border: "1px solid $border",
          "-webkit-app-region": "no-drag"
        }}
      >
        <div>welcome back heading</div>
        <div>auth form</div>
      </Flex>
      <div>Don't have a token? Create one here link.</div>
    </Flex>
  );
};
