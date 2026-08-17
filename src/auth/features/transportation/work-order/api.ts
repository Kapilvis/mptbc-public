import { mockWorkOrders, appendixDataIndore } from "./data";
import { mockTenders } from "../commercial-bid/data";
import { getTransporters } from "../../master/transporter-registration/api";

const workOrders = [...mockWorkOrders];

export async function getWorkOrders(): Promise<Transportation.WorkOrder[]> {
  return [...workOrders];
}

export async function createWorkOrder(
  data: Omit<
    Transportation.WorkOrder,
    "workOrderId" | "dueDate" | "status" | "transporterName" | "dispatches"
  >,
): Promise<Transportation.WorkOrder> {
  const tender = mockTenders.find((t) => t.district === data.district);
  if (!tender || !tender.allocatedTransporterId) {
    throw new Error(
      `No authorized Prime Bidder found for district "${data.district}". Please run L1 Selection first.`,
    );
  }

  const transporters = await getTransporters();
  const transporterName =
    transporters.find((t) => t.transporterId === tender.allocatedTransporterId)
      ?.transporterName || `Transporter #${tender.allocatedTransporterId}`;

  // Calculate SLA due date (instruction date + 3 days)
  const insDate = new Date(data.instructionDate);
  insDate.setDate(insDate.getDate() + 3);
  const dueDateStr = insDate.toISOString().split("T")[0];

  const prefix = data.district.slice(0, 3).toUpperCase();
  const suffix = Math.floor(100 + Math.random() * 900);
  const workOrderId = `WO-${prefix}-${suffix}`;

  const newWO: Transportation.WorkOrder = {
    ...data,
    workOrderId,
    dueDate: dueDateStr,
    status: "Pending Dispatch",
    allocatedTransporterId: tender.allocatedTransporterId,
    transporterName,
    dispatches: [],
  };

  workOrders.push(newWO);
  return newWO;
}

export async function importAppendixData(
  district: string,
): Promise<Transportation.WorkOrder[]> {
  const tender = mockTenders.find((t) => t.district === district);
  if (!tender || !tender.allocatedTransporterId) {
    throw new Error(
      `No authorized Prime Bidder found for district "${district}". Please run L1 Selection first.`,
    );
  }

  const transporters = await getTransporters();
  const transporterName =
    transporters.find((t) => t.transporterId === tender.allocatedTransporterId)
      ?.transporterName || `Transporter #${tender.allocatedTransporterId}`;

  const todayStr = new Date().toISOString().split("T")[0];
  const insDate = new Date();
  insDate.setDate(insDate.getDate() + 3);
  const dueDateStr = insDate.toISOString().split("T")[0];

  const importedList: Transportation.WorkOrder[] = [];

  const itemsToImport = district === "Indore" ? appendixDataIndore : [];

  for (const item of itemsToImport) {
    // Check if Indore block already has this work order to prevent duplicates in memory
    const exists = workOrders.some(
      (wo) => wo.district === district && wo.block === item.block,
    );
    if (exists) continue;

    const prefix = district.slice(0, 3).toUpperCase();
    const suffix = Math.floor(100 + Math.random() * 900);
    const workOrderId = `WO-${prefix}-${suffix}`;

    const newWO: Transportation.WorkOrder = {
      workOrderId,
      district,
      block: item.block,
      totalBundles: item.bundles,
      allocatedTransporterId: tender.allocatedTransporterId,
      transporterName,
      instructionDate: todayStr,
      dueDate: dueDateStr,
      status: "Pending Dispatch",
      nineTonTrucksRequired: item.nineTonTrucksRequired,
      fourPointFiveTonTrucksRequired: item.fourPointFiveTonTrucksRequired,
      dispatches: [],
    };

    workOrders.push(newWO);
    importedList.push(newWO);
  }

  return importedList;
}

