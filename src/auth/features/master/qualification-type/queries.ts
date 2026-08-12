import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQualificationType,
  getQualificationTypeById,
  getQualificationTypes,
  patchQualificationTypeStatus,
  updateQualificationType,
} from "./api";

const queryKey = ["@master/qualification-type"];

export function useActiveQualificationTypeQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getQualificationTypes,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useQualificationTypesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getQualificationTypes,
    enabled,
  });
}

export function useQualificationTypeQuery(
  qualificationTypeId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, qualificationTypeId],
    queryFn: () => getQualificationTypeById(qualificationTypeId),
    enabled: enabled && !!qualificationTypeId,
  });
}

export function useCreateQualificationTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.QualificationTypeForm) =>
      createQualificationType(data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateQualificationTypeMutation(
  qualificationTypeId: number,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.QualificationTypeForm) =>
      updateQualificationType(qualificationTypeId, data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({
        queryKey: [...queryKey, qualificationTypeId],
      });
    },
  });
}

export function useQualificationTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      qualificationTypeId: number;
      isActive: boolean;
    }) => await patchQualificationTypeStatus(data.qualificationTypeId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.QualificationTypeList[]>(queryKey) ??
        [];

      const index = result.findIndex(
        (item) => item.qualificationTypeId === variables.qualificationTypeId,
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
