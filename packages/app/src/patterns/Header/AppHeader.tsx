import { Box } from "../../components/Box";
import { Flex } from "../../components/Flex";
import { Profile } from "../../preload/ipc";
import { ThemeSwitchButton } from "../Button/ThemeSwitchButton";
import { ProfileDropdown } from "../Profile/ProfileDropdown";

export interface AppHeaderProps {
  profile?: Profile;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ profile }) => {
  return (
    <Flex
      css={{
        height: 48,
        padding: "0 $base 0 72px",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid red"
      }}
    >
      <Box>Todo</Box>

      <Flex css={{ alignItems: "center", gap: "$sm" }}>
        <ThemeSwitchButton />
        {profile && <ProfileDropdown profile={profile} />}
      </Flex>
    </Flex>
  );
};
