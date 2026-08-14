import {
  type DistrictMatrixItem,
  type KpiMetric,
  mockDistrictMatrixData,
  mockKpiMetrics,
} from "./data";

export async function getDashboardMetrics(): Promise<KpiMetric[]> {
  return Promise.resolve(mockKpiMetrics);
}

export async function getDistrictMatrixData(): Promise<DistrictMatrixItem[]> {
  return Promise.resolve(mockDistrictMatrixData);
}
