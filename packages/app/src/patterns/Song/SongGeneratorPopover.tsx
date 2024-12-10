import React from "react";
import { Song } from "../../preload/ipc";
import { Popover } from "../../components/Popover";
import { Button } from "../../components/Button";
import { Flex } from "../../components/Flex";

export interface SongGeneratorPopoverProps {
  song: Song;
}

export const SongGeneratorPopover: React.FC<SongGeneratorPopoverProps> = () => {
  return (
    <Popover placement="top" content={<Flex>Form</Flex>}>
      <Button>Generate</Button>
    </Popover>
  );
};
