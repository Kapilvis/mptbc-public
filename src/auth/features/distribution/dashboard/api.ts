import {
  type KpiMetric,
  mockKpiMetrics,
  mockTitleWiseDistributionData,
  type TitleWiseDistributionItem,
} from "./data";

export async function getDashboardMetrics(): Promise<KpiMetric[]> {
  return Promise.resolve(mockKpiMetrics);
}

export async function getDistrictMatrixData(): Promise<
  TitleWiseDistributionItem[]
> {
  return Promise.resolve(mockTitleWiseDistributionData);
}
