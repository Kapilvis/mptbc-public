import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserRole,
  getUserRoleById,
  getUserRoles,
  patchUserRoleStatus,
  updateUserRole,
} from "./api";

const queryKey = ["@user-management/user-role"];

export function useUserRolesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUserRoles,
    enabled,
  });
}

export function useActiveUserRolesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUserRoles,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useUserRoleQuery(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => getUserRoleById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserManagement.UserRoleForm) => createUserRole(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateUserRoleMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserManagement.UserRoleForm) => updateUserRole(id, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
    },
  });
}

export function useUserRoleActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) =>
      await patchUserRoleStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<UserManagement.UserRoleList[]>(queryKey) ?? [];

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
