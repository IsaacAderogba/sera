import { useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Flex } from "../components/Flex";
import { Logo } from "../components/Logo";
import { Text, Title } from "../components/Typography";
import { client } from "../utilities/client";
import { createRoutePath } from "../utilities/route";
import { useRouteParams } from "../components/Route";

export const BrowseView: React.FC = () => {
  const { profileId } = useRouteParams(["/profiles/:profileId"]);
  const history = useHistory();

  return (
    <Flex css={{ height: "100%", width: "100%", flexDirection: "column" }}>
      <Flex
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
        <Card
          css={{ display: "flex", flexDirection: "column", padding: "$lg" }}
        >
          <Flex
            css={{ flexDirection: "column", gap: "$xs", alignItems: "center" }}
          >
            <Title variant="h4">Get started</Title>
            <Text size="compact" secondary>
              Create a playlist to start generating music
            </Text>
          </Flex>
          <Button
            variant="solid"
            onClick={async () => {
              const { id } = await client.adapters.playlists.create({
                profileId,
                data: { title: "" }
              });

              const path = createRoutePath({
                path: "/profiles/:profileId/playlists/:playlistId",
                params: { profileId, playlistId: id }
              });
              history.push(path);
            }}
          >
            Create playlist
          </Button>
        </Card>
        <Text size="compact" secondary>
          Made with love by{" "}
          <a href="https://x.com/IsaacAderogba" target="_blank">
            Isaac Aderogba
          </a>
          .
        </Text>
      </Flex>
    </Flex>
  );
};
