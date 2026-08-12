declare namespace UserManagement {
  interface UserRoleBase {
    name: string;
    description: string;
  }
  type UserRoleForm = UserRoleBase;
  interface UserRoleList extends UserRoleBase {
    id: string;
    isActive: boolean;
  }
  interface UserBase {
    userName: string;
    firstName: string;
    lastName?: string;
    email: string;
  }

  type UserForm = UserBase;
  interface UserList extends UserBase {
    id: string;
    isActive: boolean;
  }

  // Domains Dropdown
  interface DomainItem {
    name: string;
    value: string;
  }

  // Rights Dropdown
  interface RightItem {
    name: string;
    value: string;
  }

  // Role Permissions
  interface RolePermissionItem {
    featureName: string;
    featureValue: string;
    isGranted: boolean;
  }
  interface RolePermissionForm {
    roleName: string;
    domain: string;
    action: string;
  }
  interface RolePermissionSave extends RolePermissionForm {
    addedFeatures: string[];
    removedFeatures: string[];
  }

  // User Assignments
  interface UserAssignmentBase {
    roleName: string;
    domain: string;
  }
  interface UserAssignmentForm extends UserAssignmentBase {
    userId: string;
  }
  interface UserAssignmentList extends UserAssignmentBase {
    userId: string;
    userName: string;
  }
}
