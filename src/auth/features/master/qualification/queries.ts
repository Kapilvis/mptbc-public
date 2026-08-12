import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQualification,
  getQualificationById,
  getQualifications,
  getQualificationsByQualificationType,
  patchQualificationStatus,
  updateQualification,
} from "./api";

const queryKey = ["@master/qualification"];

export function useQualificationQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getQualifications,
    enabled,
  });
}

export function useActiveQualificationsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, "active"],
    queryFn: getQualifications,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useQualificationsQuery(
  qualificationId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, qualificationId],
    queryFn: () => getQualificationById(qualificationId),
    enabled: enabled && !!qualificationId,
  });
}

export function useCreateQualificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.QualificationForm) => createQualification(data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateQualificationMutation(qualificationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.QualificationForm) =>
      updateQualification(qualificationId, data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({
        queryKey: [...queryKey, qualificationId],
      });
    },
  });
}

export function useQualificationActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { qualificationId: number; isActive: boolean }) =>
      await patchQualificationStatus(data.qualificationId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.QualificationList[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.qualificationId === variables.qualificationId,
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

export function useActiveQualificationByQualificationTypeQuery(
  qualificationTypeId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, "qualification-type", qualificationTypeId],
    queryFn: () => getQualificationsByQualificationType(qualificationTypeId),
    select: (data) => data.filter((item) => item.isActive),
    enabled: enabled && !!qualificationTypeId,
  });
}
