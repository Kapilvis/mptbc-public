import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMenu } from "../../config/menu-routes";
import { hasPermission } from "../../shared/utils/permissionCheck";
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
  const { permissions, authenticated } = useAuth();
  const location = useLocation();
  const menu = useMenu();
  const flatMenu = flattenMenu(menu);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Find the most specific menu item matching the current path
  const matchingItem = [...flatMenu]
    .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))
    .find((item) => item.path && location.pathname.startsWith(item.path));

  if (matchingItem && matchingItem.feature && matchingItem.action) {
    const isAllowed = hasPermission(
      permissions,
      matchingItem.feature,
      matchingItem.action,
    );
    if (!isAllowed) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-red-500">
          <i className="pi pi-lock text-5xl mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4 max-w-md">
            You do not have the required permissions to access this page. Please
            contact your administrator if you believe this is an error.
          </p>
        </div>
      );
    }
  }

  return <Outlet />;
}
