import React, { useEffect } from "react";
import {
  COLOR_THEMES,
  useTheme,
  type ColorTheme,
} from "../../../auth/context/ThemeContext";
import "./ThemeCustomizationDrawer.css";

export const ThemeCustomizationDrawer: React.FC = () => {
  const { colorTheme, setColorTheme, isThemeDrawerOpen, closeThemeDrawer } =
    useTheme();

  // Close drawer on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isThemeDrawerOpen) {
        closeThemeDrawer();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isThemeDrawerOpen, closeThemeDrawer]);

  if (!isThemeDrawerOpen) return null;

  return (
    <div className="theme-drawer-portal">
      {/* Backdrop overlay */}
      <div
        className="theme-drawer-backdrop"
        onClick={closeThemeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        className="theme-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Theme Customization"
      >
        {/* Header */}
        <div className="theme-drawer-header">
          <div className="theme-drawer-header-title">
            <i
              className="pi pi-palette text-xl text-[var(--primary-color)]"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Theme Customization
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="theme-drawer-close-btn"
            onClick={closeThemeDrawer}
            aria-label="Close theme customization"
          >
            <i className="pi pi-times" aria-hidden="true" />
          </button>
        </div>

        {/* Body content */}
        <div className="theme-drawer-body">
          {/* Section Label */}
          <div className="theme-drawer-section">
            <h3 className="theme-drawer-section-title">PRIMARY COLOR</h3>

            {/* Grid of swatches matching standard layout */}
            <div className="theme-swatch-grid">
              {COLOR_THEMES.map((t) => {
                const isSelected = colorTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`theme-swatch-card ${isSelected ? "theme-swatch-card-active" : ""}`}
                    onClick={() => setColorTheme(t.id as ColorTheme)}
                  >
                    {/* Color Preview Block */}
                    <div
                      className="theme-swatch-preview"
                      style={{ background: t.gradient }}
                    >
                      {isSelected && (
                        <div className="theme-swatch-check">
                          <i className="pi pi-check" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    {/* Color Info */}
                    <div className="theme-swatch-info">
                      <span className="theme-swatch-name-en">{t.nameEn}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="theme-drawer-footer">
          <i className="pi pi-info-circle mr-1.5" aria-hidden="true" />
          Selected theme applies component-wide across all views
        </div>
      </aside>
    </div>
  );
};

export default ThemeCustomizationDrawer;
