import { useThemeContext } from "../providers/ThemeProvider";

export const AuthView: React.FC = () => {
  const { state, setThemePreference } = useThemeContext();
  return (
    <button
      onClick={() => {
        setThemePreference(state.mode === "dark" ? "light" : "dark", {
          persist: true
        });
      }}
    >
      {state.mode}
    </button>
  );
};
