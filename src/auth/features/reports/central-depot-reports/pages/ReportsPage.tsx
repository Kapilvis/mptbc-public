import { useState, useMemo, useEffect } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import { StockStatusBadge } from "../../../paper/paper-stock/pages/PaperStockPage";

type TabId =
  | "gsm-stock"
  | "printer-orders"
  | "printer-supply"
  | "distributions";

export default function ReportsPage({
  defaultTab = "gsm-stock",
  hideTabs = false,
}: {
  defaultTab?: TabId;
  hideTabs?: boolean;
}) {
  const pageTitle = usePageTitle();
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const stocks = dataManager.getStocks();
  const orders = dataManager.getOrders();
  const distributions = dataManager.getDistributions();

  // 1. GSM-wise Stock Report
  const gsmStockReportData = useMemo(() => {
    return stocks.map((s) => ({
      gsm: `${s.gsm} GSM`,
      paperType: s.paperType,
      opening: s.openingStock,
      received: s.receivedQuantity,
      issued: s.issuedQuantity,
      closing: s.availableQuantity,
      minimum: s.minimumStockLevel,
      status: s.stockStatus,
    }));
  }, [stocks]);

  // 2. Printer-wise Order Report
  const printerOrderReportData = useMemo(() => {
    const printerMap: Record<
      string,
      {
        printer: string;
        totalOrders: number;
        approved: number;
        supplied: number;
        pending: number;
      }
    > = {};

    orders.forEach((o) => {
      if (!printerMap[o.printer]) {
        printerMap[o.printer] = {
          printer: o.printer,
          totalOrders: 0,
          approved: 0,
          supplied: 0,
          pending: 0,
        };
      }
      const data = printerMap[o.printer];
      data.totalOrders += 1;
      data.approved += o.approvedQty;
      data.supplied += o.suppliedQty;
      data.pending += o.pendingQty;
    });

    return Object.values(printerMap);
  }, [orders]);

  // 3. Printer-wise Supply Report
  const printerSupplyReportData = useMemo(() => {
    return orders.map((o) => ({
      printer: o.printer,
      gsm: `${o.gsm} GSM`,
      approved: o.approvedQty,
      supplied: o.suppliedQty,
      pending: o.pendingQty,
    }));
  }, [orders]);

  // 4. Paper Distribution Report
  const distributionReportData = useMemo(() => {
    return distributions.map((d) => ({
      distributionNo: d.challanNo,
      date: d.distributionDate,
      printer: d.printer,
      gsm: `${d.gsm} GSM`,
      quantity: d.issueQuantity,
      vehicle: d.vehicleNo,
      status: d.status,
    }));
  }, [distributions]);

  const tabs = [
    { id: "gsm-stock", label: "GSM-wise Stock Report", icon: "pi-sliders-h" },
    {
      id: "printer-orders",
      label: "Printer Order Summary",
      icon: "pi-file-edit",
    },
    {
      id: "printer-supply",
      label: "Printer-wise Supply Details",
      icon: "pi-print",
    },
    {
      id: "distributions",
      label: "Distribution Challan Report",
      icon: "pi-send",
    },
  ];

  const pageMeta = useMemo(() => {
    switch (activeTab) {
      case "gsm-stock":
        return {
          header: "GSM-wise Stock Report",
          subHeader:
            "कागज स्टॉक रिपोर्ट — View opening, received, issued, and closing stock grouped by GSM size.",
        };
      case "printer-orders":
        return {
          header: "Printer Order Summary Report",
          subHeader:
            "मुद्रक आदेश सारांश — View printer orders, approved quantities, and pending balances.",
        };
      case "printer-supply":
        return {
          header: "Printer-wise Supply Details",
          subHeader:
            "मुद्रक-वार आपूर्ति विवरण — View approved order quantities, supplied quantities, and pending balances.",
        };
      case "distributions":
        return {
          header: "Paper Distribution Challan Report",
          subHeader:
            "वितरण चालान रिपोर्ट — Track and search paper distribution challans issued to printers.",
        };
      default:
        return {
          header: "Central Depot Inventory Reports",
          subHeader:
            "केंद्रीय डिपो रिपोर्ट — Generate, view, and export inventory ledgers, supply statuses, and order checklists.",
        };
    }
  }, [activeTab]);

  return (
    <Page
      header={pageTitle || pageMeta.header}
      subHeader={pageMeta.subHeader}
      showHeaderActions
    >
      {/* Tabs Row */}
      {!hideTabs && (
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-150/40 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 border ${
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-750"
              }`}
            >
              <i className={`pi ${tab.icon}`} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Report Tables rendering based on active tab */}
      {activeTab === "gsm-stock" && (
        <Card>
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <i className="pi pi-sliders-h text-indigo-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              GSM-wise Stock Summary Ledger
            </span>
          </div>
          <GridPanel
            toolbarPlacement="panel"
            data={gsmStockReportData}
            searchFields={["gsm", "paperType"]}
            exportFilename="GSM_Wise_Stock_Report"
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-xs">{option.rowIndex + 1}</span>
                ),
                width: "50px",
                align: "center",
              },
              {
                field: "gsm",
                header: "GSM Size",
                align: "center",
                cell: (row) => (
                  <span className="text-xs font-bold">{row.gsm}</span>
                ),
              },
              {
                field: "paperType",
                header: "Paper Type",
                cell: (row) => (
                  <span className="text-xs font-semibold">{row.paperType}</span>
                ),
              },
              {
                field: "opening",
                header: "Opening Stock",
                align: "right",
                cell: (row) => (
                  <span className="text-xs">
                    {row.opening.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "received",
                header: "Received",
                align: "right",
                cell: (row) => (
                  <span className="text-xs text-emerald-650">
                    +{row.received.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "issued",
                header: "Issued",
                align: "right",
                cell: (row) => (
                  <span className="text-xs text-rose-650">
                    -{row.issued.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "closing",
                header: "Closing Balance",
                align: "right",
                cell: (row) => (
                  <span className="text-xs font-bold text-blue-750">
                    {row.closing.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "minimum",
                header: "Minimum Level",
                align: "right",
                cell: (row) => (
                  <span className="text-xs">
                    {row.minimum.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "status",
                header: "Status",
                align: "center",
                cell: (row) => <StockStatusBadge status={row.status} />,
              },
            ]}
          />
        </Card>
      )}

      {activeTab === "printer-orders" && (
        <Card>
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <i className="pi pi-file-edit text-indigo-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Printer Order Summary Ledger
            </span>
          </div>
          <GridPanel
            toolbarPlacement="panel"
            data={printerOrderReportData}
            searchFields={["printer"]}
            exportFilename="Printer_Orders_Summary_Report"
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-xs">{option.rowIndex + 1}</span>
                ),
                width: "50px",
                align: "center",
              },
              {
                field: "printer",
                header: "Printer Press Name",
                cell: (row) => (
                  <span className="text-xs font-bold">{row.printer}</span>
                ),
              },
              {
                field: "totalOrders",
                header: "Total Orders",
                align: "center",
                cell: (row) => (
                  <span className="text-xs font-semibold">
                    {row.totalOrders}
                  </span>
                ),
              },
              {
                field: "approved",
                header: "Approved Qty",
                align: "right",
                cell: (row) => (
                  <span className="text-xs">
                    {row.approved.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "supplied",
                header: "Supplied Qty",
                align: "right",
                cell: (row) => (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {row.supplied.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "pending",
                header: "Pending Qty",
                align: "right",
                cell: (row) => (
                  <span className="text-xs text-rose-600 font-extrabold">
                    {row.pending.toLocaleString()} MT
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {activeTab === "printer-supply" && (
        <Card>
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <i className="pi pi-print text-indigo-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Printer-wise Supply Details Ledger
            </span>
          </div>
          <GridPanel
            toolbarPlacement="panel"
            data={printerSupplyReportData}
            searchFields={["printer", "gsm"]}
            exportFilename="Printer_Supply_Details_Report"
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-xs">{option.rowIndex + 1}</span>
                ),
                width: "50px",
                align: "center",
              },
              {
                field: "printer",
                header: "Printer Press Name",
                cell: (row) => (
                  <span className="text-xs font-bold">{row.printer}</span>
                ),
              },
              {
                field: "gsm",
                header: "GSM Spec",
                align: "center",
                cell: (row) => (
                  <span className="text-xs font-semibold">{row.gsm}</span>
                ),
              },
              {
                field: "approved",
                header: "Order Qty (Approved)",
                align: "right",
                cell: (row) => (
                  <span className="text-xs">
                    {row.approved.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "supplied",
                header: "Supplied Qty",
                align: "right",
                cell: (row) => (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {row.supplied.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "pending",
                header: "Pending Qty",
                align: "right",
                cell: (row) => (
                  <span className="text-xs text-rose-600 font-extrabold">
                    {row.pending.toLocaleString()} MT
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      {activeTab === "distributions" && (
        <Card>
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <i className="pi pi-send text-indigo-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Distribution Dispatch Ledger
            </span>
          </div>
          <GridPanel
            toolbarPlacement="panel"
            data={distributionReportData}
            searchFields={["distributionNo", "printer", "vehicle"]}
            exportFilename="Paper_Distributions_Challan_Report"
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-xs">{option.rowIndex + 1}</span>
                ),
                width: "50px",
                align: "center",
              },
              {
                field: "distributionNo",
                header: "Distribution No",
                cell: (row) => (
                  <span className="text-xs font-bold text-indigo-950 dark:text-white">
                    {row.distributionNo}
                  </span>
                ),
              },
              {
                field: "date",
                header: "Date Issued",
                cell: (row) => <span className="text-xs">{row.date}</span>,
              },
              {
                field: "printer",
                header: "Printer Name",
                cell: (row) => (
                  <span className="text-xs font-semibold">{row.printer}</span>
                ),
              },
              {
                field: "gsm",
                header: "GSM Spec",
                align: "center",
                cell: (row) => (
                  <span className="text-xs font-bold">{row.gsm}</span>
                ),
              },
              {
                field: "quantity",
                header: "Quantity Dispatched",
                align: "right",
                cell: (row) => (
                  <span className="text-xs font-extrabold text-emerald-600">
                    {row.quantity.toLocaleString()} MT
                  </span>
                ),
              },
              {
                field: "vehicle",
                header: "Vehicle No",
                cell: (row) => (
                  <span className="text-xs font-mono">{row.vehicle}</span>
                ),
              },
              {
                field: "status",
                header: "Status",
                align: "center",
                cell: (row) => (
                  <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 uppercase">
                    {row.status}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}
    </Page>
  );
}
