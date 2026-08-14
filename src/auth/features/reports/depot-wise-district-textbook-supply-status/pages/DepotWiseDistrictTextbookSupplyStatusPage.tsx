import { useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "shared/components/panels/Page";
import { depotWiseDistrictTextbookSupplyStatusData } from "../data/depotWiseDistrictTextbookSupplyStatusData";
import DepotWiseDistrictTextbookSupplyStatusFilters from "../components/DepotWiseDistrictTextbookSupplyStatusFilters";
import DepotWiseDistrictTextbookSupplyStatusSummary from "../components/DepotWiseDistrictTextbookSupplyStatusSummary";
import DepotWiseDistrictTextbookSupplyStatusTable from "../components/DepotWiseDistrictTextbookSupplyStatusTable";

export default function DepotWiseDistrictTextbookSupplyStatusPage() {
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState<
    Report.DepotWiseDistrictTextbookSupplyStatusRow[]
  >(depotWiseDistrictTextbookSupplyStatusData);

  const metaItems = [
    {
      label: t("reports.supply_status.metadata.organisation"),
      value: t("Madhya Pradesh Textbook Corporation"),
    },
    {
      label: t("reports.supply_status.metadata.scheme"),
      value: t("reports.supply_status.metadata_values.free_textbook_scheme"),
    },
    {
      label: t("reports.supply_status.metadata.classes"),
      value: t("reports.supply_status.metadata_values.1_to_12"),
    },
    {
      label: t("reports.supply_status.metadata.report_date"),
      value: "28/07/2026",
    },
    {
      label: t("reports.supply_status.metadata.report_type"),
      value: t(
        "reports.supply_status.metadata_values.depot_district_supply_status",
      ),
    },
  ];

  return (
    <Page
      header={t("reports.supply_status.page_header")}
      subHeader={t("reports.supply_status.page_sub_header")}
      showHeaderActions
    >
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="flex items-center gap-1.5 text-xs text-gray-400">
          <li className="flex items-center gap-1">
            <i className="pi pi-home text-[10px]" />
            {t("Home")}
          </li>
          <li>
            <i className="pi pi-chevron-right text-[8px]" />
          </li>
          <li className="text-gray-500">{t("reports.reports")}</li>
          <li>
            <i className="pi pi-chevron-right text-[8px]" />
          </li>
          <li className="font-medium text-gray-700">
            {t("reports.supply_status.title")}
          </li>
        </ol>
      </nav>

      {/* Metadata Card */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {metaItems.map((item) => (
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
