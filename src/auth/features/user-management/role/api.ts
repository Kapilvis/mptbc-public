import { mockUserRoles } from "./data";

const roles = [...mockUserRoles];

export async function getUserRoleById(
  id: string,
): Promise<UserManagement.UserRoleForm> {
  const item = roles.find((r) => r.id === id);
  if (!item) throw new Error("Role not found");
  return {
    name: item.name,
    description: item.description,
  };
}

export async function getUserRoles(): Promise<UserManagement.UserRoleList[]> {
  return [...roles];
}

export async function createUserRole(data: UserManagement.UserRoleForm) {
  const newItem: UserManagement.UserRoleList = {
    id: `role-${Date.now()}`,
    ...data,
    isActive: true,
  };
  roles.push(newItem);
  return newItem;
}

export async function updateUserRole(
  id: string,
  data: UserManagement.UserRoleForm,
): Promise<boolean> {
  const index = roles.findIndex((r) => r.id === id);
  if (index !== -1) {
    roles[index] = { ...roles[index], ...data };
    return true;
  }
  return false;
}

export async function patchUserRoleStatus(id: string): Promise<boolean> {
  const index = roles.findIndex((r) => r.id === id);
  if (index !== -1) {
    roles[index].isActive = !roles[index].isActive;
    return true;
  }
  return false;
}

export async function patchUserRole(id: string): Promise<boolean> {
  return patchUserRoleStatus(id);
}
