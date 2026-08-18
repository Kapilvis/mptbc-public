import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMenuConfig } from "../../config/menu-routes";
import { ROLE_PERMISSIONS } from "../rolePermissions";
import { useAuth } from "../AuthProvider";

// Flatten menu to a list of route definitions
function flattenMenu(items: Menu.MenuItem[]): Menu.MenuItem[] {
  let flat: Menu.MenuItem[] = [];
  for (const item of items) {
    if (item.path) {
      flat.push(item);
    }
    if (item.children) {
      flat = flat.concat(flattenMenu(item.children));
    }
  }
  return flat;
}

export function RouteGuard() {
  const { authenticated, user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get full unfiltered menu list to verify permissions
  const fullMenu = getMenuConfig(t);
  const flatFullMenu = flattenMenu(fullMenu);

  // Find the most specific menu item matching the current path
  const matchingItem = flatFullMenu
    .filter((item) => item.path && item.path !== "/" && item.path !== "")
    .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))
    .find((item) => {
      const p = item.path!;
      return location.pathname === p || location.pathname.startsWith(p + "/");
    });

  if (matchingItem && matchingItem.permissionKey) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNormalizedRole = (u: any): string => {
      if (!u) return "";
      const r =
        u.role ||
        (Array.isArray(u.profile?.role)
          ? u.profile.role[0]
          : u.profile?.role) ||
        "";
      return r.toUpperCase();
    };
    const role = getNormalizedRole(user);
    const allowedPermissions = ROLE_PERMISSIONS[role] || [];
    const isAllowed = allowedPermissions.includes(matchingItem.permissionKey);

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
