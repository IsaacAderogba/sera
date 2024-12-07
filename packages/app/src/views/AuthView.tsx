import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { Flex } from "../components/Flex";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
import { Tooltip } from "../components/Tooltip";
import { Text, Title } from "../components/Typography";
import { useThemeContext } from "../providers/ThemeContext";

export const AuthView: React.FC = () => {
  const { state, setThemePreference } = useThemeContext();
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
          <Tooltip content="Tooltip content" placement="top">
            <Title>welcome back heading</Title>
          </Tooltip>
          {/* <Text>auth form</Text> */}
          <Flex css={{ flexDirection: "column", gap: "$sm", width: "100%" }}>
            {/* <Form
              size="default"
              initialValues={{ foo: "bar" }}
              onSubmit={(e, values) => {}}
            >
              todo
            </Form> */}

            <Input placeholder="Email" />
            <Checkbox size="default">
              <Text>hello</Text>
            </Checkbox>

            <Button variant="solid">Solid button</Button>

            <Button variant="soft">Soft button</Button>

            <Button variant="outline">Outline button</Button>

            <Button variant="ghost">Ghost button</Button>
          </Flex>
        </Flex>
        <Text size="compact" secondary>
          Don't have a token? Create one <a href="#">link</a>.
        </Text>
        <Button
          onClick={() => {
            setThemePreference(state.mode === "dark" ? "light" : "dark", {
              persist: true
            });
          }}
        >
          Toggle Theme
        </Button>
      </Flex>
    </Flex>
  );
};
