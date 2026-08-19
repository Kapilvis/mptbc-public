export interface TenderTitle {
  bookCode: string;
  class: string;
  subject: string;
  bookName: string;
  requiredQty: number;
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
}

export interface SavedOrder {
  orderNo: string;
  tenderNo: string;
  printerCode: string;
  printerName: string;
  deliveryDepot: string;
  expectedDeliveryDate: string;
  mappingDate: string;
  mappedBy: string;
  allocations: OrderBookAllocation[];
  totalQuantity: number;
}
