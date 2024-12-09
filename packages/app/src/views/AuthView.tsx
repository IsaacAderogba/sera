import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Form, FormCheckbox, FormInput, FormSelect } from "../components/Form";
import { Logo } from "../components/Logo";
import { Text, Title } from "../components/Typography";
import { useThemeContext } from "../providers/ThemeContext";

export const AuthView: React.FC = () => {
  const { state, setThemePreference } = useThemeContext();
  return (
    <Flex
      className="drag"
      css={{
        background: "$translucent",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        overflow: "auto"
      }}
    >
      <Flex
        className="no-drag"
        css={{
          margin: "auto",
          flexDirection: "column",
          alignItems: "center",
          gap: "$lg",
          maxWidth: "420px",
          width: "100%"
        }}
      >
        <Logo />
        <Flex
          css={{
            background: "$surface",
            borderRadius: "$base",
            padding: "$lg",
            width: "100%",
            gap: "$lg",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid $border"
          }}
        >
          <Title>welcome back heading</Title>
          <Flex css={{ flexDirection: "column", gap: "$sm", width: "100%" }}>
            <Form
              size="default"
              initialValues={{
                name: "",
                email: "",
                remember: false,
                select: "item"
              }}
              onSubmit={(_e, values) => {
                console.log("values", values);
              }}
            >
              <FormInput
                label="Name"
                name="name"
                validation={{
                  string: { label: "Name", required: true, min: 1 }
                }}
              />
              <FormInput
                label="Email"
                name="email"
                validation={{ email: { label: "Email", required: true } }}
              />
              <FormSelect
                label="Select"
                name="select"
                options={[
                  { type: "item", value: "item", label: "Item" },
                  { type: "divider", value: "divider" },
                  { type: "item", value: "item-1", label: "Item 2" }
                ]}
                validation={{
                  string: { label: "Select", required: true, min: 1 }
                }}
              />
              <FormCheckbox label="Remember me" name="remember" />

              <Button variant="solid" css={{ marginTop: "$sm" }}>
                Solid button
              </Button>
            </Form>
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
