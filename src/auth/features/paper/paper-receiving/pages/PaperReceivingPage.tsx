import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { PaperReceipt } from "../../../inventory/types";
import CreateReceiving from "./CreateReceiving";

export default function PaperReceivingPage() {
  const pageTitle = usePageTitle();
  const [receipts, setReceipts] = useState<PaperReceipt[]>(() =>
    dataManager.getReceipts(),
  );

  const handleRefresh = () => {
    setReceipts([...dataManager.getReceipts()]);
  };

  const CreateFormWrapper = ({ onSave }: { onSave: () => void }) => {
    return (
      <CreateReceiving
        onSave={() => {
          handleRefresh();
          onSave();
        }}
      />
    );
  };

  const totalOrdered = 3707; // 3,707 MT Actual Required & Ordered in Tender
  const totalReceived = useMemo(() => {
    return receipts.reduce((sum, r) => sum + r.quantity, 0);
  }, [receipts]);
  const pendingReceipt = Math.max(0, totalOrdered - totalReceived);
  const fulfillmentPercent = Math.round(
    (totalReceived / (totalOrdered || 1)) * 100,
  );

  const kpiCards = [
    {
      label: "Total Ordered Paper",
      value: `${totalOrdered.toLocaleString()} MT`,
      subLabel: "Tender Work Allocation Order",
      icon: "pi-file",
      accent: "border-l-indigo-600",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50",
      subColor: "text-indigo-600",
    },
    {
      label: "Total Paper Received",
      value: `${totalReceived.toLocaleString()} MT`,
      subLabel: `${fulfillmentPercent}% Received in Godown`,
      icon: "pi-truck",
      accent: "border-l-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
      subColor: "text-emerald-600",
    },
    {
      label: "Pending Receipt",
      value: `${pendingReceipt.toLocaleString()} MT`,
      subLabel: "Pending Vendor Consignments",
      icon: "pi-clock",
      accent: "border-l-amber-500",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
      subColor: "text-amber-600",
    },
    {
      label: "GRN Receipts Count",
      value: receipts.length.toString(),
      subLabel: "Total Goods Receipt Notes",
      icon: "pi-check-circle",
      accent: "border-l-blue-600",
      iconBg:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
      subColor: "text-blue-600",
    },
  ];

  return (
    <Page
      header={pageTitle || "Paper Stock In (Receiving)"}
      subHeader="कागज प्राप्ति प्रविष्टि — Record and log incoming paper rolls from registered paper vendors against 3,707 MT order."
      showHeaderActions
    >
      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.label}
            className={`border-l-4 ${kpi.accent} border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {kpi.label}
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs ${kpi.subColor} font-semibold`}
                >
                  <i className={`pi ${kpi.icon} text-[11px]`} />
                  <span>{kpi.subLabel}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${kpi.iconBg}`}
              >
                <i className={`pi ${kpi.icon} text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={[...receipts].reverse()}
          searchFields={["receiptNo", "supplier", "vehicleNo", "challanNo"]}
          exportFilename="Paper_Receipt_Logs"
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
              field: "receiptNo",
              header: "Receipt No",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {row.receiptNo}
                </span>
              ),
            },
            {
              field: "receiptDate",
              header: "Date",
              cell: (row: PaperReceipt) => (
                <span className="text-xs">{row.receiptDate}</span>
              ),
            },
            {
              field: "supplier",
              header: "Vendor / Supplier",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-semibold">{row.supplier}</span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-bold">{row.gsm} GSM</span>
              ),
              footer: (
                <span className="text-xs font-bold text-slate-700">Total</span>
              ),
            },
            {
              field: "quantity",
              header: "Received paper",
              align: "center",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-bold text-emerald-600">
                  {row.quantity.toLocaleString()} MT
                </span>
              ),
              footer: (
                <span className="text-xs font-bold text-emerald-600">
                  {totalReceived.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "vehicleNo",
              header: "Vehicle No",
              cell: (row: PaperReceipt) => (
                <span className="text-xs">{row.vehicleNo}</span>
              ),
            },
            {
              field: "challanNo",
              header: "Challan No",
              cell: (row: PaperReceipt) => (
                <span className="text-xs">{row.challanNo}</span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
