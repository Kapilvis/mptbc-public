import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
  patchEmployeeStatus,
} from "./api";

const queryKey = ["@hrms/employee-details"];

export function useEmployeesQuery(enabled = true) {
  return useQuery({ queryKey: queryKey, queryFn: getEmployees, enabled });
}

export function useEmployeeQuery(employeeId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, employeeId],
    queryFn: () => getEmployeeById(employeeId),
    enabled: enabled && !!employeeId,
  });
}

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useUpdateEmployeeMutation(employeeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HRMS.EmployeeRegistration) =>
      updateEmployee(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, employeeId] });
    },
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: number) => deleteEmployee(employeeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useEmployeeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { employeeId: number; isActive: boolean }) =>
      await patchEmployeeStatus(data.employeeId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<HRMS.EmployeeRegistration[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.employeeId === variables.employeeId,
      );
      if (index === -1) return;

      const updatedItem = {
        ...result[index],
        employmentStatus: (variables.isActive ? "Active" : "Inactive") as
          | "Active"
          | "Inactive",
      };

      queryClient.setQueryData(queryKey, [
        ...result.slice(0, index),
        updatedItem,
        ...result.slice(index + 1),
      ]);
    },
  });
}
