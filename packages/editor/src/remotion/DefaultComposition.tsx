import { Fragment } from "react/jsx-runtime";
import { CompositionState } from "./types";
import {
  AudioSequenceItem,
  TextSequenceItem,
  VideoSequenceItem
} from "./SequenceItem";
import { useMemo } from "react";
import { orderTrackItemsByTrack } from "./utilities";

export const DefaultComposition: React.FC<CompositionState> = state => {
  const orderedTracks = useMemo(() => orderTrackItemsByTrack(state), [state]);

  return (
    <Fragment>
      {orderedTracks.map(({ trackId, trackItemIds }) => {
        return (
          <Fragment key={trackId}>
            {trackItemIds.map(id => {
              const trackItem = state.trackItems[id];
              switch (trackItem.type) {
                case "audio":
                  return <AudioSequenceItem key={id} trackItem={trackItem} />;
                case "text":
                  return <TextSequenceItem key={id} trackItem={trackItem} />;
                case "video":
                  return <VideoSequenceItem key={id} trackItem={trackItem} />;
              }
            })}
          </Fragment>
        );
      })}
    </Fragment>
  );
};
