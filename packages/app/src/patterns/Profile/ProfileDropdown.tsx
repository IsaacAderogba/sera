import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { Profile } from "../../preload/ipc";

export interface ProfileDropdownProps {
  profile: Profile;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  return (
    <Dropdown
      triggerCSS={{ border: "1px solid transparent", position: "relative" }}
      defaultValue="2"
      options={[
        { type: "item", value: "1", label: "Item 1" },
        { type: "item", value: "2", label: "Item 2" }
      ]}
    >
      <Button icon>U</Button>
    </Dropdown>
  );
};
