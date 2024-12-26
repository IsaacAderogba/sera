import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { v4 } from "uuid";
import { Track } from "../../../electron/preload/types";
import { Flex } from "../../components/Flex";
import { actions, dispatch } from "../../providers/StoreContext";

export const EditorTrackButtons: React.FC = () => {
  const [importing, setImporting] = useState({ video: false, audio: false });

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
        loading={importing.video}
        variant="surface"
        onClick={async () => {
          try {
            setImporting(state => ({ ...state, video: true }));
            const videoTrack = createTrack("video");
            const videoTrackItem = await window.ipc.invoke(
              "importTrackItem",
              "mp4"
            );

            if (videoTrackItem) {
              dispatch(
                actions.editor.commit({
                  type: "create-track",
                  payload: {
                    data: videoTrack,
                    items: [{ ...videoTrackItem, trackId: videoTrack.id }]
                  }
                })
              );
            }
          } finally {
            setImporting(state => ({ ...state, video: false }));
          }
        }}
      >
        <PlusIcon width={16} />
        Video
      </Button>
      <Button
        loading={importing.audio}
        variant="surface"
        onClick={async () => {
          try {
            setImporting(state => ({ ...state, audio: true }));
            const audioTrack = createTrack("audio");
            const audioTrackItem = await window.ipc.invoke(
              "importTrackItem",
              "mp3"
            );
            if (!audioTrackItem) return;

            if (audioTrackItem) {
              dispatch(
                actions.editor.commit({
                  type: "create-track",
                  payload: {
                    data: audioTrack,
                    items: [{ ...audioTrackItem, trackId: audioTrack.id }]
                  }
                })
              );
            }
          } finally {
            setImporting(state => ({ ...state, audio: false }));
          }
        }}
      >
        <PlusIcon width={16} />
        Audio
      </Button>
    </Flex>
  );
};

function createTrack<T extends Track>(type: T["type"]): Track {
  const date = new Date().toISOString();
  return { id: v4(), type, createdAt: date, updatedAt: date };
}
