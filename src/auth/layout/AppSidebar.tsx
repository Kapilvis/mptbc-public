import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useMenu } from "../../config/menu-routes";
import { useSidebar } from "../context/SidebarContext";
import "./AppSidebar.css";
import Scrollbar from "./Scrollbar";

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, toggleSidebar, closeMobileSidebar } =
    useSidebar();

  const location = useLocation();
  const menuItems = useMenu();

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [hoveredFlyoutKey, setHoveredFlyoutKey] = useState<string | null>(null);

  const isSidebarVisible = isExpanded || isMobileOpen;
  const isSidebarCollapsed = !isExpanded && !isMobileOpen;

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  );

  useEffect(() => {
    const newOpenSubmenus: Record<string, boolean> = {};

    const checkActive = (
      items: Menu.MenuItem[],
      parentKey?: string,
    ): boolean => {
      let isAnyChildActive = false;

      items.forEach((item, index) => {
        const key =
          parentKey !== undefined ? `${parentKey}-${index}` : `${index}`;

        if (item.children && item.children.length > 0) {
          if (checkActive(item.children, key)) {
            newOpenSubmenus[key] = true;
            isAnyChildActive = true;
          }
        } else if (item.path && isActive(item.path)) {
          isAnyChildActive = true;
        }
      });

      return isAnyChildActive;
    };

    checkActive(menuItems);
    setOpenSubmenus(newOpenSubmenus);
  }, [isActive, location, menuItems]);

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((previousState) => {
      if (previousState[key]) {
        const newState = { ...previousState };

        delete newState[key];

        Object.keys(newState).forEach((submenuKey) => {
          if (submenuKey.startsWith(`${key}-`)) {
            delete newState[submenuKey];
          }
        });

        return newState;
      }

      const newState: Record<string, boolean> = {};
      const keyParts = key.split("-");
      let currentPath = "";

      keyParts.forEach((part) => {
        currentPath = currentPath === "" ? part : `${currentPath}-${part}`;

        newState[currentPath] = true;
      });

      return newState;
    });
  };

  const handleSubmenuToggle = (key: string) => {
    if (!isExpanded) {
      toggleSidebar();

      window.setTimeout(() => {
        toggleSubmenu(key);
      }, 250);

      return;
    }

    toggleSubmenu(key);
  };

  const renderFlyoutItems = (
    items: Menu.MenuItem[] | undefined,
    parentKey: string,
    level = 0,
  ) => {
    if (!items?.length) {
      return null;
    }

    return (
      <ul
        className={`sidebar-flyout-list ${
          level > 0 ? "sidebar-flyout-list-nested" : ""
        }`}
      >
        {items.map((item, index) => {
          const key = `${parentKey}-${index}`;
          const hasChildren = Boolean(item.children?.length);
          const itemActive = item.path ? isActive(item.path) : false;

          return (
            <li
              key={key}
              className={`sidebar-flyout-item ${
                hasChildren ? "sidebar-flyout-item-parent" : ""
              }`}
            >
              {hasChildren ? (
                <>
                  <button
                    type="button"
                    className="sidebar-flyout-action"
                    aria-haspopup="menu"
                  >
                    <span>{item.label}</span>
                    <i className="pi pi-angle-right" aria-hidden="true" />
                  </button>

                  <div className="sidebar-flyout-submenu">
                    <div className="sidebar-flyout-submenu-title">
                      {item.label}
                    </div>

                    {renderFlyoutItems(item.children, key, level + 1)}
                  </div>
                </>
              ) : (
                item.path && (
                  <Link
                    to={item.path}
                    className={`sidebar-flyout-action ${
                      itemActive ? "sidebar-flyout-action-active" : ""
                    }`}
                    onClick={() => setHoveredFlyoutKey(null)}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderMenuItems = (
    items: Menu.MenuItem[] | undefined,
    level = 0,
    parentKey?: string,
  ) => {
    if (!items) {
      return null;
    }

    return (
      <ul
        className={`sidebar-menu-list ${
          level > 0 ? "sidebar-menu-list-nested" : "sidebar-menu-list-gap"
        }`}
      >
        {items.map((item, index) => {
          const key =
            parentKey !== undefined ? `${parentKey}-${index}` : `${index}`;

          const hasSubItems = Boolean(item.children?.length);

          const isItemActive = item.path ? isActive(item.path) : false;

          const isSubmenuOpen = Boolean(openSubmenus[key]);

          const isItemHighlighted = isItemActive || isSubmenuOpen;

          const isTopLevel = level === 0;
          const isMidLevel = level === 1;

          const baseItemClass = isTopLevel
            ? "menu-item group"
            : isMidLevel
              ? "menu-dropdown-item group"
              : "menu-leaf-item group";

          const activeStateClass = isTopLevel
            ? isItemHighlighted
              ? "menu-item-active"
              : "menu-item-inactive"
            : isMidLevel
              ? isItemHighlighted
                ? "menu-dropdown-item-active"
                : "menu-dropdown-item-inactive"
              : isItemActive
                ? "menu-leaf-item-active"
                : "menu-leaf-item-inactive";

          const collapsedClass = !isExpanded
            ? "sidebar-menu-item-collapsed"
            : "sidebar-menu-item-expanded";

          const iconlessClass = !item.icon
            ? isItemHighlighted
              ? "sidebar-iconless-item sidebar-iconless-item-active"
              : "sidebar-iconless-item sidebar-iconless-item-inactive"
            : "";
          const animationDelayClass =
            level >= 2 ? `sidebar-delay-${Math.min(index, 5)}` : "";
          const itemClassName = [
            baseItemClass,
            activeStateClass,
            collapsedClass,
            iconlessClass,
            animationDelayClass,
            "sidebar-menu-action",
          ]
            .filter(Boolean)
            .join(" ");

          const sectionElement =
            item.section && isSidebarVisible ? (
              <li className="sidebar-section-header">{t(item.section)}</li>
            ) : null;

          const iconElement = item.icon ? (
            <span
              className={`sidebar-menu-icon ${
                isItemHighlighted ? "menu-item-icon-active" : "menu-item-icon"
              } ${!isExpanded ? "sidebar-menu-icon-collapsed" : ""}`}
            >
              <i className={item.icon} aria-hidden="true" />
            </span>
          ) : (
            <span
              className={`sidebar-menu-dot ${
                isItemHighlighted
                  ? "sidebar-menu-dot-active"
                  : "sidebar-menu-dot-inactive"
              }`}
            />
          );

          const labelElement = isSidebarVisible ? (
            <span
              className={`sidebar-menu-label ${
                isItemHighlighted
                  ? "sidebar-menu-label-active"
                  : "sidebar-menu-label-inactive"
              }`}
            >
              {t(item.label)}
            </span>
          ) : null;

          const chevronElement =
            hasSubItems && isSidebarVisible ? (
              <i
                className={`pi pi-angle-right sidebar-menu-chevron ${
                  isSubmenuOpen
                    ? "sidebar-menu-chevron-open"
                    : "sidebar-menu-chevron-closed"
                }`}
                aria-hidden="true"
              />
            ) : null;

          const submenuElement =
            hasSubItems && isSidebarVisible ? (
              <div
                className={`sidebar-submenu ${
                  isSubmenuOpen
                    ? "sidebar-submenu-open"
                    : "sidebar-submenu-closed"
                }`}
              >
                <div className="sidebar-submenu-viewport">
                  <div className="sidebar-submenu-inner">
                    {renderMenuItems(item.children, level + 1, key)}
                  </div>
                </div>
              </div>
            ) : null;

          const flyoutElement =
            isSidebarCollapsed &&
            isTopLevel &&
            hasSubItems &&
            hoveredFlyoutKey === key ? (
              <div className="sidebar-flyout" role="menu">
                <div className="sidebar-flyout-title">{item.label}</div>
                {renderFlyoutItems(item.children, key)}
              </div>
            ) : null;

          const simpleFlyoutElement =
            isSidebarCollapsed &&
            isTopLevel &&
            !hasSubItems &&
            hoveredFlyoutKey === key ? (
              <div className="sidebar-flyout-label" role="tooltip">
                {item.label}
              </div>
            ) : null;

          return (
            <React.Fragment key={key}>
              {sectionElement}

              <li
                className="sidebar-menu-list-item"
                onMouseEnter={() => {
                  if (isSidebarCollapsed && isTopLevel) {
                    setHoveredFlyoutKey(key);
                  }
                }}
                onMouseLeave={() => {
                  if (isSidebarCollapsed && isTopLevel) {
                    setHoveredFlyoutKey(null);
                  }
                }}
              >
                {hasSubItems ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSubmenuToggle(key)}
                      className={itemClassName}
                      aria-expanded={isSubmenuOpen}
                      aria-label={!isSidebarVisible ? item.label : undefined}
                    >
                      {iconElement}
                      {labelElement}
                      {chevronElement}
                    </button>

                    {submenuElement}
                  </>
                ) : (
                  item.path && (
                    <Link
                      to={item.path}
                      className={itemClassName}
                      onClick={() => {
                        if (isMobileOpen) {
                          closeMobileSidebar();
                        }
                      }}
                    >
                      {iconElement}
                      {labelElement}
                    </Link>
                  )
                )}

                {flyoutElement}
                {simpleFlyoutElement}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`app-sidebar ${
        isSidebarCollapsed ? "app-sidebar-collapsed" : "app-sidebar-expanded"
      } ${
        isMobileOpen ? "app-sidebar-mobile-open" : "app-sidebar-mobile-closed"
      }`}
    >
      <div className="sidebar-logo-section h-18.5 min-h-18.5 max-h-18.5">
        <div className="sidebar-logo-content flex flex-col justify-center items-start">
          {isSidebarVisible ? (
            <>
              <div className="sidebar-logo-expanded">
                <img
                  src="/MP_LOGO.svg"
                  alt="Madhya Pradesh Textbook Corporation"
                  className="sidebar-logo-image-expanded"
                  onError={(event) => {
                    event.currentTarget.classList.add("hidden");
                  }}
                />

                <span className="sidebar-logo-title">
                  Madhya Pradesh Textbook Corporation
                </span>
              </div>
            </>
          ) : (
            <div className="sidebar-logo-collapsed">
              <img
                src="/MP_LOGO.svg"
                alt="Madhya Pradesh Textbook Corporation"
                className="sidebar-logo-image-collapsed"
                onError={(event) => {
                  event.currentTarget.classList.add("hidden");
                }}
              />
            </div>
          )}
          {isMobileOpen && (
            <button
              type="button"
              className="sidebar-mobile-close"
              onClick={closeMobileSidebar}
              aria-label="Close sidebar"
            >
              <i className="pi pi-arrow-left" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-nav-area">
        <Scrollbar height="100%" isCollapsed={isSidebarCollapsed}>
          <div className="sidebar-nav-inner">
            <nav className="sidebar-navigation">
              {renderMenuItems(menuItems)}
            </nav>
          </div>
        </Scrollbar>
      </div>

      {/* <div className="sidebar-decoration">
        <img
          src={`${import.meta.env.BASE_URL}sidebar-wbg.png`}
          alt=""
          className="sidebar-decoration-image"
          onError={(event) => {
            event.currentTarget.classList.add("hidden");
          }}
        />
      </div> */}
    </aside>
  );
};

export default AppSidebar;
