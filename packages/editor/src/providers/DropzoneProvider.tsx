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
import { useDraggableData } from "../patterns/Dropzone/hooks";
import {
  DraggableData,
  DraggableEventData,
  DroppableEventData
} from "../patterns/Dropzone/types";
import { flattenDropzoneEventData } from "../patterns/Dropzone/utilities";
import {
  EditorTimelineTrack,
  EditorTimelineTrackItems
} from "../patterns/Editor/EditorTimelineTrack";
import { EditorTimelineTrackItem } from "../patterns/Editor/EditorTimelineTrackItem";
import { actions, dispatch } from "./StoreContext";

export const DropzoneProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const data = useDraggableData();
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
      onDragStart={e => {
        const draggableData = flattenDropzoneEventData(
          e.active.data.current as DraggableEventData
        );
        if (!draggableData.length) return;

        dispatch(actions.timeline.setState({ draggableData }));
      }}
      onDragCancel={() => {
        dispatch(actions.timeline.setState({ draggableData: [] }));
      }}
      onDragEnd={e => {
        const draggable = flattenDropzoneEventData(
          e.active.data.current as DraggableData
        );
        const droppable = e.over?.data.current as DroppableEventData;
        if (!draggable || !droppable || Array.isArray(droppable)) {
          dispatch(actions.timeline.setState({ draggableData: [] }));
          return;
        }
      }}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {data.map(entry => {
          return <DraggableDataPreview key={entry.data.id} data={entry} />;
        })}
      </DragOverlay>
    </DndContext>
  );
};

const DraggableDataPreview: React.FC<{ data: DraggableData }> = ({ data }) => {
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
