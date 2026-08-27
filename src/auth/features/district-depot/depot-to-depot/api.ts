import {
  INITIAL_DEFICIT_DEPOTS,
  INITIAL_KPIS,
  INITIAL_SURPLUS_DEPOTS,
  INITIAL_TRANSFER_ORDERS,
} from "./data";
import type {
  DeficitDepotNeedItem,
  DepotToDepotKpis,
  InterDepotTransferOrder,
  SanctionTransferPayload,
  SurplusDepotStockItem,
} from "./data";

const deficitDepotsState: DeficitDepotNeedItem[] = [...INITIAL_DEFICIT_DEPOTS];
const surplusDepotsState: SurplusDepotStockItem[] = [...INITIAL_SURPLUS_DEPOTS];
let transferLedgerState: InterDepotTransferOrder[] = [
  ...INITIAL_TRANSFER_ORDERS,
];

export async function getDepotTransferKpis(): Promise<DepotToDepotKpis> {
  await new Promise((res) => setTimeout(res, 150));
  return {
    ...INITIAL_KPIS,
    activeTransfersCount: transferLedgerState.length,
  };
}

export async function getDeficitDepots(
  academicYear?: string,
): Promise<DeficitDepotNeedItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  if (!academicYear) return [...deficitDepotsState];
  return [...deficitDepotsState];
}

export async function getSurplusDepots(
  academicYear?: string,
): Promise<SurplusDepotStockItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  if (!academicYear) return [...surplusDepotsState];
  return [...surplusDepotsState];
}

export async function getTransferLedger(
  academicYear?: string,
): Promise<InterDepotTransferOrder[]> {
  await new Promise((res) => setTimeout(res, 200));
  if (!academicYear) return [...transferLedgerState];
  return [...transferLedgerState];
}

export async function sanctionInterDepotTransfer(
  payload: SanctionTransferPayload,
): Promise<InterDepotTransferOrder[]> {
  await new Promise((res) => setTimeout(res, 300));

  const targetDepot = deficitDepotsState.find(
    (d) => d.depotId === payload.targetDepotId,
  );
  const targetDepotName = targetDepot
    ? targetDepot.depotName
    : payload.targetDepotId;

  const createdOrders: InterDepotTransferOrder[] = [];
  const suffixes = ["A", "B", "C", "D", "E"];

  payload.sourceAllocations.forEach((alloc, idx) => {
    const sourceDepot = surplusDepotsState.find(
      (s) => s.depotId === alloc.sourceDepotId,
    );
    const sourceDepotName = sourceDepot
      ? sourceDepot.depotName
      : alloc.sourceDepotId;
    const suffix =
      payload.sourceAllocations.length > 1 ? `-${suffixes[idx]}` : "";

    const newOrder: InterDepotTransferOrder = {
      id: `TRSF-00${transferLedgerState.length + idx + 1}`,
      transferId: `DEP-TRSF-2026-${8800 + transferLedgerState.length + idx + 1}${suffix}`,
      financialYear: payload.academicYear || "2026-2027",
      sourceDepotId: alloc.sourceDepotId,
      sourceDepotName: sourceDepotName,
      targetDepotId: payload.targetDepotId,
      targetDepotName: targetDepotName,
      titleName: payload.titleName,
      classGroup: sourceDepot ? sourceDepot.classGroup : "Class 6 To 8",
      transferredQty: alloc.allocatedQty,
      transferReason:
        payload.transferReason ||
        "HO Inter-Depot Stock Optimization: Reallocating surplus stock to satisfy block deficit.",
      status: "APPROVED_SANCTIONED",
      transitVehicleNo: payload.transitVehicleNo || "MP-09-HH-4412",
      sanctionedBy: "General Manager (Operations) - HO",
      sanctionDate: new Date().toISOString().split("T")[0],
    };

    createdOrders.push(newOrder);
  });

  transferLedgerState = [...createdOrders, ...transferLedgerState];
  return createdOrders;
}
