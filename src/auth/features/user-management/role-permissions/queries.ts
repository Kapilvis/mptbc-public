import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saveRolePermissions, searchRolePermissions } from "./api";

const queryKey = ["@user-management/role-permissions"];

export function useSearchRolePermissionsQuery(
  roleName: string,
  domain: string,
  action: string,
) {
  return useQuery({
    queryKey: [...queryKey, roleName, domain, action],
    queryFn: () => searchRolePermissions(roleName, domain, action),
    enabled: !!roleName && !!domain && !!action,
  });
}

export function useSaveRolePermissionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserManagement.RolePermissionSave) =>
      saveRolePermissions(data),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKey,
          variables.roleName,
          variables.domain,
          variables.action,
        ],
      });
    },
  });
}
