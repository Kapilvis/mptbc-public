export interface PaperStock {
  id: number;
  gsm: number;
  paperType: "Text Paper" | "Cover Paper" | string;
  paperSpecification?: string;
  reelWidth: number;
  cutoff: number;
  sheetSize: string;
  openingStock: number;
  receivedQuantity: number;
  issuedQuantity: number;
  availableQuantity: number;
  unit: "MT";
  minimumStockLevel: number;
  maximumStockLevel: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
  dailyConsumption?: number;
  daysOfStock?: number;
}

export interface PaperReceipt {
  receiptNo: string;
  receiptDate: string;
  supplier: string;
  gsm: number;
  paperType: string;
  reelWidth: number;
  cutoff: number;
  quantity: number;
  unit: "MT";
  weightInMt: number;
  vehicleNo: string;
  challanNo: string;
  invoiceNo: string;
  remarks?: string;
}

export interface PrinterOrder {
  orderNo: string;
  orderDate: string;
  printer: string;
  printerCode: string;
  bookTitle?: string;
  classLevel?: string;
  subject?: string;
  gsm: number;
  paperType: string;
  requiredQty: number;
  approvedQty: number;
  suppliedQty: number;
  pendingQty: number;
  priority: "High" | "Medium" | "Low" | string;
  requiredByDate: string;
  status:
    | "Pending"
    | "Approved"
    | "Partially Supplied"
    | "Completed"
    | "Rejected"
    | "Cancelled";
  remarks?: string;
}

export interface PaperDistribution {
  distributionNo: string;
  distributionDate: string;
  printer: string;
  orderNo: string;
  gsm: number;
  paperType: string;
  availableStockAtIssue: number;
  approvedQty: number;
  previouslySupplied: number;
  pendingQty: number;
  issueQuantity: number;
  vehicleNo: string;
  driverName?: string;
  challanNo: string;
  dispatchDate: string;
  remarks?: string;
  status: "Dispatched" | "Delivered" | "Pending" | string;
}

export interface StockTransaction {
  id: number;
  date: string;
  transactionNo: string;
  gsm: number;
  type: "IN" | "OUT" | "OPENING" | "ADJUSTMENT" | "RETURN" | string;
  reference: string;
  quantity: number;
  balance: number;
  remarks?: string;
}
