import { userManagementApiRoot } from "auth/apis/base";
import { ApiService } from "services";

const root = `${userManagementApiRoot}rights`;
export function getRightDetails() {
  return ApiService.getList<UserManagement.RightItem>(root);
}
