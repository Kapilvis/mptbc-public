import { mockUserAssignments } from "./data";

let userAssignments = [...mockUserAssignments];

export async function getUserAssignments(): Promise<
  UserManagement.UserAssignmentList[]
> {
  return [...userAssignments];
}

export async function createUserAssignment(
  data: UserManagement.UserAssignmentForm,
) {
  const newItem: UserManagement.UserAssignmentList = {
    ...data,
    userName: `user_${data.userId}`,
  };
  userAssignments.push(newItem);
  return newItem;
}

export async function deleteUserAssignment(
  userId: string,
  roleName: string,
  domain: string,
): Promise<boolean> {
  userAssignments = userAssignments.filter(
    (u) =>
      !(u.userId === userId && u.roleName === roleName && u.domain === domain),
  );
  return true;
}
