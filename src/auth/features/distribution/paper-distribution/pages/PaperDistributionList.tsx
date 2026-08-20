import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { PaperDistribution } from "../../../inventory/types";
import CreateDistribution from "./CreateDistribution";

export default function PaperDistributionPage() {
  const [searchParams] = useSearchParams();
  const hasOrderNo = !!searchParams.get("orderNo");

  const [distributions, setDistributions] = useState<PaperDistribution[]>(() =>
    dataManager.getDistributions(),
  );

  const handleRefresh = () => {
    setDistributions([...dataManager.getDistributions()]);
  };

  useEffect(() => {
    if (hasOrderNo) {
      const timer = setTimeout(() => {
        const btn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Add") || b.querySelector(".pi-plus"),
        );
        if (btn) {
          (btn as HTMLButtonElement).click();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasOrderNo]);

  const CreateFormWrapper = ({ onSave }: { onSave: () => void }) => {
    return (
      <CreateDistribution
        onSave={() => {
          handleRefresh();
          onSave();
        }}
      />
    );
  };

  return (
    <Page
      header="Paper Distribution to Printers"
      subHeader="कागज वितरण प्रविष्टि — Issue available paper stock against approved printer orders."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={[...distributions].reverse()}
          searchFields={["challanNo", "printer", "orderNo", "vehicleNo"]}
          exportFilename="Paper_Distribution_Allocations"
          CreateForm={CreateFormWrapper}
          columns={[
            {
              cell: (_, option) => (
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "challanNo",
              header: "Challan / Dist No",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {row.challanNo}
                </span>
              ),
            },
            {
              field: "distributionDate",
              header: "Date",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-xs">{row.distributionDate}</span>
              ),
            },
            {
              field: "printer",
              header: "Printer Name",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-semibold">{row.printer}</span>
              ),
            },
            {
              field: "orderNo",
              header: "Order No",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-semibold text-indigo-650">
                  {row.orderNo}
                </span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "issueQuantity",
              header: "Quantity Issued",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-xs text-emerald-600 font-bold">
                  {row.issueQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "vehicleNo",
              header: "Vehicle No",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-xs">{row.vehicleNo}</span>
              ),
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {row.status}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