// Global dispatcher helper (used in Page 8 to save dispatches)
export async function addDispatchToWorkOrder(
  workOrderId: string,
  dispatchData: Omit<
    Transportation.Dispatch,
    "dispatchId" | "status" | "podUploaded"
  >,
): Promise<Transportation.Dispatch> {
  const wo = workOrders.find((w) => w.workOrderId === workOrderId);
  if (!wo) throw new Error("Work order not found");

  if (!wo.dispatches) {
    wo.dispatches = [];
  }

  const suffix = Math.floor(100 + Math.random() * 900);
  const dispatchId = `DISP-${suffix}`;

  const newDispatch: Transportation.Dispatch = {
    ...dispatchData,
    dispatchId,
    status: "In Transit",
    podUploaded: false,
    billingStatus: "Pending",
  };

  wo.dispatches.push(newDispatch);
  wo.status = "In Transit"; // Update work order status to In Transit since it has active dispatches

  return newDispatch;
}

// Global POD uploader helper (used in Page 10 to save PODs)
export async function submitPodForDispatch(
  workOrderId: string,
  dispatchId: string,
  actualDeliveryDate: string,
  podFilePath: string,
): Promise<Transportation.Dispatch> {
  const wo = workOrders.find((w) => w.workOrderId === workOrderId);
  if (!wo) throw new Error("Work order not found");

  const dispatch = wo.dispatches?.find((d) => d.dispatchId === dispatchId);
  if (!dispatch) throw new Error("Dispatch not found");

  const insDate = new Date(wo.instructionDate);
  const actualDate = new Date(actualDeliveryDate);
  const diffTime = actualDate.getTime() - insDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // SLA is 3 days. Delay is any days beyond 3 days.
  const delayDays = Math.max(0, diffDays - 3);

  dispatch.status = "Delivered";
  dispatch.podUploaded = true;
  dispatch.podFilePath = podFilePath;
  dispatch.podSubmittedAt = new Date()
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
  dispatch.actualDeliveryDate = actualDeliveryDate;
  dispatch.deliveryDelayDays = delayDays;

  // If all dispatches for this work order are delivered, set work order to Delivered
  const allDelivered = wo.dispatches?.every((d) => d.status === "Delivered");
  if (allDelivered) {
    wo.status = "Delivered";
  }

  return dispatch;
}

export async function claimRunningBillAdvance(
  claims: { workOrderId: string; dispatchId: string }[],
): Promise<void> {
  for (const claim of claims) {
    const wo = workOrders.find((w) => w.workOrderId === claim.workOrderId);
    const d = wo?.dispatches?.find(
      (disp) => disp.dispatchId === claim.dispatchId,
    );
    if (d) {
      d.billingStatus = "Advance Claimed";
    }
  }
}

export async function claimFinalSettlement(
  claims: { workOrderId: string; dispatchId: string }[],
): Promise<void> {
  for (const claim of claims) {
    const wo = workOrders.find((w) => w.workOrderId === claim.workOrderId);
    const d = wo?.dispatches?.find(
      (disp) => disp.dispatchId === claim.dispatchId,
    );
    if (d) {
      d.billingStatus = "Final Settlement Claimed";
    }
  }
}

export async function approvePaymentClaim(
  claims: { workOrderId: string; dispatchId: string }[],
  action: "ApproveAdvance" | "ApproveFinal",
): Promise<void> {
  for (const claim of claims) {
    const wo = workOrders.find((w) => w.workOrderId === claim.workOrderId);
    const d = wo?.dispatches?.find(
      (disp) => disp.dispatchId === claim.dispatchId,
    );
    if (d) {
      if (action === "ApproveAdvance") {
        d.billingStatus = "Advance Paid";
      } else {
        d.billingStatus = "Settled";
      }
    }
  }
}

export async function resetAllBillingStatuses(): Promise<void> {
  workOrders.forEach((wo) => {
    wo.dispatches?.forEach((d) => {
      d.billingStatus = "Pending";
    });
  });
}
