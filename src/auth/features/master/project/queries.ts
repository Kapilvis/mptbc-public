import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjectById,
  getProjects,
  getProjectsByDistrictId,
  patchProjectStatus,
  updateProject,
} from "./api";

const queryKey = ["@master/project"];

export function useProjectsQuery(enabled = true) {
  return useQuery({ queryKey: queryKey, queryFn: getProjects, enabled });
}

export function useProjectQuery(projectId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, projectId],
    queryFn: () => getProjectById(projectId),
    enabled: enabled && !!projectId,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useUpdateProjectMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.ProjectForm) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, projectId] });
    },
  });
}

export function useActiveProjectsByDistrictQuery(
  districtId: number | undefined,
) {
  return useQuery({
    queryKey: [...queryKey, "project", districtId],
    select: (data) => data.filter((item) => item.isActive),
    queryFn: () => getProjectsByDistrictId(districtId!),
    enabled: !!districtId,
  });
}

export function useProjectActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: number; isActive: boolean }) =>
      await patchProjectStatus(data.projectId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.ProjectItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.projectId === variables.projectId,
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
