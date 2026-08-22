import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchHrmsKpiMetrics,
  fetchEmployeeDirectory,
  fetchDepotDeploymentStats,
  fetchPendingHrActions,
  fetchRetirementPipeline,
  processHrAction,
} from "./api";

export const hrmsQueryKeys = {
  kpis: ["hrms", "kpis"] as const,
  employees: ["hrms", "employees"] as const,
  depotStats: ["hrms", "depot-stats"] as const,
  pendingActions: ["hrms", "pending-actions"] as const,
  retirements: ["hrms", "retirements"] as const,
};

export function useHrmsKpiMetricsQuery() {
  return useQuery({
    queryKey: hrmsQueryKeys.kpis,
    queryFn: fetchHrmsKpiMetrics,
  });
}

export function useEmployeeDirectoryQuery() {
  return useQuery({
    queryKey: hrmsQueryKeys.employees,
    queryFn: fetchEmployeeDirectory,
  });
}

export function useDepotDeploymentStatsQuery() {
  return useQuery({
    queryKey: hrmsQueryKeys.depotStats,
    queryFn: fetchDepotDeploymentStats,
  });
}

export function usePendingHrActionsQuery() {
  return useQuery({
    queryKey: hrmsQueryKeys.pendingActions,
    queryFn: fetchPendingHrActions,
  });
}

export function useRetirementPipelineQuery() {
  return useQuery({
    queryKey: hrmsQueryKeys.retirements,
    queryFn: fetchRetirementPipeline,
  });
}

export function useProcessHrActionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      actionId,
      decision,
    }: {
      actionId: string;
      decision: "APPROVED" | "REJECTED";
    }) => processHrAction(actionId, decision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hrmsQueryKeys.pendingActions });
    },
  });
}
