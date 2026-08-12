import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveOfficeLevelsQuery } from "auth/features/master/office-level/queries";
import {
  createOffice,
  getOfficeById,
  getOffices,
  patchOfficeStatus,
  updateOffice,
} from "./api";
import { officeLevelRank } from "./hooks/useOfficeLevelVisibility";

const queryKey = ["@master/office"];

export function useOfficesQuery(enabled: boolean = true) {
  const { data: levels = [] } = useActiveOfficeLevelsQuery(enabled);
  const anganwadiLevelId = levels[officeLevelRank.anganwadi - 1]?.officeLevelId;

  return useQuery({
    queryKey: queryKey,
    queryFn: getOffices,
    select: (data) =>
      data.filter((item) => {
        if (anganwadiLevelId) return item.officeLevelId !== anganwadiLevelId;
        return true;
      }),
    enabled,
  });
}

export function useActiveOfficesQuery(enabled: boolean = true) {
  const { data: levels = [] } = useActiveOfficeLevelsQuery(enabled);
  const anganwadiLevelId = levels[officeLevelRank.anganwadi - 1]?.officeLevelId;

  return useQuery({
    queryKey: queryKey,
    queryFn: getOffices,
    select: (data) =>
      data.filter((item) => {
        if (!item.isActive) return false;
        if (anganwadiLevelId) return item.officeLevelId !== anganwadiLevelId;
        return true;
      }),
    enabled,
  });
}

export function useOfficeQuery(officeId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, officeId],
    queryFn: () => getOfficeById(officeId),
    enabled: enabled && !!officeId,
  });
}

export function useCreateOfficeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.OfficeForm) => createOffice(data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateOfficeMutation(officeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Master.OfficeForm) => updateOffice(officeId, data),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, officeId] });
    },
  });
}

export function useOfficeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { officeId: number; isActive: boolean }) =>
      await patchOfficeStatus(data.officeId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.OfficeItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.officeId === variables.officeId,
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
