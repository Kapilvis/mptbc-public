import { rolePermissionsUrls } from "./role-permissions/urls";
import { userRoleUrls } from "./role/urls";
import { userAssignmentUrls } from "./user-assignment/urls";
import { userUrls } from "./user/urls";

const baseUrl = "/user-management";
export const userManagementUrls = {
  user: userUrls(baseUrl),
  userRole: userRoleUrls(baseUrl),
  rolePermissions: rolePermissionsUrls(baseUrl),
  userAssignment: userAssignmentUrls(baseUrl),
};
