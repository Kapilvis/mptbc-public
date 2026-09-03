import {
  type BlockDemandRow,
  type DemandReportFilter,
  getDemandReportData,
} from "./data";

export interface DemandReportResponse {
  academicYear: string;
  medium: string;
  classLabel: string;
  titleHeaders: string[];
  rows: BlockDemandRow[];
  totals: Record<string, number>;
  grandTotal: number;
}

export async function fetchBlockWiseDemandReport(
  filter: DemandReportFilter,
): Promise<DemandReportResponse> {
  // Simulate rapid async API response
  await new Promise((resolve) => setTimeout(resolve, 150));

  const { titleHeaders, rows } = getDemandReportData(
    filter.medium,
    filter.classLabel,
  );

  // Filter rows by district/block search term if specified
  const filteredRows = filter.districtSearch
    ? rows.filter(
        (r) =>
          r.district
            .toLowerCase()
            .includes(filter.districtSearch.toLowerCase()) ||
          r.block.toLowerCase().includes(filter.districtSearch.toLowerCase()) ||
          r.bcode.includes(filter.districtSearch),
      )
    : rows;

  // Calculate column-level totals
  const totals: Record<string, number> = {};
  let grandTotal = 0;

  titleHeaders.forEach((title) => {
    totals[title] = 0;
  });

  filteredRows.forEach((row) => {
    titleHeaders.forEach((title) => {
      const q = row.quantities[title] || 0;
      totals[title] += q;
      grandTotal += q;
    });
  });

  return {
    academicYear: filter.academicYear,
    medium: filter.medium,
    classLabel: filter.classLabel,
    titleHeaders,
    rows: filteredRows,
    totals,
    grandTotal,
  };
}
