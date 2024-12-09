import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Button, ButtonProps } from "../../components/Button";
import { useThemeContext } from "../../providers/ThemeContext";

export const ThemeSwitchButton: React.FC<ButtonProps> = props => {
  const { state, setThemePreference } = useThemeContext();

  return (
    <Button
      icon
      variant="soft"
      {...props}
      onClick={() => {
        setThemePreference(state.mode === "dark" ? "light" : "dark", {
          persist: true
        });
      }}
    >
      {state.mode === "light" ? (
        <MoonIcon width={20} />
      ) : (
        <SunIcon width={20} />
      )}
    </Button>
  );
};
