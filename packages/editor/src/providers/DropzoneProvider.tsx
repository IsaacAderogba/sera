import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PropsWithChildren } from "react";

export const DropzoneProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
    </DndContext>
  );
};
