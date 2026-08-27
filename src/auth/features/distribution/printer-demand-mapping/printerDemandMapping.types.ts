export interface TenderTitle {
  bookCode: string;
  class: string;
  subject: string;
  bookName: string;
  requiredQty: number;
  approvedDemandQty?: number;
  openingStock?: number;
  workAllocationQty?: number;
  coverGsm?: number;
  pageGsm?: number;
}

export interface ApprovedTender {
  id: number;
  tenderNo: string;
  tenderDate: string;
  department: string;
  district: string;
  depot: string;
  academicYear: string;
  status: "Approved" | "Pending" | "Rejected" | "Hold";
  totalApprovedDemand?: number;
  totalOpeningStock?: number;
  totalWorkAllocation?: number;
  titles: TenderTitle[];
}

export interface PrinterItem {
  printerCode: string;
  printerName: string;
  category: string;
  district: string;
  approvedCapacity: number;
  status: "Approved" | "Pending" | "Verified" | "Draft" | "Rejected";
}

export interface Allocation {
  tenderNo: string;
  bookCode: string;
  printerCode: string;
  quantity: number;
  mappingDate: string;
  mappedBy: string;
  deliveryDepot?: string;
  expectedCompletionDate?: string;
  orderNo?: string;
  academicYear?: string;
  openingStock?: number;
  approvedDemand?: number;
}

export interface MappingHistoryItem {
  mappingId: string;
  tenderNo: string;
  printerName: string;
  printerCode: string;
  bookName: string;
  bookCode: string;
  allocatedQty: number;
  mappingDate: string;
  mappedBy: string;
  status: string;
  deliveryDepot?: string;
  expectedCompletionDate?: string;
  orderNo?: string;
  academicYear?: string;
}

export interface PrinterCapacityDetails {
  printerCode: string;
  printerName: string;
  category: string;
  district: string;
  approvedCapacity: number;
  currentAllocated: number;
  availableCapacity: number;
  status: string;
}

// --- Order-level types for the main grid ---

export interface OrderBookAllocation {
  bookCode: string;
  bookName: string;
  allocatedQty: number;
  approvedDemandQty?: number;
  openingStock?: number;
}

export type OrderStatus =
  | "InProgress"
  | "Completed"
  | "ReAllocated"
  | "Cancelled";

export interface SavedOrder {
  orderNo: string;
  tenderNo: string;
  printerCode: string;
  printerName: string;
  deliveryDepot: string;
  expectedDeliveryDate: string;
  mappingDate: string;
  mappedBy: string;
  academicYear?: string;
  approvedDemand?: number;
  openingStock?: number;
  workAllocation?: number;
  allocations: OrderBookAllocation[];
  totalQuantity: number;
  status: OrderStatus;
}

// --- Re-Allocation types ---

export interface TitleWiseWorkSummary {
  bookCode: string;
  bookName: string;
  ordered: number;
  printedAndDelivered: number;
  remaining: number;
  depotName: string;
}

export interface PaperGsmSummary {
  gsm: number;
  paperType: string;
  supplyIssued: number;
  paperSupply: number;
  paperUsedInclWastage: number;
  paperStock: number;
}

export interface WorkReAllocationRecord {
  reAllocationId: string;
  originalOrderNo: string;
  newOrderNo: string;
  reason: string;
  reallocatedBy: string;
  reallocatedDate: string;
  status: "Confirmed";
}
