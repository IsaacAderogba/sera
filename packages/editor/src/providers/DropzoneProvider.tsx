import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PropsWithChildren } from "react";
import { useDropzoneDragData } from "../patterns/Dropzone/hooks";
import { DropzoneDragData } from "../patterns/Dropzone/types";
import {
  EditorTimelineTrack,
  EditorTimelineTrackItems
} from "../patterns/Editor/EditorTimelineTrack";
import { EditorTimelineTrackItem } from "../patterns/Editor/EditorTimelineTrackItem";

export const DropzoneProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const data = useDropzoneDragData();
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 16
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: [], cancel: ["Escape"], end: [] }
    })
  );

  return (
    <DndContext
      // Todo: https://github.com/clauderic/dnd-kit/pull/140
      // autoScroll={false}
      collisionDetection={pointerWithin}
      sensors={sensors}
      onDragStart={() => {
        console.log("on drag start");
      }}
      onDragCancel={() => {
        console.log("on drag cancel");
      }}
      onDragEnd={() => {}}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {data.map(entry => {
          return <DropzoneDragDataPreview key={entry.data.id} data={entry} />;
        })}
      </DragOverlay>
    </DndContext>
  );
};

const DropzoneDragDataPreview: React.FC<{ data: DropzoneDragData }> = ({
  data
}) => {
  switch (data.type) {
    case "track": {
      return (
        <EditorTimelineTrack track={data.data}>
          <EditorTimelineTrackItems track={data.data} />
        </EditorTimelineTrack>
      );
    }
    case "track-item": {
      const { size } = data;
      return (
        <EditorTimelineTrackItem
          trackItem={data.data}
          css={{ width: size.width, height: size.height }}
        />
      );
    }
  }
};
