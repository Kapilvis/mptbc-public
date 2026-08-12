import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQualificationSubject,
  getQualificationSubjectById,
  getQualificationSubjects,
  getQualificationSubjectsByQualification,
  patchQualificationSubjectStatus,
  updateQualificationSubject,
} from "./api";

const queryKey = ["@master/qualification-subject"];

export function useQualificationSubjectsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getQualificationSubjects,
    enabled,
  });
}

export function useActiveQualificationSubjectsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, "active"],
    queryFn: getQualificationSubjects,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useQualificationSubjectQuery(
  qualificationSubjectId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, qualificationSubjectId],
    queryFn: () => getQualificationSubjectById(qualificationSubjectId),
    enabled: enabled && !!qualificationSubjectId,
  });
}

export function useCreateQualificationSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.QualificationSubjectForm) =>
      createQualificationSubject(data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateQualificationSubjectMutation(
  qualificationSubjectId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.QualificationSubjectForm) =>
      updateQualificationSubject(qualificationSubjectId, data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({
        queryKey: [...queryKey, qualificationSubjectId],
      });
    },
  });
}

export function useQualificationSubjectActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      qualificationSubjectId: number;
      isActive: boolean;
    }) => await patchQualificationSubjectStatus(data.qualificationSubjectId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.QualificationSubjectList[]>(queryKey) ??
        [];

      const index = result.findIndex(
        (item) =>
          item.qualificationSubjectId === variables.qualificationSubjectId,
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

export function useActiveQualificationSubjectsByQualificationQuery(
  qualificationId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, "qualification-type", qualificationId],
    queryFn: () => getQualificationSubjectsByQualification(qualificationId),
    select: (data) => data.filter((item) => item.isActive),
    enabled: enabled && !!qualificationId,
  });
}
