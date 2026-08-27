import { useState, useMemo, useCallback } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";

import { printerDemandMappingMock } from "../printerDemandMapping.mock";
import ApprovedDemandGrid from "../components/ApprovedDemandGrid";
import PrinterDetailsViewModal from "../components/PrinterDetailsViewModal";
import WorkReAllocationModal from "../components/WorkReAllocationModal";
import type { SavedOrder } from "../printerDemandMapping.types";

export default function PrinterDemandMappingListPage() {
  const [academicYear, setAcademicYear] = useState<string>("2026-2027");

  // ───────── Data State ─────────
  const [orders, setOrders] = useState<SavedOrder[]>(() =>
    printerDemandMappingMock.getOrdersList(),
  );

  // ───────── View Details Modal State ─────────
  const [selectedOrderNo, setSelectedOrderNo] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // ───────── Re-Allocation Modal State ─────────
  const [reAllocOrderNo, setReAllocOrderNo] = useState("");
  const [isReAllocModalOpen, setIsReAllocModalOpen] = useState(false);

  const handleViewDetailsClick = useCallback((orderNo: string) => {
    setSelectedOrderNo(orderNo);
    setIsDetailsModalOpen(true);
  }, []);

  const handleWorkReAllocationClick = useCallback((orderNo: string) => {
    setReAllocOrderNo(orderNo);
    setIsReAllocModalOpen(true);
  }, []);

  const handleReAllocationSuccess = useCallback(() => {
    setOrders(printerDemandMappingMock.getOrdersList());
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) => !academicYear || (o.academicYear || "2026-2027") === academicYear,
    );
  }, [orders, academicYear]);

  const kpis = useMemo(() => {
    const total = filteredOrders.length;
    const inProgress = filteredOrders.filter(
      (o) => o.status === "InProgress",
    ).length;
    const completed = filteredOrders.filter(
      (o) => o.status === "Completed",
    ).length;
    const reAllocated = filteredOrders.filter(
      (o) => o.status === "ReAllocated",
    ).length;
    const totalWorkAllocation = filteredOrders.reduce(
      (s, o) => s + o.totalQuantity,
      0,
    );

    return {
      total,
      inProgress,
      completed,
      reAllocated,
      totalWorkAllocation,
    };
  }, [filteredOrders]);

  const kpiCards = [
    {
      label: "Total Work Allocation",
      value: kpis.totalWorkAllocation.toLocaleString(),
      subLabel: "Allocated to Printers",
      icon: "pi-book",
      accent: "border-l-purple-600",
      iconBg:
        "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
      subColor: "text-purple-600",
    },
    {
      label: "Total Orders",
      value: kpis.total.toLocaleString(),
      subLabel: "All Allocation Orders",
      icon: "pi-file",
      accent: "border-l-indigo-600",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50",
      subColor: "text-indigo-600",
    },
    {
      label: "In Progress",
      value: kpis.inProgress.toLocaleString(),
      subLabel: "Active Print Orders",
      icon: "pi-spinner pi-spin",
      accent: "border-l-amber-500",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
      subColor: "text-amber-600",
    },
    {
      label: "Completed",
      value: kpis.completed.toLocaleString(),
      subLabel: "Fully Delivered Orders",
      icon: "pi-check-circle",
      accent: "border-l-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
      subColor: "text-emerald-600",
    },
  ];

  return (
    <Page
      header="Printer Work Allocation"
      subHeader="मुद्रक कार्य आवंटन — Allocate printing work assignments to approved printers against tenders."
      showHeaderActions
    >
      {/* ── Academic Year Filter Bar ── */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        title="Session Filter"
        subtitle={`Viewing Printer Work Allocation and Tender Orders for Session ${academicYear}.`}
      />

      {/* ── KPI Cards ── */}
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

      {/* ── Main Grid ── */}
      <Card className="border border-slate-100 dark:border-slate-800 p-1 shadow-xs">
        <ApprovedDemandGrid
          data={filteredOrders}
          onViewDetailsClick={handleViewDetailsClick}
          onWorkReAllocationClick={handleWorkReAllocationClick}
        />
      </Card>

      {/* Details View Modal */}
      {isDetailsModalOpen && selectedOrderNo && (
        <PrinterDetailsViewModal
          visible={isDetailsModalOpen}
          onHide={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrderNo("");
          }}
          orderNo={selectedOrderNo}
        />
      )}

      {/* Work Re-Allocation Modal */}
      {isReAllocModalOpen && reAllocOrderNo && (
        <WorkReAllocationModal
          visible={isReAllocModalOpen}
          onHide={() => {
            setIsReAllocModalOpen(false);
            setReAllocOrderNo("");
          }}
          orderNo={reAllocOrderNo}
          onReAllocationSuccess={handleReAllocationSuccess}
        />
      )}
    </Page>
  );
}
