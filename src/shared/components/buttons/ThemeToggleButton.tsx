import { useTheme } from "../../../auth/context/ThemeContext";
import "./ThemeToggleButton.css";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      <i className={`pi ${theme === "dark" ? "pi-sun" : "pi-moon"} text-lg`} />
    </button>
  );
};
