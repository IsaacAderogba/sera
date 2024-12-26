import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { SequenceItem } from "./SequenceItem";
import { orderTrackItemsByTrack } from "./utilities";
import { CompositionState } from "../../electron/preload/types";

export const DefaultComposition: React.FC<CompositionState> = state => {
  const orderedTracks = useMemo(
    () => orderTrackItemsByTrack(state, { order: "backward" }),
    [state]
  );

  return (
    <Fragment>
      {orderedTracks.map(({ trackId, trackItemIds }) => {
        return (
          <Fragment key={trackId}>
            {trackItemIds.map(id => {
              return <SequenceItem key={id} trackItem={state.trackItems[id]} />;
            })}
          </Fragment>
        );
      })}
    </Fragment>
  );
};
