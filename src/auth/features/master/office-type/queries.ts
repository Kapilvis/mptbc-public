import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOfficeType,
  getOfficeTypeById,
  getOfficeTypes,
  getOfficeTypesByOfficeLevel,
  patchOfficeTypeStatus,
  updateOfficeType,
} from "./api";

const queryKey = ["@master/office-type"];

export function useOfficeTypesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getOfficeTypes,
    enabled,
  });
}

export function useOfficeTypeQuery(
  officeTypeId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, officeTypeId],
    queryFn: () => getOfficeTypeById(officeTypeId),
    enabled: enabled && !!officeTypeId,
  });
}

export function useCreateOfficeTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.OfficeTypeForm) => createOfficeType(data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateOfficeTypeMutation(officeTypeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.OfficeTypeForm) =>
      updateOfficeType(officeTypeId, data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, officeTypeId] });
    },
  });
}

export function useOfficeTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { officeTypeId: number; isActive: boolean }) =>
      await patchOfficeTypeStatus(data.officeTypeId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.OfficeTypeList[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.officeTypeId === variables.officeTypeId,
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

export function useActiveOfficeTypesByOfficeLevelQuery(
  officeLevelId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, "office-type", officeLevelId],
    queryFn: () => getOfficeTypesByOfficeLevel(officeLevelId),
    select: (data) => data.filter((item) => item.isActive),
    enabled: enabled && !!officeLevelId,
  });
}
