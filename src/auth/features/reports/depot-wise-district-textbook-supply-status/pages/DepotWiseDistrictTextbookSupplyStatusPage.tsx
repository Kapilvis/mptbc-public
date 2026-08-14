import { useState } from "react";
import Page from "shared/components/panels/Page";
import { depotWiseDistrictTextbookSupplyStatusData } from "../data/depotWiseDistrictTextbookSupplyStatusData";
import DepotWiseDistrictTextbookSupplyStatusFilters from "../components/DepotWiseDistrictTextbookSupplyStatusFilters";
import DepotWiseDistrictTextbookSupplyStatusSummary from "../components/DepotWiseDistrictTextbookSupplyStatusSummary";
import DepotWiseDistrictTextbookSupplyStatusTable from "../components/DepotWiseDistrictTextbookSupplyStatusTable";

const META_ITEMS = [
  { label: "Organisation", value: "Madhya Pradesh Textbook Corporation" },
  { label: "Scheme", value: "Free Textbook Scheme" },
  { label: "Classes", value: "1 to 12" },
  { label: "Report Date", value: "28/07/2026" },
  { label: "Report Type", value: "Depot & District Supply Status" },
];

export default function DepotWiseDistrictTextbookSupplyStatusPage() {
  const [filteredData, setFilteredData] = useState<
    Report.DepotWiseDistrictTextbookSupplyStatusRow[]
  >(depotWiseDistrictTextbookSupplyStatusData);

  return (
    <Page
      header="Depot Wise District Textbook Supply Status Report (Class 1–12)"
      subHeader="Session 2026-27 | Madhya Pradesh Textbook Corporation | Free Textbook Scheme"
      showHeaderActions
    >
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="flex items-center gap-1.5 text-xs text-gray-400">
          <li className="flex items-center gap-1">
            <i className="pi pi-home text-[10px]" />
            Home
          </li>
          <li>
            <i className="pi pi-chevron-right text-[8px]" />
          </li>
          <li className="text-gray-500">Reports</li>
          <li>
            <i className="pi pi-chevron-right text-[8px]" />
          </li>
          <li className="font-medium text-gray-700">
            Depot Wise District Textbook Supply Status
          </li>
        </ol>
      </nav>

      {/* Metadata Card */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {META_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {item.label}:
              </span>
              <span className="text-[11px] font-medium text-gray-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <DepotWiseDistrictTextbookSupplyStatusFilters
        onFilterChange={setFilteredData}
      />

      {/* Summary Cards */}
      <DepotWiseDistrictTextbookSupplyStatusSummary />

      {/* Report Table */}
      <DepotWiseDistrictTextbookSupplyStatusTable data={filteredData} />
    </Page>
  );
}
