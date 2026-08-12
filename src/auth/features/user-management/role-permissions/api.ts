import { mockRolePermissions } from "./data";

export async function searchRolePermissions(
  roleName: string,
  domain: string,
  action: string,
): Promise<UserManagement.RolePermissionItem[]> {
  if (roleName || domain || action) {
    return [...mockRolePermissions];
  }
  return [...mockRolePermissions];
}

export async function saveRolePermissions(
  data: UserManagement.RolePermissionSave,
): Promise<boolean> {
  return !!data;
}
