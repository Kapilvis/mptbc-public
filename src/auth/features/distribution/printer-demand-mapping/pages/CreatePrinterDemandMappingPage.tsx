import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button, ButtonPanel } from "shared/components/buttons";
import { DropDownList, DatePicker, TextBox } from "shared/components/forms";
import { ToastService } from "services";

import { printerDemandMappingMock } from "../printerDemandMapping.mock";
import { DEPOTS } from "../printerDemandMapping.constants";

interface SessionAllocation {
  bookCode: string;
  bookName: string;
  printerCode: string;
  printerName: string;
  quantity: number;
  deliveryDepot: string;
  expectedCompletionDate: string;
}

export default function CreatePrinterDemandMappingPage() {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  // ───────── Tender Settings State ─────────
  const [selectedTenderNo, setSelectedTenderNo] = useState("");
  const [selectedPrinterCode, setSelectedPrinterCode] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");

  // ───────── Allocation Form State ─────────
  const [selectedBookCode, setSelectedBookCode] = useState("");
  const [inputQuantity, setInputQuantity] = useState<string>("");
  const [expectedDate, setExpectedDate] = useState<Date | null>(null);

  // ───────── Session Allocations (Draft) ─────────
  const [sessionAllocations, setSessionAllocations] = useState<
    SessionAllocation[]
  >([]);

  // ───────── Derived Data from Mock Layer ─────────
  const approvedDemandsList = useMemo(() => {
    return printerDemandMappingMock.getDemandsList();
  }, []);

  const printersCapacityDetails = useMemo(() => {
    return printerDemandMappingMock.getPrintersCapacityDetails();
  }, []);

  // Tender options for dropdown
  const tenderOptions = approvedDemandsList.map((d) => ({
    text: `${d.demandNo} — ${d.department} (${d.depot})`,
    value: d.demandNo,
  }));

  // Printer options for dropdown
  const printerOptions = useMemo(() => {
    return printersCapacityDetails.map((p) => {
      const sessionPrinterUsed = sessionAllocations
        .filter((a) => a.printerCode === p.printerCode)
        .reduce((sum, a) => sum + a.quantity, 0);

      const avail = Math.max(0, p.availableCapacity - sessionPrinterUsed);

      return {
        text: `${p.printerName} (${p.printerCode}) — Avail: ${avail.toLocaleString()}`,
        value: p.printerCode,
        disabled: avail <= 0,
      };
    });
  }, [printersCapacityDetails, sessionAllocations]);

  // Active tender detail
  const activeTender = useMemo(() => {
    return approvedDemandsList.find((d) => d.demandNo === selectedTenderNo);
  }, [selectedTenderNo, approvedDemandsList]);

  // Available titles from active tender
  const activeTitles = useMemo(() => {
    return activeTender ? activeTender.titles : [];
  }, [activeTender]);

  // Exclude already-drafted book codes from the textbook dropdown
  const titleOptions = useMemo(() => {
    const draftedBookCodes = new Set(sessionAllocations.map((a) => a.bookCode));
    return activeTitles
      .filter((t) => !draftedBookCodes.has(t.bookCode))
      .map((t) => ({
        text: `${t.bookName} (${t.bookCode}) • ${t.class}`,
        value: t.bookCode,
      }));
  }, [activeTitles, sessionAllocations]);

  // Active title detail
  const activeTitleItem = useMemo(() => {
    return activeTitles.find((t) => t.bookCode === selectedBookCode);
  }, [selectedBookCode, activeTitles]);

  // Title allocation stats
  const titleAllocationStats = useMemo(() => {
    if (!activeTitleItem)
      return { required: 0, mapped: 0, current: 0, remaining: 0 };

    const required = activeTitleItem.requiredQty;
    const mapped = activeTitleItem.allocatedQty;

    const current = sessionAllocations
      .filter((a) => a.bookCode === selectedBookCode)
      .reduce((sum, a) => sum + a.quantity, 0);

    const remaining = Math.max(0, activeTitleItem.remainingQty - current);

    return { required, mapped, current, remaining };
  }, [activeTitleItem, sessionAllocations, selectedBookCode]);

  // Depot options
  const depotDropdownData = DEPOTS.map((d) => ({
    text: d.text,
    value: d.value,
  }));

  // ───────── Handlers ─────────

  const resetAssignmentInputs = useCallback(() => {
    setSelectedBookCode("");
    setInputQuantity("");
    setExpectedDate(null);
  }, []);

  const resetAll = useCallback(() => {
    setSelectedTenderNo("");
    setSelectedPrinterCode("");
    setSelectedDepot("");
    setSelectedBookCode("");
    setInputQuantity("");
    setExpectedDate(null);
    setSessionAllocations([]);
  }, []);

  const handleTenderChange = (val: string) => {
    setSelectedTenderNo(val);
    setSelectedPrinterCode("");
    setSelectedDepot("");
    setSelectedBookCode("");
    setSessionAllocations([]);
    resetAssignmentInputs();
  };

  const handlePrinterChange = (val: string) => {
    setSelectedPrinterCode(val);
    setSelectedDepot("");
    setSelectedBookCode("");
    resetAssignmentInputs();
  };

  const handleDepotChange = (val: string) => {
    setSelectedDepot(val);
    setSelectedBookCode("");
    resetAssignmentInputs();
  };

  const handleAddAssignment = () => {
    if (!selectedBookCode) {
      ToastService.error("Please select a Textbook Title first.");
      return;
    }
    if (!selectedPrinterCode) {
      ToastService.error("Please select a printer.");
      return;
    }
    const qtyNum = inputQuantity ? parseInt(inputQuantity, 10) : 0;
    if (isNaN(qtyNum) || qtyNum <= 0) {
      ToastService.error("Please enter a valid quantity greater than zero.");
      return;
    }
    if (!selectedDepot) {
      ToastService.error("Please select a Delivery Depot.");
      return;
    }
    if (!expectedDate) {
      ToastService.error("Please select an Expected Completion Date.");
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expectedDate < today) {
      ToastService.error("Expected Completion Date cannot be in the past.");
      return;
    }

    const printer = printersCapacityDetails.find(
      (p) => p.printerCode === selectedPrinterCode,
    );
    if (!printer) return;

    // Check printer capacity
    const printerAllocatedInSession = sessionAllocations
      .filter((a) => a.printerCode === selectedPrinterCode)
      .reduce((sum, a) => sum + a.quantity, 0);

    const availableCapacity =
      printer.availableCapacity - printerAllocatedInSession;
    if (qtyNum > availableCapacity) {
      ToastService.error(
        `Quantity (${qtyNum.toLocaleString()}) exceeds the printer's remaining available capacity (${availableCapacity.toLocaleString()} copies).`,
      );
      return;
    }

    // Check remaining textbook demand
    if (qtyNum > titleAllocationStats.remaining) {
      ToastService.error(
        `Quantity (${qtyNum.toLocaleString()}) exceeds the remaining textbook demand (${titleAllocationStats.remaining.toLocaleString()} copies).`,
      );
      return;
    }

    const newAssign: SessionAllocation = {
      bookCode: selectedBookCode,
      bookName: activeTitleItem?.bookName || selectedBookCode,
      printerCode: selectedPrinterCode,
      printerName: printer.printerName,
      quantity: qtyNum,
      deliveryDepot: selectedDepot,
      expectedCompletionDate: expectedDate.toISOString().split("T")[0],
    };

    setSessionAllocations([...sessionAllocations, newAssign]);
    resetAssignmentInputs();
  };

  const handleRemoveAssignment = (index: number) => {
    const updated = sessionAllocations.filter((_, idx) => idx !== index);
    setSessionAllocations(updated);
  };

  const handleCancel = () => {
    resetAll();
    navigate("/distribution/printer-demand-mapping");
  };

  const handleConfirmAllocation = () => {
    if (sessionAllocations.length === 0) {
      ToastService.error(
        "Please add at least one textbook allocation before confirming.",
      );
      return;
    }

    const allocationsToSave = sessionAllocations.map((a) => ({
      bookCode: a.bookCode,
      printerCode: a.printerCode,
      quantity: a.quantity,
      deliveryDepot: a.deliveryDepot,
      expectedCompletionDate: a.expectedCompletionDate,
    }));

    const result = printerDemandMappingMock.saveNewAllocations(
      selectedTenderNo,
      allocationsToSave,
    );

    if (result.success) {
      ToastService.success(result.message);
      resetAll();
      navigate("/distribution/printer-demand-mapping");
    } else {
      ToastService.error(result.message);
    }
  };

  // ───────── Derived Flags for Sequence Flow ─────────
  const isTenderSelected = !!selectedTenderNo;
  const isPrinterSelected = !!selectedPrinterCode;
  const isDepotSelected = !!selectedDepot;
  const isFormEnabled =
    isTenderSelected && isPrinterSelected && isDepotSelected;

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/distribution/printer-demand-mapping")}
      className="font-bold text-xs"
    />
  );

  return (
    <Page
      header="Printer Work Allocation"
      subHeader="Allocate printing work assignments to approved printers against tenders."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}

      {/* ──────── TENDER SETTINGS ──────── */}
      <Card className="p-4 border border-gray-150/40 dark:border-gray-800 mb-5">
        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 pb-2 border-b border-gray-150/40 dark:border-gray-800 flex items-center gap-1.5">
          <i className="pi pi-file-edit text-emerald-650" />
          Tender Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DropDownList
            label="Select Printer Tender Number"
            data={tenderOptions}
            textField="text"
            optionValue="value"
            value={selectedTenderNo || null}
            onChange={(val) => handleTenderChange((val as string) ?? "")}
            defaultOptionText="-- Choose Tender Number --"
          />

          <DropDownList
            label="Select Printer"
            data={printerOptions}
            textField="text"
            optionValue="value"
            value={selectedPrinterCode || null}
            onChange={(val) => handlePrinterChange((val as string) ?? "")}
            disabled={!isTenderSelected}
            defaultOptionText="-- Choose Approved Printer --"
          />

          <DropDownList
            label="Delivery Depot"
            data={depotDropdownData}
            textField="text"
            optionValue="value"
            value={selectedDepot || null}
            onChange={(val) => handleDepotChange((val as string) ?? "")}
            disabled={!isPrinterSelected}
            defaultOptionText="-- Select Depot --"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start mb-5">
        {/* ──────── LEFT: Title Details ──────── */}
        <div className="lg:col-span-1">
          {activeTitleItem ? (
            <Card className="p-4 border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/20 dark:bg-emerald-950/5">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-450 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-emerald-100/60 dark:border-emerald-900/30 pb-1.5">
                <i className="pi pi-book" />
                Selected Title Details
              </h4>

              <div className="flex flex-col gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide">
                    Title Name
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                    {activeTitleItem.bookName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide">
                      Class / Subject
                    </span>
                    <span className="font-semibold block mt-0.5">
                      {activeTitleItem.class} • {activeTitleItem.subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide">
                      Work Allocation (Net)
                    </span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 block mt-0.5">
                      {titleAllocationStats.required.toLocaleString()} copies
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wide">
                      Approved Demand
                    </span>
                    <span className="font-bold text-blue-700 dark:text-blue-400 block mt-0.5">
                      {(
                        activeTitleItem.approvedDemandQty ??
                        activeTitleItem.requiredQty
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wide">
                      Opening Stock (Ded.)
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
                      -{(activeTitleItem.openingStock ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 bg-white dark:bg-gray-900 border border-gray-150/40 dark:border-gray-800 rounded-lg">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wide">
                      Mapped
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-450 block mt-0.5">
                      {titleAllocationStats.mapped.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wide">
                      Draft Session
                    </span>
                    <span className="font-bold text-gray-700 dark:text-gray-400 block mt-0.5">
                      {titleAllocationStats.current.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wide">
                      Remaining
                    </span>
                    <span
                      className={`font-bold block mt-0.5 ${titleAllocationStats.remaining > 0 ? "text-rose-600" : "text-gray-400"}`}
                    >
                      {titleAllocationStats.remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 border border-gray-150/40 dark:border-gray-800">
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <i className="pi pi-book text-2xl mb-2 opacity-40" />
                <span className="text-xs italic">
                  Select a textbook to view title details
                </span>
              </div>
            </Card>
          )}
        </div>

        {/* ──────── RIGHT: Allocation Form ──────── */}
        <div className="lg:col-span-2">
          <Card className="p-4 border border-gray-150/40 dark:border-gray-800">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 pb-2 border-b border-gray-150/40 dark:border-gray-800 flex items-center gap-1.5">
              <i className="pi pi-sliders-h text-emerald-650" />
              Allocation Assignments Form
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4">
              <div>
                <DropDownList
                  label="Select Textbook / Title"
                  data={titleOptions}
                  textField="text"
                  optionValue="value"
                  value={selectedBookCode || null}
                  onChange={(val) => setSelectedBookCode((val as string) ?? "")}
                  disabled={!isFormEnabled}
                  defaultOptionText="-- Choose Book Title --"
                />
              </div>

              <TextBox
                label="Allocation Quantity"
                value={inputQuantity}
                onChange={(val) => setInputQuantity(val)}
                disabled={!isFormEnabled}
                placeholder="Enter copies amount"
                keyfilter="int"
              />

              <div>
                <DatePicker
                  label="Expected Completion Date"
                  value={expectedDate}
                  onChange={(date) => setExpectedDate(date)}
                  disabled={!isFormEnabled}
                  placeholder="Select Date"
                />
              </div>

              <div>
                <Button
                  label="Add Assignment"
                  icon="plus"
                  variant="primary"
                  className="h-9"
                  onClick={handleAddAssignment}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ──────── DRAFT ALLOCATION MAPPING LIST ──────── */}
      <Card className="p-4 border border-gray-150/40 dark:border-gray-800 mb-5">
        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 pb-2 border-b border-gray-150/40 dark:border-gray-800">
          Draft Allocation Mapping List ({sessionAllocations.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/30 text-gray-500 uppercase tracking-wider text-[9px] font-bold border-b border-gray-150/40 dark:border-gray-700/60">
                <th className="px-3 py-2 w-10 text-center">S.No</th>
                <th className="px-3 py-2">Textbook / Title</th>
                <th className="px-3 py-2">Mapped Printer</th>
                <th className="px-3 py-2 text-right">Quantity</th>
                <th className="px-3 py-2 text-center">Delivery Depot</th>
                <th className="px-3 py-2 text-center">Expected Completion</th>
                <th className="px-3 py-2 text-center w-16">Remove</th>
              </tr>
            </thead>
            <tbody>
              {sessionAllocations.map((alloc, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-150/20 dark:border-gray-850 hover:bg-gray-50/20"
                >
                  <td className="px-3 py-2 text-center font-medium text-gray-400">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2">
                    <span className="font-bold block text-gray-800 dark:text-gray-200">
                      {alloc.bookName}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono font-bold mt-0.5 block">
                      Code: {alloc.bookCode}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    {alloc.printerName}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-emerald-800 dark:text-emerald-400">
                    {alloc.quantity.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {alloc.deliveryDepot}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-gray-600 dark:text-gray-450">
                    {alloc.expectedCompletionDate}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignment(idx)}
                      className="text-rose-600 hover:text-rose-800 text-xs p-1"
                      title="Remove assignment"
                    >
                      <i className="pi pi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
              {sessionAllocations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-450 italic bg-gray-50/20"
                  >
                    No allocations drafted in this mapping session. Select a
                    textbook and add an allocation above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Confirm / Cancel Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-150/40 dark:border-gray-800">
          <span className="text-[10px] text-gray-400 italic">
            * Note: Check available printer capacities and title demands before
            final confirmation.
          </span>

          <ButtonPanel>
            <Button
              label="Cancel"
              icon="times"
              variant="outlined"
              size="small"
              onClick={handleCancel}
            />
            <Button
              label="Confirm Allocation"
              icon="check-circle"
              variant="primary"
              size="small"
              disabled={sessionAllocations.length === 0}
              onClick={handleConfirmAllocation}
            />
          </ButtonPanel>
        </div>
      </Card>
    </Page>
  );
}
