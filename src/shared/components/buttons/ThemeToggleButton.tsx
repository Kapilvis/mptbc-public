import { useTheme } from "../../../auth/context/ThemeContext";
import "./ThemeToggleButton.css";

export const ThemeToggleButton: React.FC = () => {
  const { openThemeDrawer } = useTheme();

  return (
    <button
      type="button"
      onClick={openThemeDrawer}
      className="theme-toggle-btn"
      title="Theme Customization (थीम कस्टमाइज़ेशन)"
      aria-label="Open Theme Customization"
    >
      <i className="pi pi-palette text-lg" aria-hidden="true" />
    </button>
  );
};
