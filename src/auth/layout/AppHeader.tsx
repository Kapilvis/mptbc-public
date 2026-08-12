import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useMenu } from "../../config/menu-routes";
import { FullScreenToggleButton } from "../../shared/components/buttons/FullScreenToggleButton";
import { ThemeToggleButton } from "../../shared/components/buttons/ThemeToggleButton";
import { LanguageDropdown } from "../components/index";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../header/UserDropdown";
import "./AppHeader.css";
import Breadcrumbs from "./Breadcrumbs";

const AppHeader: React.FC = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const menuItems = useMenu();
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
      return;
    }

    toggleMobileSidebar();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const pageTitle = useMemo(() => {
    const findLabel = (
      items: Menu.MenuItem[],
      targetPath: string,
    ): string | null => {
      for (const item of items) {
        if (item.path === targetPath) {
          return item.label;
        }

        if (item.children) {
          const foundLabel = findLabel(item.children, targetPath);

          if (foundLabel) {
            return foundLabel;
          }
        }
      }

      return null;
    };

    const label = findLabel(menuItems, location.pathname);

    if (label) {
      if (location.pathname.includes("master")) {
        return `${t(label)} Configuration`;
      }

      return t(label);
    }

    const segments = location.pathname.split("/").filter(Boolean);

    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) {
      return t("Dashboard", "Dashboard");
    }

    const formattedSegment =
      lastSegment.charAt(0).toUpperCase() +
      lastSegment.slice(1).replace(/-/g, " ");

    return t(formattedSegment, formattedSegment);
  }, [location.pathname, menuItems, t]);

  return (
    <header className="app-header">
      <div className="app-header-container">
        <div className="app-header-left">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <span className="animated-hamburger" aria-hidden="true">
              <span className="hamburger-line hamburger-line-top" />
              <span className="hamburger-line hamburger-line-middle" />
              <span className="hamburger-line hamburger-line-bottom" />
            </span>
          </button>

          <div className="app-header-page-info">
            <h1 className="app-header-mobile-title">{pageTitle}</h1>

            <div className="app-header-breadcrumbs">
              <Breadcrumbs />
            </div>
          </div>
        </div>

        <div className="app-header-right">
          <div className="app-header-actions">
            <FullScreenToggleButton />
            <ThemeToggleButton />
            <LanguageDropdown />
          </div>

          <div className="app-header-divider" />

          <div
            className="app-header-user"
            onMouseDownCapture={() => {
              window.dispatchEvent(new Event("close-grid-overlay"));
            }}
          >
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
