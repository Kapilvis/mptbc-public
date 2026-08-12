import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useMenu } from "../../config/menu-routes";
import "./Breadcrumbs.css";

const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const menuItems = useMenu();

  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs: { label: string; path: string }[] = [];

    crumbs.push({ label: t("Home", "Home"), path: "/home" });

    const findLabel = (
      items: Menu.MenuItem[],
      targetPath: string,
    ): string | null => {
      for (const item of items) {
        if (item.path === targetPath) return item.label;
        if (item.children) {
          const found = findLabel(item.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    let accumulatedPath = "";
    pathnames.forEach((value) => {
      accumulatedPath += `/${value}`;

      if (accumulatedPath === "/home") return;

      const label = findLabel(menuItems, accumulatedPath);
      if (label) {
        crumbs.push({ label, path: accumulatedPath });
      } else {
        // If not found in menu, capitalize the segment
        const fallbackLabel =
          value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
        crumbs.push({ label: fallbackLabel, path: accumulatedPath });
      }
    });

    return crumbs;
  }, [location.pathname, menuItems]);

  return (
    <nav className="breadcrumb-nav">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="breadcrumb-active">
              {index === 0 ? (
                <i className="pi pi-home breadcrumb-home-icon" />
              ) : null}
              {index > 0 && t(crumb.label)}
            </span>
          ) : (
            <Link to={crumb.path} className="breadcrumb-link">
              {index === 0 ? (
                <i className="pi pi-home breadcrumb-home-icon" />
              ) : (
                t(crumb.label)
              )}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
