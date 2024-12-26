import { Button } from "@radix-ui/themes";
import { Flex } from "../../components/Flex";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export const EditorTrackButtons: React.FC = () => {
  const uploadVideoRef = useRef<HTMLInputElement>(null);
  const uploadAudioRef = useRef<HTMLInputElement>(null);

  return (
    <Flex css={{ justifyContent: "center", gap: "$sm" }}>
      <Button variant="surface">
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
            const files = e.currentTarget.files;
            if (!files || files.length === 0) return;
            const file = files[0];

            // so need to parse the data at source
            console.log("file", file);
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
        />
        <PlusIcon width={16} />
        Audio
      </Button>
    </Flex>
  );
};
