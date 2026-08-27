import { useState, useMemo, useCallback } from "react";
import { ToastService } from "services";
import { Modal } from "shared/components/popups";
import { Button } from "shared/components/buttons";
import { printerDemandMappingMock } from "../printerDemandMapping.mock";
import type { PrinterCapacityDetails } from "../printerDemandMapping.types";

interface Props {
  visible: boolean;
  onHide: () => void;
  orderNo: string;
  onReAllocationSuccess: () => void;
}

// ── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-150/50 dark:border-gray-700/50 flex items-center gap-2">
      <i className={`pi ${icon} text-indigo-600 dark:text-indigo-400`} />
      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
        {title}
      </span>
    </div>
  );
}

// ── Table Header Cell ───────────────────────────────────────────────────────
function TH({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  const alignCls =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";
  return (
    <th
      className={`px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${alignCls}`}
    >
      {children}
    </th>
  );
}

export default function WorkReAllocationModal({
  visible,
  onHide,
  orderNo,
  onReAllocationSuccess,
}: Props) {
  const [selectedPrinterCode, setSelectedPrinterCode] = useState("");
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Load data ─────────────────────────────────────────────────────────────
  const order = useMemo(() => {
    const orders = printerDemandMappingMock.getOrdersList();
    return orders.find((o) => o.orderNo === orderNo) ?? null;
  }, [orderNo]);

  const workSummary = useMemo(
    () => printerDemandMappingMock.getWorkSummaryForOrder(orderNo),
    [orderNo],
  );

  const paperSummary = useMemo(
    () => printerDemandMappingMock.getGsmPaperSummaryForOrder(orderNo),
    [orderNo],
  );

  const availablePrinters = useMemo(
    () =>
      printerDemandMappingMock
        .getPrintersCapacityDetails()
        .filter((p) => p.printerCode !== order?.printerCode),
    [order],
  );

  const selectedPrinter: PrinterCapacityDetails | null = useMemo(
    () =>
      availablePrinters.find((p) => p.printerCode === selectedPrinterCode) ??
      null,
    [availablePrinters, selectedPrinterCode],
  );

  const totalRemaining = useMemo(
    () => workSummary.reduce((s, r) => s + r.remaining, 0),
    [workSummary],
  );
  const totalOrdered = useMemo(
    () => workSummary.reduce((s, r) => s + r.ordered, 0),
    [workSummary],
  );
  const totalDelivered = useMemo(
    () => workSummary.reduce((s, r) => s + r.printedAndDelivered, 0),
    [workSummary],
  );

  const canAccommodate =
    selectedPrinter !== null &&
    selectedPrinter.availableCapacity >= totalRemaining;

  const capacityPct =
    selectedPrinter && selectedPrinter.approvedCapacity > 0
      ? Math.min(
          100,
          Math.round(
            (selectedPrinter.currentAllocated /
              selectedPrinter.approvedCapacity) *
              100,
          ),
        )
      : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    setErrorMsg("");
    if (!selectedPrinterCode) {
      setErrorMsg("Please select a new printer.");
      return;
    }
    if (!reason.trim()) {
      setErrorMsg("Please provide a reason for re-allocation.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      const result = printerDemandMappingMock.saveReAllocation(
        orderNo,
        selectedPrinterCode,
        reason.trim(),
      );
      setIsSaving(false);
      if (result.success) {
        ToastService.success(result.message);
        onReAllocationSuccess();
        onHide();
      } else {
        setErrorMsg(result.message);
      }
    }, 600);
  }, [selectedPrinterCode, reason, orderNo, onReAllocationSuccess, onHide]);

  const handleClose = () => {
    setSelectedPrinterCode("");
    setReason("");
    setErrorMsg("");
    onHide();
  };

  if (!order) return null;

  return (
    <Modal
      visible={visible}
      onHide={handleClose}
      header="Printer Work Re-Allocation"
      size="large"
    >
      <div className="flex flex-col gap-4">
        {/* ── Section 1: Order Info ─────────────────────────────────── */}
        <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                Original Order
              </span>
              <div className="text-lg font-black text-gray-900 dark:text-white font-mono">
                {order.orderNo}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold mt-0.5">
                {order.printerName}{" "}
                <span className="text-gray-400 font-mono text-[11px]">
                  ({order.printerCode})
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40 uppercase tracking-wide">
                {order.status}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                Depot:{" "}
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {order.deliveryDepot}
                </span>
              </span>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-indigo-100 dark:divide-indigo-900/30 pt-3 border-t border-indigo-100 dark:border-indigo-900/30">
            {[
              {
                label: "Total Ordered",
                value: totalOrdered.toLocaleString(),
                color: "text-slate-900 dark:text-white",
              },
              {
                label: "Delivered to Depot",
                value: totalDelivered.toLocaleString(),
                color: "text-emerald-700 dark:text-emerald-400",
              },
              {
                label: "Remaining",
                value: totalRemaining.toLocaleString(),
                color: "text-rose-700 dark:text-rose-400",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center px-4">
                <div
                  className={`text-xl font-black font-mono tracking-tight ${kpi.color}`}
                >
                  {kpi.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Work Allocation Summary ───────────────────── */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <SectionHeader icon="pi-list" title="Work Allocation Summary" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-slate-200/60 dark:border-slate-700/50">
                  <TH align="center">S.No</TH>
                  <TH>Title</TH>
                  <TH align="right">Ordered</TH>
                  <TH align="right">Printed & Delivered</TH>
                  <TH align="right">Remaining</TH>
                  <TH align="center">Depot</TH>
                </tr>
              </thead>
              <tbody>
                {workSummary.map((row, idx) => (
                  <tr
                    key={row.bookCode}
                    className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-center text-gray-400 font-medium text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                        {row.bookName}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {row.bookCode}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-gray-700 dark:text-gray-300 text-sm">
                      {row.ordered.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {row.printedAndDelivered.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-extrabold text-rose-700 dark:text-rose-400 text-sm">
                      {row.remaining.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40 uppercase tracking-wide">
                        {row.depotName}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-slate-50 dark:bg-slate-800/30 border-t-2 border-slate-200 dark:border-slate-700">
                  <td className="px-3 py-2.5" />
                  <td className="px-3 py-2.5 text-[11px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                    Total
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-extrabold text-gray-900 dark:text-white text-sm">
                    {totalOrdered.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                    {totalDelivered.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-extrabold text-rose-700 dark:text-rose-400 text-sm">
                    {totalRemaining.toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 3: Paper Issued & Used Summary ────────────────── */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <SectionHeader
            icon="pi-inbox"
            title="Paper Issued & Used Summary (GSM-wise)"
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-slate-200/60 dark:border-slate-700/50">
                  <TH align="center">GSM</TH>
                  <TH>Paper Type</TH>
                  <TH align="right">Supply Issued (MT)</TH>
                  <TH align="right">Paper Supply (MT)</TH>
                  <TH align="right">Paper Used incl. Wastage (MT)</TH>
                  <TH align="right">Paper Stock (MT)</TH>
                </tr>
              </thead>
              <tbody>
                {paperSummary.map((row, idx) => (
                  <tr
                    key={`${row.gsm}-${idx}`}
                    className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono">
                        {row.gsm} GSM
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {row.paperType}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-gray-700 dark:text-gray-300 text-sm">
                      {row.supplyIssued.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-blue-700 dark:text-blue-400 text-sm">
                      {row.paperSupply.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-rose-700 dark:text-rose-400 text-sm">
                      {row.paperUsedInclWastage.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                      {row.paperStock.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {paperSummary.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-gray-400 dark:text-gray-500 italic text-sm"
                    >
                      No paper summary data available.
                    </td>
                  </tr>
                )}
                {paperSummary.length > 0 && (
                  <tr className="bg-slate-50 dark:bg-slate-800/30 border-t-2 border-slate-200 dark:border-slate-700">
                    <td className="px-3 py-2.5" />
                    <td className="px-3 py-2.5 text-[11px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Total
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-extrabold text-gray-900 dark:text-white text-sm">
                      {paperSummary
                        .reduce((s, r) => s + r.supplyIssued, 0)
                        .toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-extrabold text-blue-700 dark:text-blue-400 text-sm">
                      {paperSummary
                        .reduce((s, r) => s + r.paperSupply, 0)
                        .toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-extrabold text-rose-700 dark:text-rose-400 text-sm">
                      {paperSummary
                        .reduce((s, r) => s + r.paperUsedInclWastage, 0)
                        .toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                      {paperSummary
                        .reduce((s, r) => s + r.paperStock, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 4: New Printer Selection ─────────────────────── */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <SectionHeader icon="pi-building" title="Select New Printer" />
          <div className="p-4 flex flex-col gap-4">
            {/* Printer Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                New Printer <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedPrinterCode}
                onChange={(e) => setSelectedPrinterCode(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
              >
                <option value="">— Select a Printer —</option>
                {availablePrinters.map((p) => (
                  <option key={p.printerCode} value={p.printerCode}>
                    {p.printerName} ({p.printerCode}) — Available:{" "}
                    {p.availableCapacity.toLocaleString()} Books
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Printer Capacity Summary */}
            {selectedPrinter && (
              <div
                className={`rounded-xl p-4 border ${
                  canAccommodate
                    ? "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30"
                    : "bg-rose-50/40 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30"
                }`}
              >
                {/* Printer name + badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-extrabold text-gray-900 dark:text-white">
                      {selectedPrinter.printerName}
                    </div>
                    <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                      {selectedPrinter.printerCode} · {selectedPrinter.category}{" "}
                      · {selectedPrinter.district}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide shrink-0 ${
                      canAccommodate
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40"
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40"
                    }`}
                  >
                    <i
                      className={`pi ${canAccommodate ? "pi-check-circle" : "pi-exclamation-triangle"} text-[9px]`}
                    />
                    {canAccommodate ? "Can Accommodate" : "Insufficient"}
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    <span>Capacity Utilized</span>
                    <span
                      className={
                        capacityPct >= 90
                          ? "text-rose-600"
                          : capacityPct >= 70
                            ? "text-amber-600"
                            : "text-emerald-700"
                      }
                    >
                      {capacityPct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        capacityPct >= 90
                          ? "bg-rose-500"
                          : capacityPct >= 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                </div>

                {/* 3-col capacity values */}
                <div className="grid grid-cols-3 gap-3 divide-x divide-gray-200 dark:divide-gray-700 text-center">
                  {[
                    {
                      label: "Total Capacity",
                      value: selectedPrinter.approvedCapacity.toLocaleString(),
                      color: "text-slate-900 dark:text-white",
                    },
                    {
                      label: "Currently Allocated",
                      value: selectedPrinter.currentAllocated.toLocaleString(),
                      color: "text-amber-700 dark:text-amber-400",
                    },
                    {
                      label: "Available",
                      value: selectedPrinter.availableCapacity.toLocaleString(),
                      color: canAccommodate
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400",
                    },
                  ].map((kpi) => (
                    <div key={kpi.label} className="px-2">
                      <div
                        className={`text-lg font-black font-mono ${kpi.color}`}
                      >
                        {kpi.value}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Re-allocation summary bar */}
                <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/40 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Work to Re-Allocate
                  </span>
                  <span
                    className={`font-extrabold text-lg font-mono ${
                      canAccommodate
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {totalRemaining.toLocaleString()} Books
                  </span>
                </div>
              </div>
            )}

            {/* Reason textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Reason for Re-Allocation{" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Printer could not complete work due to machine breakdown..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 text-sm font-semibold">
                <i className="pi pi-exclamation-circle shrink-0" />
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer Actions ────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            label="Cancel"
            icon="times"
            variant="outlined"
            onClick={handleClose}
            disabled={isSaving}
          />
          <Button
            label={isSaving ? "Saving..." : "Confirm Re-Allocation"}
            icon={isSaving ? "spinner" : "check-circle"}
            variant="primary"
            onClick={handleConfirm}
            disabled={isSaving || !selectedPrinterCode || !reason.trim()}
          />
        </div>
      </div>
    </Modal>
  );
}
