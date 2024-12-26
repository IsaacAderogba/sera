import { IconButton } from "@radix-ui/themes";
import { useThemeContext } from "../../providers/ThemeContext";
import { SunIcon } from "@heroicons/react/24/outline";

export const EditorThemeButton: React.FC = () => {
  const { state: themeState, setThemePreference } = useThemeContext();

  return (
    <IconButton
      size="2"
      variant="ghost"
      style={{ margin: 0 }}
      onClick={() => {
        setThemePreference(themeState.mode === "dark" ? "light" : "dark");
      }}
    >
      <SunIcon width={16} />
    </IconButton>
  );
};
