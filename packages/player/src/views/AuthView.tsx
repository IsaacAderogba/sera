import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Flex } from "../components/Flex";
import { Form, FormInput } from "../components/Form";
import { Text, Title } from "../components/Typography";
import { SoundWaveLogo } from "../patterns/Logo/SoundWaveLogo";
import { client } from "../utilities/client";

export const AuthView: React.FC = () => {
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
        <SoundWaveLogo />
        <Card
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "$lg",
            gap: "$lg"
          }}
        >
          <Flex
            css={{ flexDirection: "column", gap: "$xs", alignItems: "center" }}
          >
            <Title variant="h4">Welcome back</Title>
            <Text size="compact" secondary>
              Please enter your token to get started.
            </Text>
          </Flex>
          <Flex css={{ flexDirection: "column", gap: "$sm", width: "100%" }}>
            <Form
              size="default"
              initialValues={{ token: "" }}
              onSubmit={async (_e, { token }) => {
                await client.adapters.profiles.create({ token, data: {} });
              }}
            >
              <FormInput
                label="Token"
                name="token"
                validation={{
                  string: { label: "Token", required: true, min: 1 }
                }}
              />
              <Button variant="solid" css={{ marginTop: "$xs" }}>
                Log in
              </Button>
            </Form>
          </Flex>
        </Card>
        <Text size="compact" secondary>
          Don't have a token? Create one{" "}
          <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank">
            here
          </a>
          .
        </Text>
      </Flex>
    </Flex>
  );
};
