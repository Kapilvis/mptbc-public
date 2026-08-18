import {
  MOCK_GSM_SUPPLY_DATA,
  MOCK_PAPER_KPI_METRICS,
  MOCK_SUPPLY_PIPELINE_STAGES,
  MOCK_VENDOR_PERFORMANCE,
  type PaperKpiMetric,
  type SupplyPipelineStage,
  type VendorPerformanceItem,
} from "./data";

export async function getPaperDashboardMetrics(): Promise<PaperKpiMetric[]> {
  await new Promise((res) => setTimeout(res, 150));
  return MOCK_PAPER_KPI_METRICS;
}

export async function getSupplyPipelineStages(): Promise<
  SupplyPipelineStage[]
> {
  await new Promise((res) => setTimeout(res, 150));
  return MOCK_SUPPLY_PIPELINE_STAGES;
}

export async function getVendorPerformanceMatrix(): Promise<
  VendorPerformanceItem[]
> {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_VENDOR_PERFORMANCE;
}

export async function getGsmSupplyData() {
  await new Promise((res) => setTimeout(res, 150));
  return MOCK_GSM_SUPPLY_DATA;
}
