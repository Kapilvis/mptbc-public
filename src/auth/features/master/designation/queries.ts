import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDesignation,
  getDesignationById,
  getDesignations,
  patchDesignationStatus,
  updateDesignation,
} from "./api";

const queryKey = ["@master/designation"];

export function useActiveDesignationsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getDesignations,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useDesignationQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getDesignations,
    enabled,
  });
}

export function useDesignationsQuery(
  designationId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, designationId],
    queryFn: () => getDesignationById(designationId),
    enabled: enabled && !!designationId,
  });
}

export function useCreateDesignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.DesignationForm) => createDesignation(data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateDesignationMutation(designationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.DesignationForm) =>
      updateDesignation(designationId, data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, designationId] });
    },
  });
}

export function useDesignationActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { designationId: number; isActive: boolean }) =>
      await patchDesignationStatus(data.designationId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DesignationList[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.designationId === variables.designationId,
      );
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
