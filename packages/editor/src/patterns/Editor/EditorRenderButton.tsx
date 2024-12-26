import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { actions, dispatch, useSelector } from "../../providers/StoreContext";
import { calculateMetadata } from "../../remotion/utilities";

export const EditorRenderButton: React.FC = () => {
  const [rendering, setRendering] = useState(false);
  const composition = useSelector(state => state.editor.composition);
  const metadata = useMemo(() => calculateMetadata(composition), [composition]);

  useEffect(() => {
    const unsubscribe = window.ipc.subscribe("renderChange", (_, progress) => {
      dispatch(actions.timeline.setState({ renderProgress: progress }));
    });

    return unsubscribe;
  }, []);

  return (
    <IconButton
      loading={rendering}
      disabled={metadata.durationInFrames <= 0}
      variant="ghost"
      style={{ margin: 0 }}
      onClick={async () => {
        try {
          setRendering(true);
          await window.ipc.invoke("render", composition);
        } catch (err) {
          console.error(err);
        } finally {
          setRendering(false);
          dispatch(
            actions.timeline.setState({
              renderProgress: {
                renderedFrames: 0,
                encodedFrames: 0,
                encodedDoneIn: null,
                renderedDoneIn: null,
                renderEstimatedTime: 0,
                progress: 0,
                stitchStage: "encoding"
              }
            })
          );
        }
      }}
    >
      <ArrowRightEndOnRectangleIcon width={16} />
    </IconButton>
  );
};
