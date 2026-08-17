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
  const matchingItem = [...flatFullMenu]
    .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))
    .find((item) => item.path && location.pathname.startsWith(item.path));

  if (matchingItem && matchingItem.permissionKey) {
    const role = user?.role || "";
    const allowedPermissions = ROLE_PERMISSIONS[role] || [];
    const isAllowed = allowedPermissions.includes(matchingItem.permissionKey);

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
