import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  getUser,
  getUsers,
  patchUserStatus,
  updateUser,
} from "./api";

const queryKey = ["@user-management/users"];

export function useUsersQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUsers,
    enabled,
  });
}

export function useActiveUsersQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUsers,
    select: (data) => data.filter((user) => user.isActive),
    enabled,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserForm) => await createUser(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserForm) =>
      await updateUser(id, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
    },
  });
}

export function useUserQuery(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => getUser(id),
    enabled: enabled && !!id,
  });
}

export function useUserActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) =>
      await patchUserStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<UserManagement.UserList[]>(queryKey) ?? [];

      const index = result.findIndex((item) => item.id === variables.id);
      if (index === -1) return;

      const updatedItem = {
        ...result[index],
        isActive: variables.isActive,
      };

      queryClient.setQueryData(queryKey, [
        ...result.slice(0, index),
        updatedItem,
        ...result.slice(index + 1),
      ]);
    },
  });
}
