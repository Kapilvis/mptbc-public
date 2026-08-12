import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDesignationType,
  getDesignationTypeById,
  getDesignationTypes,
  patchDesignationTypeStatus,
  updateDesignationType,
} from "./api";

const queryKey = ["@master/designation-type"];

export function useActiveDesignationTypeQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getDesignationTypes,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useDesignationTypesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getDesignationTypes,
    enabled,
  });
}

export function useDesignationTypeQuery(
  designationTypeId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, designationTypeId],
    queryFn: () => getDesignationTypeById(designationTypeId),
    enabled: enabled && !!designationTypeId,
  });
}

export function useCreateDesignationTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.DesignationTypeForm) =>
      createDesignationType(data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateDesignationTypeMutation(designationTypeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.DesignationTypeForm) =>
      updateDesignationType(designationTypeId, data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({
        queryKey: [...queryKey, designationTypeId],
      });
    },
  });
}

export function useDesignationTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      designationTypeId: number;
      isActive: boolean;
    }) => await patchDesignationTypeStatus(data.designationTypeId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DesignationTypeList[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.designationTypeId === variables.designationTypeId,
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
