import {
  initialHrmsKpiMetrics,
  initialEmployees,
  depotDeploymentStats,
  initialPendingHrActions,
  initialRetirementPipeline,
} from "./data";
import type { HrmsEmployee, PendingHrAction } from "./data";

export async function fetchHrmsKpiMetrics() {
  return initialHrmsKpiMetrics;
}

export async function fetchEmployeeDirectory(): Promise<HrmsEmployee[]> {
  return initialEmployees;
}

export async function fetchDepotDeploymentStats() {
  return depotDeploymentStats;
}

export async function fetchPendingHrActions(): Promise<PendingHrAction[]> {
  return initialPendingHrActions;
}

export async function fetchRetirementPipeline() {
  return initialRetirementPipeline;
}

export async function processHrAction(
  actionId: string,
  decision: "APPROVED" | "REJECTED",
) {
  const item = initialPendingHrActions.find((a) => a.id === actionId);
  if (item) {
    item.status = decision;
  }
  return { success: true, actionId, decision };
}
