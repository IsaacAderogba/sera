import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { Song } from "../../preload/types";

export interface SongDropdownProps {
  song: Song;
}

export const SongDropdown: React.FC<SongDropdownProps> = () => {
  return (
    <Dropdown
      placement="top"
      triggerProps={{
        css: { border: "1px solid transparent", position: "relative" }
      }}
      defaultValue="2"
      options={[
        { type: "item", value: "1", label: "Item 1" },
        { type: "item", value: "2", label: "Item 2" }
      ]}
    >
      <Button icon tabIndex={-1} variant="ghost">
        <EllipsisVerticalIcon width={20} />
      </Button>
    </Dropdown>
  );
};
