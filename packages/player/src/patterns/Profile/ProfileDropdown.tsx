import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { Profile } from "../../preload/types";
import { useThemeContext } from "../../providers/ThemeContext";

export interface ProfileDropdownProps {
  profile: Profile;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  const { state, setThemePreference } = useThemeContext();

  return (
    <Dropdown
      triggerProps={{
        css: { border: "1px solid transparent", position: "relative" }
      }}
      defaultValue="2"
      onValueChange={(value: string) => {
        switch (value) {
          case "theme": {
            setThemePreference(state.mode === "dark" ? "light" : "dark", {
              persist: true
            });
            break;
          }
        }
      }}
      options={[{ type: "item", value: "theme", label: "Toggle theme" }]}
    >
      <Button icon tabIndex={-1}>
        U
      </Button>
    </Dropdown>
  );
};
