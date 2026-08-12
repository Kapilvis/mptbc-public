import { mockUsers } from "./data";

const users = [...mockUsers];

export async function getUser(id: string): Promise<UserManagement.UserForm> {
  const item = users.find((u) => u.id === id);
  if (!item) throw new Error("User not found");
  return {
    userName: item.userName,
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
  };
}

export async function getUsers(): Promise<UserManagement.UserList[]> {
  return [...users];
}

export async function createUser(data: UserManagement.UserForm) {
  const newItem: UserManagement.UserList = {
    id: `usr-${Date.now()}`,
    ...data,
    isActive: true,
  };
  users.push(newItem);
  return newItem;
}

export async function updateUser(
  id: string,
  data: UserManagement.UserForm,
): Promise<boolean> {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...data };
    return true;
  }
  return false;
}

export async function patchUserStatus(id: string): Promise<boolean> {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index].isActive = !users[index].isActive;
    return true;
  }
  return false;
}
