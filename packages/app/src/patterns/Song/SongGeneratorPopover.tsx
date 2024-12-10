import React from "react";
import { Button } from "../../components/Button";
import { Form, FormInput } from "../../components/Form";
import { Popover } from "../../components/Popover";
import { Song } from "../../preload/ipc";
import { client } from "../../utilities/client";

export interface SongGeneratorPopoverProps {
  song: Song;
}

export const SongGeneratorPopover: React.FC<SongGeneratorPopoverProps> = ({
  song
}) => {
  return (
    <Popover
      placement="top"
      content={
        <Form
          key={song.id}
          size="compact"
          initialValues={{
            title: song.data.title,
            description: song.data.description
          }}
          onSubmit={async (_e, { title, description }) => {
            await client.adapters.songs.update(song.id, {
              profileId: song.profileId,
              data: { title, description }
            });
          }}
        >
          <FormInput
            label="Title"
            name="title"
            validation={{
              string: { label: "Title", required: true, min: 1 }
            }}
          />
          <FormInput
            label="Description"
            name="description"
            validation={{
              string: { label: "Description", required: true, min: 1 }
            }}
          />
          <Button variant="solid" css={{ marginTop: "$xs" }}>
            Generate song
          </Button>
        </Form>
      }
    >
      <Button>Generate</Button>
    </Popover>
  );
};
