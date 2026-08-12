import { useMenu } from "config/menu-routes";
import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";

/**
 * Custom hook to determine the page title based on the current route and menu configuration.
 * It traverses the authorized menu tree to find the matching menu item's label.
 *
 * @returns {string} The computed page title or an empty string if not found.
 */
export function usePageTitle(): string {
  const menuItems = useMenu();
  const { pathname } = useLocation();

  const title = useMemo(() => {
    const findTitle = (items: Menu.MenuItem[]): string | undefined => {
      for (const item of items) {
        // Prioritize checking children first for more specific matches (though in this app parents rarely have paths)
        if (item.children) {
          const childTitle = findTitle(item.children);
          if (childTitle) return childTitle;
        }

        if (item.path) {
          if (matchPath({ path: item.path, end: false }, pathname)) {
            return item.label;
          }
        }
      }
      return undefined;
    };

    return findTitle(menuItems);
  }, [menuItems, pathname]);

  return title || "";
}
