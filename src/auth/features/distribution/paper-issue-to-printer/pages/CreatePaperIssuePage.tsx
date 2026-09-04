import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Button, ButtonPanel } from "shared/components/buttons";
import {
  TextBox,
  DropDownList,
  DatePicker,
  TextArea,
} from "shared/components/forms";
import { ToastService } from "services";
import { paperIssueDataManager } from "../data";
import type { PaperDistribution } from "../../../inventory/types";

export default function CreatePaperIssuePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedOrderNo = searchParams.get("orderNo") || undefined;

  // 1. Fetch Master & Context Datasets
  const printers = paperIssueDataManager.getPrinterMasterList();
  const allOrders = paperIssueDataManager.getOrders();
  const stocks = paperIssueDataManager.getStocks();
  const distributions = paperIssueDataManager.getDistributions();

  // 2. Select Printer State & Options
  const [selectedPrinterCode, setSelectedPrinterCode] = useState("");

  const printerOptions = useMemo(() => {
    return printers.map((p) => ({
      value: p.printerCode,
      text: `${p.printerName} (${p.printerCode})`,
    }));
  }, [printers]);

  const selectedPrinter = useMemo(() => {
    return printers.find((p) => p.printerCode === selectedPrinterCode);
  }, [selectedPrinterCode, printers]);

  // Derived metrics for selected printer
  const printerPaperIssued = useMemo(() => {
    if (!selectedPrinterCode || !selectedPrinter) return 0;
    return distributions
      .filter((d) => d.printer === selectedPrinter.printerName)
      .reduce((sum, d) => sum + d.issueQuantity, 0);
  }, [selectedPrinterCode, distributions, selectedPrinter]);

  // 3. Row Issues state (Issue quantities per GSM + PaperType)
  const [rowIssues, setRowIssues] = useState<Record<string, string>>({});

  const activeOrdersForPrinter = useMemo(() => {
    if (!selectedPrinterCode) return [];
    return allOrders.filter(
      (o) =>
        o.printerCode === selectedPrinterCode &&
        (o.status === "Approved" ||
          o.status === "Partially Supplied" ||
          o.status === "Pending") &&
        o.pendingQty > 0,
    );
  }, [selectedPrinterCode, allOrders]);

  const gsmRequirements = useMemo(() => {
    if (!selectedPrinterCode) return [];

    // Group active allocations by GSM + Paper Type
    const groups: Record<
      string,
      {
        gsm: number;
        paperType: string;
        approvedQty: number;
        suppliedQty: number;
        pendingQty: number;
        availableStock: number;
      }
    > = {};

    activeOrdersForPrinter.forEach((order) => {
      const key = `${order.gsm}_${order.paperType}`;
      if (!groups[key]) {
        const stockItem = stocks.find(
          (s) => s.gsm === order.gsm && s.paperType === order.paperType,
        );
        groups[key] = {
          gsm: order.gsm,
          paperType: order.paperType,
          approvedQty: 0,
          suppliedQty: 0,
          pendingQty: 0,
          availableStock: stockItem?.availableQuantity || 0,
        };
      }
      groups[key].approvedQty += order.approvedQty;
      groups[key].suppliedQty += order.suppliedQty;
      groups[key].pendingQty += order.pendingQty;
    });

    return Object.values(groups);
  }, [activeOrdersForPrinter, stocks]);

  // Auto-load printer code if preSelectedOrderNo is provided
  useEffect(() => {
    if (preSelectedOrderNo) {
      const matchedOrder = allOrders.find(
        (o) => o.orderNo === preSelectedOrderNo,
      );
      if (matchedOrder) {
        setSelectedPrinterCode(matchedOrder.printerCode);
      }
    }
  }, [preSelectedOrderNo, allOrders]);

  // When changing printer, reset selected order quantities
  useEffect(() => {
    setRowIssues({});
  }, [selectedPrinterCode]);

  // 4. Dispatch Details State
  const [dispatchDate, setDispatchDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [vehicleNo, setVehicleNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [issuedBy] = useState("Admin");

  // Auto-generate Challan No when Printer is selected
  useEffect(() => {
    if (selectedPrinterCode) {
      const codeSuffix = Date.now().toString().slice(-4);
      setChallanNo(`CHL-PI-${selectedPrinterCode}-${codeSuffix}`);
    } else {
      setChallanNo("");
    }
  }, [selectedPrinterCode]);

  const handleRowIssueChange = (key: string, value: string) => {
    setRowIssues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasValidationError = useMemo(() => {
    return Object.entries(rowIssues).some(([key, val]) => {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) return false;
      const req = gsmRequirements.find(
        (r) => `${r.gsm}_${r.paperType}` === key,
      );
      if (!req) return false;
      const maxAllowed = Math.min(req.pendingQty, req.availableStock);
      return num > maxAllowed;
    });
  }, [rowIssues, gsmRequirements]);

  const hasAnyIssuedQuantity = useMemo(() => {
    return Object.values(rowIssues).some((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    });
  }, [rowIssues]);

  const totalIssueQty = useMemo(() => {
    return Object.values(rowIssues).reduce((sum, val) => {
      const num = parseFloat(val);
      return sum + (isNaN(num) || num < 0 ? 0 : num);
    }, 0);
  }, [rowIssues]);

  // 5. Form Submission
  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    try {
      if (!selectedPrinterCode || !selectedPrinter) {
        ToastService.error("Please select a printer.");
        return;
      }

      if (!dispatchDate || !vehicleNo || !challanNo) {
        ToastService.error("Please fill in all dispatch details.");
        return;
      }

      const issuesToSubmit: Omit<PaperDistribution, "status">[] = [];

      Object.entries(rowIssues).forEach(([key, val]) => {
        const qty = parseFloat(val);
        if (isNaN(qty) || qty <= 0) return;

        const req = gsmRequirements.find(
          (r) => `${r.gsm}_${r.paperType}` === key,
        );
        if (!req) return;

        // Find matching active order for this printer and GSM
        const order = activeOrdersForPrinter.find(
          (o) => o.gsm === req.gsm && o.paperType === req.paperType,
        );

        if (!order) {
          throw new Error(
            `No active order found for ${req.gsm} GSM ${req.paperType}.`,
          );
        }

        const orderSuffix = order.orderNo.replace(/[^a-zA-Z0-9]/g, "");
        const finalChallanNo = `${challanNo}-${key.replace("_", "-")}`;
        const finalIssueNo = `ISU-${orderSuffix}-${Date.now().toString().slice(-4)}`;

        issuesToSubmit.push({
          distributionNo: finalIssueNo,
          distributionDate: dispatchDate,
          printer: selectedPrinter.printerName,
          orderNo: order.orderNo,
          gsm: req.gsm,
          paperType: req.paperType,
          availableStockAtIssue: req.availableStock,
          approvedQty: req.approvedQty,
          previouslySupplied: req.suppliedQty,
          pendingQty: req.pendingQty,
          issueQuantity: qty,
          vehicleNo: vehicleNo,
          challanNo: finalChallanNo,
          dispatchDate: dispatchDate,
          remarks: remarks || `Issued for ${req.gsm} GSM`,
        });
      });

      if (issuesToSubmit.length === 0) {
        ToastService.error(
          "Please enter a valid issue quantity for at least one GSM type.",
        );
        return;
      }

      // Record each issue
      issuesToSubmit.forEach((issue) => {
        paperIssueDataManager.issuePaperToPrinter(issue);
      });

      ToastService.success(
        `Successfully issued ${issuesToSubmit.length} paper allocation(s) to ${selectedPrinter.printerName}!`,
      );
      navigate("/distribution/paper-issue-to-printer");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to record issues.";
      alert(msg);
    }
  };

  const handleCancel = () => {
    navigate("/distribution/paper-issue-to-printer");
  };

  return (
    <Page
      header="Issue Paper to Printer"
      subHeader="Create and dispatch paper from central depot to registered printer"
      showHeaderActions
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* â”€â”€ Section 1: Select Printer â”€â”€ */}
        <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Select Printer
            </h3>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Printer Dropdown */}
            <div className="max-w-sm">
              <DropDownList
                label="Registered Printer / Press *"
                required
                data={printerOptions}
                textField="text"
                valueField="value"
                value={selectedPrinterCode}
                onChange={(val) => setSelectedPrinterCode(val as string)}
                defaultOptionText="-- Select Registered Printer --"
                disabled={!!preSelectedOrderNo}
              />
            </div>

            {/* Printer Info Bar */}
            {selectedPrinter ? (
              <div className="flex items-stretch divide-x divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
                {/* Icon + Code */}
                <div className="flex items-center gap-3 px-5 py-4 min-w-45">
                  <span className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                    <i className="pi pi-print text-emerald-600 text-sm" />
                  </span>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {selectedPrinter.printerCode}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                      Printer Code
                    </span>
                  </div>
                </div>

                {/* District */}
                <div className="flex flex-col justify-center px-6 py-4">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedPrinter.district || "Bhopal"}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                    District / Division
                  </span>
                </div>

                {/* Approved Capacity */}
                <div className="flex flex-col justify-center px-6 py-4">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedPrinter.approvedCapacity?.toLocaleString() ||
                      "N/A"}{" "}
                    copies
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                    Approved Capacity
                  </span>
                </div>

                {/* Paper Issued */}
                <div className="flex flex-col justify-center px-6 py-4">
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {printerPaperIssued.toLocaleString()} MT
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                    Paper Issued (MT)
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10 px-6 py-5 text-xs text-slate-400 italic text-center">
                Select a printer above to view its details.
              </div>
            )}
          </div>
        </div>

        {/* â”€â”€ Section 2: GSM Requirements & Issue Quantities â”€â”€ */}
        <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              GSM Requirements &amp; Issue Quantities (MT)
            </h3>
          </div>

          <div className="px-0 py-0">
            {!selectedPrinterCode ? (
              <div className="px-6 py-10 text-center text-xs text-slate-400 italic">
                Select a printer to view GSM requirements.
              </div>
            ) : gsmRequirements.length === 0 ? (
              <div className="px-6 py-10 text-center text-xs text-slate-400 italic">
                No active printing requirements found for this printer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <th className="py-3 px-6">GSM / Paper Type</th>
                      <th className="py-3 px-6 text-right">
                        Total Required (MT)
                      </th>
                      <th className="py-3 px-6 text-right">
                        Already Issued (MT)
                      </th>
                      <th className="py-3 px-6 text-right">
                        Remaining Balance (MT)
                      </th>
                      <th className="py-3 px-6 text-right">Depot Stock (MT)</th>
                      <th className="py-3 px-6 text-center">Issue (MT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {gsmRequirements.map((req) => {
                      const rowKey = `${req.gsm}_${req.paperType}`;
                      const maxAllowed = Math.max(
                        0,
                        Math.min(req.pendingQty, req.availableStock),
                      );
                      const enteredVal = rowIssues[rowKey] || "";
                      const parsedVal = parseFloat(enteredVal) || 0;
                      const isErr = parsedVal > maxAllowed && parsedVal > 0;

                      return (
                        <tr
                          key={rowKey}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                            {req.gsm} GSM -{" "}
                            <span className="font-normal text-slate-500">
                              {req.paperType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-slate-700 dark:text-slate-300">
                            {req.approvedQty.toLocaleString()} MT
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {req.suppliedQty.toLocaleString()} MT
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-rose-600 dark:text-rose-400">
                            {req.pendingQty.toLocaleString()} MT
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-blue-600 dark:text-blue-400">
                            {req.availableStock.toLocaleString()} MT
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2 w-full max-w-40 ml-auto">
                                <input
                                  type="number"
                                  min="0"
                                  max={maxAllowed}
                                  step="1"
                                  disabled={maxAllowed <= 0}
                                  className={`flex-1 px-3 py-2 text-right text-xs rounded-lg focus:ring-2 focus:outline-hidden transition-all
                                     bg-white dark:bg-slate-700
                                     border
                                     ${
                                       isErr
                                         ? "border-rose-400 focus:ring-rose-300/50 text-rose-600 dark:text-rose-300"
                                         : parsedVal > 0
                                           ? "border-emerald-400 focus:ring-emerald-300/50 text-emerald-700 dark:text-emerald-300 font-bold"
                                           : "border-slate-300 dark:border-slate-500 focus:border-emerald-400 focus:ring-emerald-300/30 text-slate-800 dark:text-slate-100"
                                     }
                                     disabled:opacity-40 disabled:bg-slate-100 dark:disabled:bg-slate-800
                                     placeholder:text-slate-400 dark:placeholder:text-slate-400`}
                                  placeholder={
                                    maxAllowed > 0 ? "Enter Number" : "No stock"
                                  }
                                  value={enteredVal}
                                  onChange={(e) =>
                                    handleRowIssueChange(rowKey, e.target.value)
                                  }
                                />
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                                  MT
                                </span>
                              </div>
                              {isErr && (
                                <span className="text-[9px] text-rose-600 dark:text-rose-400 font-bold">
                                  Exceeds max ({maxAllowed.toLocaleString()} MT)
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Total footer row */}
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40">
                      <td
                        colSpan={5}
                        className="py-3 px-6 text-right text-xs font-bold text-slate-600 dark:text-slate-300"
                      >
                        Total Issue:
                      </td>
                      <td className="py-3 px-6 text-right">
                        <span
                          className={`text-sm font-extrabold ${
                            totalIssueQty > 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-400"
                          }`}
                        >
                          {totalIssueQty.toLocaleString()} MT
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* â”€â”€ Section 3: Dispatch / Gatepass Information â”€â”€ */}
        {selectedPrinterCode && gsmRequirements.length > 0 && (
          <div className="bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Dispatch / Gatepass Information
              </h3>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Row 1: Challan, Date, Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextBox
                  label="Gate Pass / Challan No. *"
                  required
                  value={challanNo}
                  onChange={(val) => setChallanNo(val)}
                />
                <DatePicker
                  label="Issue / Dispatch Date *"
                  required
                  value={dispatchDate}
                  onChange={(val) =>
                    setDispatchDate(val ? val.toISOString().split("T")[0] : "")
                  }
                />
                <TextBox
                  label="Vehicle Number *"
                  required
                  value={vehicleNo}
                  onChange={(val) => setVehicleNo(val)}
                  placeholder="e.g. MP09AB1234"
                />
              </div>

              {/* Row 2: Driver, Authorized Issuer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextBox
                  label="Driver Name"
                  value={driverName}
                  onChange={(val) => setDriverName(val)}
                  placeholder="Enter driver full name"
                />
                <TextBox
                  label="Authorized Issuer"
                  value={issuedBy}
                  onChange={() => {}}
                  disabled={true}
                />
              </div>

              {/* Remarks */}
              <TextArea
                label="Remarks / Notes"
                value={remarks}
                onChange={(val) => setRemarks(val)}
                placeholder="Enter gatepass notes or transport conditions here..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* â”€â”€ Footer Actions â”€â”€ */}
        <ButtonPanel>
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            variant="outlined"
            onClick={handleCancel}
          />
          <Button
            type="submit"
            label="Issue Paper & Generate Challan"
            icon="pi pi-send"
            onClick={handleSubmit}
            disabled={
              !selectedPrinterCode ||
              !hasAnyIssuedQuantity ||
              hasValidationError ||
              !vehicleNo ||
              !challanNo
            }
          />
        </ButtonPanel>
      </form>
    </Page>
  );
}
