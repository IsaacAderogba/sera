import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@radix-ui/themes";
import { useRef } from "react";
import { v4 } from "uuid";
import { Track, TrackItem } from "../../../electron/preload/types";
import { Flex } from "../../components/Flex";
import { actions, dispatch } from "../../providers/StoreContext";

export const EditorTrackButtons: React.FC = () => {
  const uploadVideoRef = useRef<HTMLInputElement>(null);
  const uploadAudioRef = useRef<HTMLInputElement>(null);

  return (
    <Flex css={{ justifyContent: "center", gap: "$sm" }}>
      <Button
        variant="surface"
        onClick={() => {
          const date = new Date().toISOString();
          const textTrack = createTrack("text");
          dispatch(
            actions.editor.commit({
              type: "create-track",
              payload: {
                data: textTrack,
                items: [
                  {
                    id: v4(),
                    trackId: textTrack.id,
                    name: "Text Example",
                    type: "text",
                    from: 0,
                    duration: 5,
                    playbackRate: 1,
                    data: { text: "Hello World" },
                    createdAt: date,
                    updatedAt: date
                  }
                ]
              }
            })
          );
        }}
      >
        <PlusIcon width={16} />
        Text
      </Button>
      <Button
        variant="surface"
        onClick={() => {
          uploadVideoRef.current?.click();
        }}
      >
        <input
          accept=".mp4"
          ref={uploadVideoRef}
          type="file"
          style={{ display: "none" }}
          onChange={async e => {
            const videoTrack = createTrack("video");
            const videoTrackItem = await importTrackItem(e);
            if (!videoTrackItem) return;

            dispatch(
              actions.editor.commit({
                type: "create-track",
                payload: {
                  data: videoTrack,
                  items: [{ ...videoTrackItem, trackId: videoTrack.id }]
                }
              })
            );
          }}
        />
        <PlusIcon width={16} />
        Video
      </Button>
      <Button
        variant="surface"
        onClick={() => {
          uploadAudioRef.current?.click();
        }}
      >
        <input
          accept=".mp3"
          ref={uploadAudioRef}
          type="file"
          style={{ display: "none" }}
          onChange={async e => {
            const audioTrack = createTrack("audio");
            const audioTrackItem = await importTrackItem(e);
            if (!audioTrackItem) return;

            dispatch(
              actions.editor.commit({
                type: "create-track",
                payload: {
                  data: audioTrack,
                  items: [{ ...audioTrackItem, trackId: audioTrack.id }]
                }
              })
            );
          }}
        />
        <PlusIcon width={16} />
        Audio
      </Button>
    </Flex>
  );
};

async function importTrackItem(e: React.ChangeEvent<HTMLInputElement>) {
  const files = e.currentTarget.files;
  if (!files || files.length === 0) return;
  return await window.ipc.invoke("importTrackItem", files[0]);
}

function createTrack<T extends Track>(type: T["type"]): Track {
  const date = new Date().toISOString();
  return { id: v4(), type, createdAt: date, updatedAt: date };
}
