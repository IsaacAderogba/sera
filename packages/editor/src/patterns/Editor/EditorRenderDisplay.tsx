import { Progress } from "@radix-ui/themes";
import { useSelector } from "../../providers/StoreContext";

export const EditorRenderDisplay: React.FC = () => {
  const { progress } = useSelector(state => state.timeline.renderProgress);

  return (
    <Progress
      color="blue"
      variant="surface"
      radius="full"
      value={Math.round(Math.round(progress * 100))}
    />
  );
};
