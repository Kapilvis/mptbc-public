import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserAssignment,
  deleteUserAssignment,
  getUserAssignments,
} from "./api";

const queryKey = ["@user-management/user-assignment"];

export function useUserAssignmentsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUserAssignments,
    enabled,
  });
}

export function useCreateUserAssignmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserManagement.UserAssignmentForm) =>
      createUserAssignment(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useDeleteUserAssignmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      roleName,
      domain,
    }: {
      userId: string;
      roleName: string;
      domain: string;
    }) => deleteUserAssignment(userId, roleName, domain),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}
