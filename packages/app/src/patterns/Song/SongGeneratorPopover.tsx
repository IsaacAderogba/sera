import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Form, FormInput } from "../../components/Form";
import { Popover } from "../../components/Popover";
import { Song } from "../../preload/types";
import { client } from "../../utilities/client";

export interface SongGeneratorPopoverProps {
  song: Song;
}

export const SongGeneratorPopover: React.FC<SongGeneratorPopoverProps> = ({
  song
}) => {
  const [state, setState] = useState({ loading: false });
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
            setState({ loading: true });
            try {
              const updatedSong = await client.adapters.songs.update(song.id, {
                profileId: song.profileId,
                data: { title, description }
              });

              await client.invoke("generateBackgroundMusic", updatedSong);
            } finally {
              setState({ loading: false });
            }
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
            label="Prompt"
            name="description"
            validation={{
              string: { label: "Description", required: true, min: 1 }
            }}
          />
          <Button
            disabled={state.loading}
            variant="solid"
            css={{ marginTop: "$xs" }}
          >
            {state.loading ? "Generating..." : "Generate song"}
          </Button>
        </Form>
      }
    >
      <Button>Generate</Button>
    </Popover>
  );
};
