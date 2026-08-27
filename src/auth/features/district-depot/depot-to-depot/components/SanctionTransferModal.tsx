import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { DropDownList as SelectBox } from "shared/components/forms";
import InputBlock from "shared/components/forms/InputBlock";
import { Modal } from "shared/components/popups";
import type {
  DeficitDepotNeedItem,
  SanctionTransferPayload,
  SurplusDepotStockItem,
} from "../data";

interface SanctionTransferModalProps {
  visible: boolean;
  onHide: () => void;
  deficitList: DeficitDepotNeedItem[];
  surplusList: SurplusDepotStockItem[];
  initialDeficit?: DeficitDepotNeedItem | null;
  initialSurplus?: SurplusDepotStockItem | null;
  academicYear: string;
  onConfirm: (payload: SanctionTransferPayload) => void;
}

export function SanctionTransferModal({
  visible,
  onHide,
  deficitList,
  surplusList,
  initialDeficit,
  initialSurplus,
  academicYear,
  onConfirm,
}: SanctionTransferModalProps) {
  // Available textbook titles
  const titleOptions = Array.from(
    new Set([
      ...deficitList.map((d) => d.titleName),
      ...surplusList.map((s) => s.titleName),
    ]),
  ).map((t) => ({ label: t, value: t }));

  const [selectedTitle, setSelectedTitle] = useState<string>(
    titleOptions[0]?.value || "Class 8 Mathematics (Hindi)",
  );

  // Filtered Deficit Depots for selected title (Receiver - Single Select)
  const matchingDeficits = deficitList.filter(
    (d) => d.titleName === selectedTitle,
  );
  const targetDepotOptions = matchingDeficits.map((d) => ({
    label: `${d.depotName} (${d.division} Div) - Shortage: ${d.deficitQty.toLocaleString()} Copies`,
    value: d.depotId,
  }));

  const [selectedTargetDepotId, setSelectedTargetDepotId] = useState<string>(
    matchingDeficits[0]?.depotId || "",
  );

  // Filtered Surplus Depots for selected title (Sender - Multi Select)
  const matchingSurpluses = surplusList.filter(
    (s) => s.titleName === selectedTitle,
  );
  const sourceDepotOptions = matchingSurpluses.map((s) => ({
    label: `${s.depotName} (${s.division} Div) - Available Surplus: +${s.remainingStockQty.toLocaleString()} Copies`,
    value: s.depotId,
  }));

  const [selectedSourceDepotIds, setSelectedSourceDepotIds] = useState<
    string[]
  >([]);

  // Quantity Allocation state per selected source depot ID: string -> string or number
  const [sourceAllocations, setSourceAllocations] = useState<
    Record<string, string>
  >({});

  // Form Fields
  const [transitVehicleNo, setTransitVehicleNo] = useState("MP-09-HH-4412");
  const [transferReason, setTransferReason] = useState(
    "HO Inter-Depot Stock Optimization: Reallocating surplus stock to satisfy block deficit.",
  );

  // React to initial props & visibility
  useEffect(() => {
    if (!visible) return;

    if (initialDeficit) {
      setSelectedTitle(initialDeficit.titleName);
      setSelectedTargetDepotId(initialDeficit.depotId);
      const matchSurplus = surplusList.find(
        (s) => s.titleName === initialDeficit.titleName,
      );
      if (matchSurplus) {
        setSelectedSourceDepotIds([matchSurplus.depotId]);
        const alloc = Math.min(
          initialDeficit.deficitQty,
          matchSurplus.remainingStockQty,
        );
        setSourceAllocations({
          [matchSurplus.depotId]: String(alloc),
        });
      }
    } else if (initialSurplus) {
      setSelectedTitle(initialSurplus.titleName);
      setSelectedSourceDepotIds([initialSurplus.depotId]);
      const matchDeficit = deficitList.find(
        (d) => d.titleName === initialSurplus.titleName,
      );
      if (matchDeficit) {
        setSelectedTargetDepotId(matchDeficit.depotId);
        setSourceAllocations({
          [initialSurplus.depotId]: String(
            Math.min(matchDeficit.deficitQty, initialSurplus.remainingStockQty),
          ),
        });
      }
    } else {
      if (matchingDeficits.length > 0) {
        setSelectedTargetDepotId(matchingDeficits[0].depotId);
      }
      if (matchingSurpluses.length > 0) {
        setSelectedSourceDepotIds([matchingSurpluses[0].depotId]);
        setSourceAllocations({
          [matchingSurpluses[0].depotId]: String(
            matchingSurpluses[0].remainingStockQty,
          ),
        });
      }
    }
  }, [visible, initialDeficit, initialSurplus]);

  // Handle Textbook Title Change
  const handleTitleChange = (newTitle: string) => {
    setSelectedTitle(newTitle);
    const defs = deficitList.filter((d) => d.titleName === newTitle);
    const surs = surplusList.filter((s) => s.titleName === newTitle);

    if (defs.length > 0) {
      setSelectedTargetDepotId(defs[0].depotId);
    } else {
      setSelectedTargetDepotId("");
    }

    if (surs.length > 0) {
      setSelectedSourceDepotIds([surs[0].depotId]);
      setSourceAllocations({
        [surs[0].depotId]: String(surs[0].remainingStockQty),
      });
    } else {
      setSelectedSourceDepotIds([]);
      setSourceAllocations({});
    }
  };

  // Handle MultiSelect Source Depots Change
  const handleSourceDepotsChange = (newSourceIds: string[]) => {
    setSelectedSourceDepotIds(newSourceIds);
    const updatedAllocations: Record<string, string> = { ...sourceAllocations };

    // Initialize allocations for newly selected source depots
    newSourceIds.forEach((id) => {
      if (!(id in updatedAllocations)) {
        const surplus = surplusList.find((s) => s.depotId === id);
        updatedAllocations[id] = surplus
          ? String(surplus.remainingStockQty)
          : "0";
      }
    });

    // Remove unselected depot allocations
    Object.keys(updatedAllocations).forEach((id) => {
      if (!newSourceIds.includes(id)) {
        delete updatedAllocations[id];
      }
    });

    setSourceAllocations(updatedAllocations);
  };

  // Update allocation value for specific source depot
  const handleAllocationInputChange = (depotId: string, valueStr: string) => {
    setSourceAllocations((prev) => ({
      ...prev,
      [depotId]: valueStr,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetDepotId) {
      ToastService.error("Please select a Target (Deficit / Needing) Depot.");
      return;
    }
    if (selectedSourceDepotIds.length === 0) {
      ToastService.error(
        "Please select at least one Source (Surplus / Supplying) Depot.",
      );
      return;
    }

    // Validate allocations
    const finalAllocations: { sourceDepotId: string; allocatedQty: number }[] =
      [];

    for (const sourceId of selectedSourceDepotIds) {
      const valStr = sourceAllocations[sourceId] || "0";
      const valNum = Number(valStr);
      if (isNaN(valNum) || valNum <= 0) {
        const surplus = surplusList.find((s) => s.depotId === sourceId);
        ToastService.error(
          `Please enter a valid transfer quantity (> 0) for ${surplus?.depotName || sourceId}.`,
        );
        return;
      }
      finalAllocations.push({
        sourceDepotId: sourceId,
        allocatedQty: valNum,
      });
    }

    const payload: SanctionTransferPayload = {
      academicYear,
      titleName: selectedTitle,
      targetDepotId: selectedTargetDepotId,
      sourceAllocations: finalAllocations,
      transitVehicleNo,
      transferReason,
    };

    onConfirm(payload);
  };

  const selectedDeficitDepot = deficitList.find(
    (d) => d.depotId === selectedTargetDepotId,
  );

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Sanction HO Inter-Depot Stock Transfer"
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        {/* 1. SELECT TARGET TEXTBOOK TITLE */}
        <div>
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase block mb-1">
            1. SELECT TARGET TEXTBOOK TITLE{" "}
            <span className="text-red-500">*</span>
          </label>
          <SelectBox
            data={titleOptions}
            value={selectedTitle}
            onChange={(val) => handleTitleChange(String(val))}
            textField="label"
            optionValue="value"
          />
        </div>

        {/* IMAGE 1 RESTORED CARD LAYOUT: RED CARD (TARGET) & GREEN CARD (SOURCE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* RED CARD: 2. SELECT TARGET (DEFICIT / NEEDING) DEPOT */}
          <div className="p-3 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-3">
            <span className="text-xs font-black text-rose-950 dark:text-rose-200 uppercase tracking-wider block">
              2. SELECT TARGET (DEFICIT / NEEDING) DEPOT(S)
            </span>

            <div>
              <label className="text-[11px] font-bold text-rose-900 dark:text-rose-300 block mb-1">
                Target Receiver Depot <span className="text-red-500">*</span>
              </label>
              <SelectBox
                data={targetDepotOptions}
                value={selectedTargetDepotId}
                onChange={(val) => setSelectedTargetDepotId(String(val))}
                textField="label"
                optionValue="value"
              />
            </div>

            {selectedDeficitDepot && (
              <div className="p-2.5 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    {selectedDeficitDepot.depotName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {selectedDeficitDepot.division} Division
                  </span>
                </div>
                <span className="font-black text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2.5 py-1 rounded border border-rose-300 dark:border-rose-800">
                  -{selectedDeficitDepot.deficitQty.toLocaleString()} Needed
                </span>
              </div>
            )}
          </div>

          {/* GREEN CARD: 3. SELECT SOURCE (SURPLUS / SUPPYING) DEPOT(S) */}
          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
            <span className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider block">
              3. SELECT SOURCE (SURPLUS / SUPPYING) DEPOT(S)
            </span>

            {/* PRIMEREACT MULTISELECT (MATCHING WORKORDERFORMMODAL) */}
            <InputBlock
              label="Supplying Source Depot(s) (Multi-Select Senders)"
              required
            >
              <MultiSelect
                value={selectedSourceDepotIds}
                options={sourceDepotOptions}
                onChange={(e) => handleSourceDepotsChange(e.value || [])}
                optionLabel="label"
                optionValue="value"
                placeholder="Select Source Depot(s)"
                filter
                display="comma"
                className="w-full form-dropdown-input"
                panelClassName="form-dropdown-panel"
                appendTo={document.body}
              />
            </InputBlock>

            {/* DYNAMIC EDITABLE QUANTITY ALLOCATION INPUTS FOR SELECTED SOURCE DEPOTS */}
            {selectedSourceDepotIds.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 block">
                  Sender Stock Transfer Allocations:
                </span>
                {selectedSourceDepotIds.map((sourceId) => {
                  const surplus = surplusList.find(
                    (s) => s.depotId === sourceId,
                  );
                  if (!surplus) return null;
                  return (
                    <div
                      key={sourceId}
                      className="p-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {surplus.depotName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Surplus Available: +
                          {surplus.remainingStockQty.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-300">
                          Alloc:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={surplus.remainingStockQty}
                          value={sourceAllocations[sourceId] ?? ""}
                          onChange={(e) =>
                            handleAllocationInputChange(
                              sourceId,
                              e.target.value,
                            )
                          }
                          className="w-24 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-emerald-400 rounded-lg text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* TRANSIT VEHICLE NO & SANCTION REMARKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Transit Transport Vehicle Registration No{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={transitVehicleNo}
              onChange={(e) => setTransitVehicleNo(e.target.value)}
              required
              placeholder="e.g. MP-09-HH-4412"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              HO Order Sanction Justification / Remarks
            </label>
            <input
              type="text"
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder="Sanction remarks..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* INFORMATIONAL NOTE FOR MULTIPLE SENDERS */}
        {selectedSourceDepotIds.length > 1 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <i className="pi pi-[#006A38] pi-info-circle text-blue-600" />
            <span>
              Multiple supplying depots selected (
              {selectedSourceDepotIds.length} senders). System will generate{" "}
              <strong>
                {selectedSourceDepotIds.length} separate Gatepass Challans
              </strong>{" "}
              for each supplying depot.
            </span>
          </div>
        )}

        {/* MODAL FOOTER BUTTONS (IMAGE 1 STYLE) */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={onHide}
            type="button"
          />
          <Button
            label={`Confirm & Issue Gatepasses (${selectedSourceDepotIds.length || 1})`}
            icon="pi pi-check"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
}
