"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type ColorTheme =
  | "emerald"
  | "navy"
  | "teal"
  | "violet"
  | "slate"
  | "burgundy"
  | "rust";

export interface ColorThemeOption {
  id: ColorTheme;
  nameEn: string;
  primaryColor: string;
  gradient: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: "emerald",
    nameEn: "Emerald (Default)",
    primaryColor: "#008a45",
    gradient: "linear-gradient(135deg, #008a45 0%, #006130 100%)",
  },
  {
    id: "navy",
    nameEn: "Navy",
    primaryColor: "#1e3a8a",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
  },
  {
    id: "teal",
    nameEn: "Teal",
    primaryColor: "#045e74",
    gradient: "linear-gradient(135deg, #045e74 0%, #023d4c 100%)",
  },
  {
    id: "violet",
    nameEn: "Soft Violet",
    primaryColor: "#4d4391",
    gradient: "linear-gradient(135deg, #4d4391 0%, #342c68 100%)",
  },
  {
    id: "slate",
    nameEn: "Slate",
    primaryColor: "#334155",
    gradient: "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
  },
  {
    id: "burgundy",
    nameEn: "Burgundy",
    primaryColor: "#881337",
    gradient: "linear-gradient(135deg, #881337 0%, #4c0519 100%)",
  },
  {
    id: "rust",
    nameEn: "Rust / Brown",
    primaryColor: "#854d0e",
    gradient: "linear-gradient(135deg, #854d0e 0%, #713f12 100%)",
  },
];

type ThemeContextType = {
  theme: ColorTheme;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  isThemeDrawerOpen: boolean;
  openThemeDrawer: () => void;
  closeThemeDrawer: () => void;
  toggleThemeDrawer: () => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("emerald");
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "mptbc_color_theme",
    ) as ColorTheme | null;
    const legacyTheme = localStorage.getItem("theme");

    let initialTheme: ColorTheme = "emerald";
    if (savedTheme && COLOR_THEMES.some((t) => t.id === savedTheme)) {
      initialTheme = savedTheme;
    } else if (legacyTheme === "dark") {
      initialTheme = "slate";
    }

    setColorThemeState(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("mptbc_color_theme", colorTheme);
      document.documentElement.setAttribute("data-theme", colorTheme);

      // Keep class names updated on root for styling compatibility
      COLOR_THEMES.forEach((t) => {
        document.documentElement.classList.remove(`theme-${t.id}`);
      });
      document.documentElement.classList.add(`theme-${colorTheme}`);
    }
  }, [colorTheme, isInitialized]);

  const setColorTheme = (newTheme: ColorTheme) => {
    setColorThemeState(newTheme);
  };

  const openThemeDrawer = () => setIsThemeDrawerOpen(true);
  const closeThemeDrawer = () => setIsThemeDrawerOpen(false);
  const toggleThemeDrawer = () => setIsThemeDrawerOpen((prev) => !prev);

  // Backward compatibility stub for toggleTheme (opens drawer)
  const toggleTheme = () => {
    openThemeDrawer();
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: colorTheme,
        colorTheme,
        setColorTheme,
        isThemeDrawerOpen,
        openThemeDrawer,
        closeThemeDrawer,
        toggleThemeDrawer,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
