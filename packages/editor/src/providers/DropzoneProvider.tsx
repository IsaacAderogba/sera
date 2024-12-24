import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
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
import { actions, dispatch, useSelector } from "./StoreContext";
import {
  isEditorTimelineTrackDroppable,
  isEditorTimelineTrackSortable
} from "../patterns/Editor/hooks";
import {
  TIMELINE_STEP_SIZE,
  TIMELINE_STEP_SIZE_WIDTH
} from "../utilities/constants";

export const DropzoneProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const composition = useSelector(state => state.editor.composition);
  const timeline = useSelector(state => state.timeline);
  const stepSizeInSeconds = TIMELINE_STEP_SIZE * timeline.scale;

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

        if (
          droppable.type === "track" &&
          isEditorTimelineTrackSortable(droppable.data, draggable)
        ) {
          const drag = draggable[0];

          if (drag.data.id !== droppable.data.id) {
            const ids = [...composition.orderedTrackIds];
            const oldIndex = ids.findIndex(id => id === drag.data.id);
            const newIndex = ids.findIndex(id => id === droppable.data.id);
            if (oldIndex >= 0 && newIndex >= 0) {
              dispatch(
                actions.editor.commit({
                  type: "order-track-ids",
                  payload: { data: arrayMove(ids, oldIndex, newIndex) }
                })
              );
            }
          }

          dispatch(actions.timeline.setState({ draggableData: [] }));
        } else if (
          droppable.type === "track" &&
          isEditorTimelineTrackDroppable(droppable.data, draggable)
        ) {
          const deltaX = e.delta.x;
          const step = deltaX / TIMELINE_STEP_SIZE_WIDTH;
          const xSeconds = Math.round(step * stepSizeInSeconds * 100) / 100;

          type TrackItemRanges = Record<string, { from: number; to: number }>;
          const trackItemNewRanges: TrackItemRanges = {};
          for (const { data } of draggable) {
            const from = Math.max(0, data.from + xSeconds);
            trackItemNewRanges[data.id] = { from, to: from + data.duration };
          }

          const trackItemOldRanges: TrackItemRanges = {};

          for (const id in composition.trackItems) {
            const trackItem = composition.trackItems[id];
            // don't factor candidate track items into ranges calculation.
            if (trackItemNewRanges[id] !== undefined) continue;

            // don't factor in items that are in a different track
            if (trackItem.trackId !== droppable.data.id) continue;

            const { from, duration } = trackItem;
            trackItemOldRanges[id] = { from, to: from + duration };
          }

          let violatesExistingRange = false;
          for (const newId in trackItemNewRanges) {
            const newRange = trackItemNewRanges[newId];

            for (const oldId in trackItemOldRanges) {
              const oldRange = trackItemOldRanges[oldId];
              if (newRange.from < oldRange.to && newRange.to > oldRange.from) {
                violatesExistingRange = true;
                break;
              }
            }
          }

          if (!violatesExistingRange) {
            for (const id in trackItemNewRanges) {
              const { from } = trackItemNewRanges[id];

              dispatch(
                actions.editor.commit({
                  type: "update-track-item",
                  payload: { id, data: { from, trackId: droppable.data.id } }
                })
              );
            }
          }

          dispatch(actions.timeline.setState({ draggableData: [] }));
        } else {
          console.log("no drop");
          dispatch(actions.timeline.setState({ draggableData: [] }));
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
        <EditorTimelineTrack track={data.data} css={{ opacity: 0.5 }}>
          <EditorTimelineTrackItems track={data.data} />
        </EditorTimelineTrack>
      );
    }
    case "track-item": {
      return (
        <EditorTimelineTrackItem trackItem={data.data} css={{ opacity: 0.5 }} />
      );
    }
  }
};
