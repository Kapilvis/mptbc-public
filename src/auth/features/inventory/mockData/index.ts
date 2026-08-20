import { mockGsms } from "auth/features/master/gsm/data";
import { initialPrinterRegistrationListData } from "auth/features/printing/printer-registration/data";
import type {
  PaperStock,
  PaperReceipt,
  PrinterOrder,
  PaperDistribution,
  StockTransaction,
} from "../types";

// Standard mock vendors
export const mockVendors = [
  { id: "VND-001", name: "Malwa Paper Mills Ltd." },
  { id: "VND-002", name: "Rewa Paper Products" },
  { id: "VND-003", name: "Bhopal Paper & Board Industry" },
  { id: "VND-004", name: "Central India Paper Suppliers" },
];

// Helper to load/save state
const getStored = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Data Setup
const initialStock = (): PaperStock[] => [
  {
    id: 1,
    gsm: 58,
    paperType: "Text Paper",
    paperSpecification: "58 GSM Text Paper",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 1500,
    receivedQuantity: 1200,
    issuedQuantity: 1050,
    availableQuantity: 150,
    unit: "MT",
    dailyConsumption: 350,
    minimumStockLevel: 200,
    maximumStockLevel: 5000,
    daysOfStock: 3.0,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 10:00 AM",
  },
  {
    id: 2,
    gsm: 60,
    paperType: "Text Paper",
    paperSpecification: "60 GSM Text Paper",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 1000,
    receivedQuantity: 900,
    issuedQuantity: 800,
    availableQuantity: 100,
    unit: "MT",
    dailyConsumption: 400,
    minimumStockLevel: 250,
    maximumStockLevel: 5000,
    daysOfStock: 2.0,
    stockStatus: "Low Stock",
    lastUpdated: "2026-08-17 11:30 AM",
  },
  {
    id: 3,
    gsm: 70,
    paperType: "Text Paper",
    paperSpecification: "70 GSM Text Paper",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 800,
    receivedQuantity: 665,
    issuedQuantity: 600,
    availableQuantity: 65,
    unit: "MT",
    dailyConsumption: 260,
    minimumStockLevel: 150,
    maximumStockLevel: 4000,
    daysOfStock: 2.3,
    stockStatus: "Low Stock",
    lastUpdated: "2026-08-17 12:15 PM",
  },
  {
    id: 4,
    gsm: 80,
    paperType: "Cover Paper",
    paperSpecification: "80 GSM Cover Paper",
    reelWidth: 84,
    cutoff: 560,
    sheetSize: "56 × 84",
    openingStock: 400,
    receivedQuantity: 400,
    issuedQuantity: 350,
    availableQuantity: 50,
    unit: "MT",
    dailyConsumption: 220,
    minimumStockLevel: 100,
    maximumStockLevel: 2000,
    daysOfStock: 1.6,
    stockStatus: "Low Stock",
    lastUpdated: "2026-08-17 02:45 PM",
  },
  {
    id: 5,
    gsm: 80,
    paperType: "Text Paper",
    paperSpecification: "80 GSM Text Paper",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 1000,
    receivedQuantity: 1000,
    issuedQuantity: 350,
    availableQuantity: 650,
    unit: "MT",
    dailyConsumption: 300,
    minimumStockLevel: 200,
    maximumStockLevel: 5000,
    daysOfStock: 3.2,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 03:00 PM",
  },
];

const initialReceipts = (): PaperReceipt[] => [
  {
    receiptNo: "GRN-001",
    receiptDate: "2026-08-17",
    supplier: "Malwa Paper Mills Ltd.",
    gsm: 58,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 2000,
    unit: "MT",
    weightInMt: 2000,
    vehicleNo: "MP04HE1234",
    challanNo: "CHL-99812",
    invoiceNo: "INV-2026-901",
    remarks: "Received in good condition",
  },
  {
    receiptNo: "GRN-002",
    receiptDate: "2026-08-17",
    supplier: "Rewa Paper Products",
    gsm: 60,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 1000,
    unit: "MT",
    weightInMt: 1000,
    vehicleNo: "MP09KJ8765",
    challanNo: "CHL-77123",
    invoiceNo: "INV-2026-102",
    remarks: "Moisture levels normal",
  },
  {
    receiptNo: "GRN-003",
    receiptDate: "2026-08-16",
    supplier: "Bhopal Paper & Board Industry",
    gsm: 70,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 500,
    unit: "MT",
    weightInMt: 500,
    vehicleNo: "MP04GA1212",
    challanNo: "CHL-88231",
    invoiceNo: "INV-2026-554",
  },
  {
    receiptNo: "GRN-004",
    receiptDate: "2026-08-15",
    supplier: "Central India Paper Suppliers",
    gsm: 80,
    paperType: "Cover Paper",
    reelWidth: 84,
    cutoff: 560,
    quantity: 300,
    unit: "MT",
    weightInMt: 300,
    vehicleNo: "MP04LA8901",
    challanNo: "CHL-10291",
    invoiceNo: "INV-2026-302",
  },
  {
    receiptNo: "GRN-005",
    receiptDate: "2026-08-17",
    supplier: "Malwa Paper Mills Ltd.",
    gsm: 80,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 1000,
    unit: "MT",
    weightInMt: 1000,
    vehicleNo: "MP04HE8877",
    challanNo: "CHL-99815",
    invoiceNo: "INV-2026-905",
    remarks: "Received 80 GSM Text Paper in good condition",
  },
];

const initialOrders = (): PrinterOrder[] => [
  {
    orderNo: "ORD-001",
    orderDate: "2026-08-17",
    printer: "Shree Offset Press",
    printerCode: "PRN-000124",
    bookTitle: "Hindi Reader Class 5",
    classLevel: "Class 5",
    subject: "Hindi",
    gsm: 58,
    paperType: "Text Paper",
    requiredQty: 600,
    approvedQty: 550,
    suppliedQty: 350,
    pendingQty: 200,
    priority: "High",
    requiredByDate: "2026-08-25",
    status: "Partially Supplied",
    remarks: "Required for first term books print run",
  },
  {
    orderNo: "ORD-002",
    orderDate: "2026-08-17",
    printer: "Aditya Web Printers Ltd",
    printerCode: "PRN-000125",
    bookTitle: "Mathematics Class 8",
    classLevel: "Class 8",
    subject: "Mathematics",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 300,
    approvedQty: 300,
    suppliedQty: 300,
    pendingQty: 0,
    priority: "Medium",
    requiredByDate: "2026-08-22",
    status: "Completed",
  },
  {
    orderNo: "ORD-003",
    orderDate: "2026-08-16",
    printer: "Capital Book Printers",
    printerCode: "PRN-000126",
    bookTitle: "General Science Class 6",
    classLevel: "Class 6",
    subject: "Science",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 200,
    approvedQty: 200,
    suppliedQty: 0,
    pendingQty: 200,
    priority: "High",
    requiredByDate: "2026-08-28",
    status: "Approved",
  },
  {
    orderNo: "ORD-004",
    orderDate: "2026-08-15",
    printer: "Gwalior Text Offset Printers",
    printerCode: "PRN-000128",
    bookTitle: "Social Science Class 7",
    classLevel: "Class 7",
    subject: "Social Science",
    gsm: 80,
    paperType: "Cover Paper",
    requiredQty: 150,
    approvedQty: 150,
    suppliedQty: 0,
    pendingQty: 150,
    priority: "Low",
    requiredByDate: "2026-09-05",
    status: "Pending",
  },
  {
    orderNo: "PO-2026-001",
    orderDate: "2026-08-12",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Mathematics Class 10",
    classLevel: "Class 10",
    subject: "Mathematics",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 300,
    approvedQty: 300,
    suppliedQty: 280,
    pendingQty: 20,
    priority: "High",
    requiredByDate: "2026-08-30",
    status: "Partially Supplied",
    remarks: "In Progress - Printing textbooks for secondary board exams.",
  },
  {
    orderNo: "PO-2026-002",
    orderDate: "2026-08-10",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Hindi Class 8",
    classLevel: "Class 8",
    subject: "Hindi",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 200,
    approvedQty: 200,
    suppliedQty: 200,
    pendingQty: 0,
    priority: "Medium",
    requiredByDate: "2026-08-25",
    status: "Completed",
    remarks: "Printing completed and all copies transferred to depot.",
  },
  {
    orderNo: "PO-2026-003",
    orderDate: "2026-08-05",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Science Class 9",
    classLevel: "Class 9",
    subject: "Science",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 400,
    approvedQty: 400,
    suppliedQty: 150,
    pendingQty: 250,
    priority: "High",
    requiredByDate: "2026-08-20",
    status: "Partially Supplied",
    remarks:
      "Urgent - In progress. Immediate dispatch needed for remaining paper.",
  },
  {
    orderNo: "PO-2026-004",
    orderDate: "2026-08-03",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "English Class 7",
    classLevel: "Class 7",
    subject: "English",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 200,
    approvedQty: 200,
    suppliedQty: 50,
    pendingQty: 150,
    priority: "Low",
    requiredByDate: "2026-08-28",
    status: "Partially Supplied",
    remarks: "Approved by corporation - printing started.",
  },
  {
    orderNo: "PO-2026-005",
    orderDate: "2026-08-15",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Social Science Class 6",
    classLevel: "Class 6",
    subject: "Social Science",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 200,
    approvedQty: 200,
    suppliedQty: 0,
    pendingQty: 200,
    priority: "Low",
    requiredByDate: "2026-09-10",
    status: "Pending",
    remarks: "Awaiting paper allocation from depot.",
  },
  {
    orderNo: "PO-2026-006",
    orderDate: "2026-08-01",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Sanskrit Class 8",
    classLevel: "Class 8",
    subject: "Sanskrit",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 150,
    approvedQty: 150,
    suppliedQty: 150,
    pendingQty: 0,
    priority: "Low",
    requiredByDate: "2026-08-15",
    status: "Completed",
  },
  {
    orderNo: "PO-2026-007",
    orderDate: "2026-07-25",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Science Class 10",
    classLevel: "Class 10",
    subject: "Science",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 352,
    approvedQty: 352,
    suppliedQty: 352,
    pendingQty: 0,
    priority: "High",
    requiredByDate: "2026-08-10",
    status: "Completed",
  },
  {
    orderNo: "PO-2026-008",
    orderDate: "2026-08-11",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Mathematics Class 9",
    classLevel: "Class 9",
    subject: "Mathematics",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 250,
    approvedQty: 250,
    suppliedQty: 100,
    pendingQty: 150,
    priority: "Medium",
    requiredByDate: "2026-09-05",
    status: "Partially Supplied",
  },
  {
    orderNo: "PO-2026-009",
    orderDate: "2026-08-12",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "English Class 6",
    classLevel: "Class 6",
    subject: "English",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 150,
    approvedQty: 150,
    suppliedQty: 100,
    pendingQty: 50,
    priority: "Medium",
    requiredByDate: "2026-09-12",
    status: "Partially Supplied",
  },
  {
    orderNo: "PO-2026-010",
    orderDate: "2026-08-13",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Hindi Class 7",
    classLevel: "Class 7",
    subject: "Hindi",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 315,
    approvedQty: 315,
    suppliedQty: 100,
    pendingQty: 215,
    priority: "Medium",
    requiredByDate: "2026-09-15",
    status: "Partially Supplied",
  },
  {
    orderNo: "PO-2026-011",
    orderDate: "2026-08-14",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Social Science Class 9",
    classLevel: "Class 9",
    subject: "Social Science",
    gsm: 80,
    paperType: "Cover Paper",
    requiredQty: 250,
    approvedQty: 250,
    suppliedQty: 0,
    pendingQty: 250,
    priority: "Low",
    requiredByDate: "2026-09-20",
    status: "Approved",
  },
  {
    orderNo: "PO-2026-012",
    orderDate: "2026-08-15",
    printer: "ABC Printing Press",
    printerCode: "PRN-001",
    bookTitle: "Sanskrit Class 7",
    classLevel: "Class 7",
    subject: "Sanskrit",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 100,
    approvedQty: 100,
    suppliedQty: 0,
    pendingQty: 100,
    priority: "Low",
    requiredByDate: "2026-09-25",
    status: "Cancelled",
  },
];

const initialDistributions = (): PaperDistribution[] => [
  {
    distributionNo: "DIS-2026-001",
    distributionDate: "2026-08-13",
    printer: "ABC Printing Press",
    orderNo: "PO-2026-001",
    gsm: 80,
    paperType: "Text Paper",
    availableStockAtIssue: 400,
    approvedQty: 400,
    previouslySupplied: 0,
    pendingQty: 400,
    issueQuantity: 350,
    vehicleNo: "MP04HA7788",
    driverName: "Karan Johar",
    challanNo: "CH-PO-001",
    dispatchDate: "2026-08-13",
    status: "Delivered",
  },
  {
    distributionNo: "DIS-2026-002",
    distributionDate: "2026-08-11",
    printer: "ABC Printing Press",
    orderNo: "PO-2026-002",
    gsm: 70,
    paperType: "Text Paper",
    availableStockAtIssue: 800,
    approvedQty: 665,
    previouslySupplied: 0,
    pendingQty: 665,
    issueQuantity: 600,
    vehicleNo: "MP04HA9911",
    driverName: "Sohan Lal",
    challanNo: "CH-PO-002",
    dispatchDate: "2026-08-11",
    status: "Delivered",
  },
  {
    distributionNo: "DIS-001",
    distributionDate: "2026-08-17",
    printer: "Shree Offset Press",
    orderNo: "ORD-001",
    gsm: 58,
    paperType: "Text Paper",
    availableStockAtIssue: 1500,
    approvedQty: 1200,
    previouslySupplied: 0,
    pendingQty: 1200,
    issueQuantity: 500,
    vehicleNo: "MP04HA4321",
    driverName: "Ram Singh",
    challanNo: "CH-001",
    dispatchDate: "2026-08-17",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-001B",
    distributionDate: "2026-08-17",
    printer: "Shree Offset Press",
    orderNo: "ORD-001",
    gsm: 58,
    paperType: "Text Paper",
    availableStockAtIssue: 1000,
    approvedQty: 1200,
    previouslySupplied: 500,
    pendingQty: 700,
    issueQuantity: 550,
    vehicleNo: "MP04HA9999",
    driverName: "Hari Prasad",
    challanNo: "CH-001B",
    dispatchDate: "2026-08-17",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-002",
    distributionDate: "2026-08-17",
    printer: "Aditya Web Printers Ltd",
    orderNo: "ORD-002",
    gsm: 60,
    paperType: "Text Paper",
    availableStockAtIssue: 1000,
    approvedQty: 900,
    previouslySupplied: 0,
    pendingQty: 900,
    issueQuantity: 800,
    vehicleNo: "MP09KL4321",
    driverName: "Shyam Lal",
    challanNo: "CH-002",
    dispatchDate: "2026-08-17",
    status: "Dispatched",
  },
];

const initialTransactions = (): StockTransaction[] => [
  // Opening stock transactions
  {
    id: 1,
    date: "2026-08-01",
    transactionNo: "OPN-058",
    gsm: 58,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 1500,
    balance: 1500,
  },
  {
    id: 2,
    date: "2026-08-01",
    transactionNo: "OPN-060",
    gsm: 60,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 1000,
    balance: 1000,
  },
  {
    id: 3,
    date: "2026-08-01",
    transactionNo: "OPN-070",
    gsm: 70,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 800,
    balance: 800,
  },
  {
    id: 4,
    date: "2026-08-01",
    transactionNo: "OPN-080",
    gsm: 80,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 400,
    balance: 400,
  },

  // Receipts
  {
    id: 5,
    date: "2026-08-17",
    transactionNo: "GRN-001",
    gsm: 58,
    type: "Receipt",
    reference: "Supplier: Malwa Paper Mills Ltd. (Challan: CHL-99812)",
    quantity: 1200,
    balance: 2700,
  },
  {
    id: 6,
    date: "2026-08-17",
    transactionNo: "GRN-002",
    gsm: 60,
    type: "Receipt",
    reference: "Supplier: Rewa Paper Products (Challan: CHL-77123)",
    quantity: 900,
    balance: 1900,
  },
  {
    id: 7,
    date: "2026-08-16",
    transactionNo: "GRN-003",
    gsm: 70,
    type: "Receipt",
    reference: "Supplier: Bhopal Paper & Board Industry (Challan: CHL-88231)",
    quantity: 665,
    balance: 1465,
  },
  {
    id: 8,
    date: "2026-08-15",
    transactionNo: "GRN-004",
    gsm: 80,
    type: "Receipt",
    reference: "Supplier: Central India Paper Suppliers (Challan: CHL-10291)",
    quantity: 400,
    balance: 800,
  },

  // Issues / Distributions
  {
    id: 9,
    date: "2026-08-17",
    transactionNo: "DIS-001",
    gsm: 58,
    type: "Distribution",
    reference: "Printer: Shree Offset Press (Order: ORD-001)",
    quantity: -550,
    balance: 2150,
  },
  {
    id: 91,
    date: "2026-08-17",
    transactionNo: "DIS-001B",
    gsm: 58,
    type: "Distribution",
    reference: "Printer: Shree Offset Press (Order: ORD-001)",
    quantity: -500,
    balance: 1650,
  },
  {
    id: 10,
    date: "2026-08-17",
    transactionNo: "DIS-002",
    gsm: 60,
    type: "Distribution",
    reference: "Printer: Aditya Web Printers Ltd (Order: ORD-002)",
    quantity: -800,
    balance: 1100,
  },
  {
    id: 11,
    date: "2026-08-16",
    transactionNo: "DIS-003",
    gsm: 70,
    type: "Distribution",
    reference: "Printer: Shree Offset Press (Order: ORD-003)",
    quantity: -600,
    balance: 865,
  },
  {
    id: 12,
    date: "2026-08-15",
    transactionNo: "DIS-004",
    gsm: 80,
    type: "Distribution",
    reference: "Printer: Aditya Web Printers Ltd (Order: ORD-004)",
    quantity: -350,
    balance: 450,
  },
  {
    id: 13,
    date: "2026-08-01",
    transactionNo: "OPN-080T",
    gsm: 80,
    type: "Opening",
    reference: "Opening Balance (Text Paper)",
    quantity: 1000,
    balance: 1000,
  },
  {
    id: 14,
    date: "2026-08-17",
    transactionNo: "GRN-005",
    gsm: 80,
    type: "Receipt",
    reference: "Supplier: Malwa Paper Mills Ltd. (Challan: CHL-99815)",
    quantity: 1000,
    balance: 2000,
  },
];

// In-Memory state loaded from localStorage or fallback to defaults
const initialDists = initialDistributions();
let storedDists = getStored<PaperDistribution[]>(
  "central_depot_distributions",
  initialDists,
);

// If stored data has old out-of-bounds mock data, clear localStorage
if (!localStorage.getItem("central_depot_data_v8")) {
  localStorage.removeItem("central_depot_stocks");
  localStorage.removeItem("central_depot_receipts");
  localStorage.removeItem("central_depot_orders");
  localStorage.removeItem("central_depot_distributions");
  localStorage.removeItem("central_depot_transactions");
  localStorage.removeItem("central_depot_low_stock_v6");
  localStorage.setItem("central_depot_data_v8", "true");
  storedDists = initialDists;
}

let paperStocks = getStored<PaperStock[]>(
  "central_depot_stocks",
  initialStock(),
);
let paperReceipts = getStored<PaperReceipt[]>(
  "central_depot_receipts",
  initialReceipts(),
);
let printerOrders = getStored<PrinterOrder[]>(
  "central_depot_orders",
  initialOrders(),
);
let distributions = storedDists;
let transactions = getStored<StockTransaction[]>(
  "central_depot_transactions",
  initialTransactions(),
);

// Ensure stocks are calculated correctly
const recalculateStocks = (): void => {
  paperStocks.forEach((stock) => {
    const received = paperReceipts
      .filter((r) => r.gsm === stock.gsm && r.paperType === stock.paperType)
      .reduce((sum, r) => sum + r.quantity, 0);

    const issued = distributions
      .filter((d) => d.gsm === stock.gsm && d.paperType === stock.paperType)
      .reduce((sum, d) => sum + d.issueQuantity, 0);

    stock.receivedQuantity = received;
    stock.issuedQuantity = issued;
    stock.availableQuantity = stock.openingStock + received - issued;

    if (stock.availableQuantity <= 0) {
      stock.stockStatus = "Out of Stock";
    } else if (stock.availableQuantity <= stock.minimumStockLevel) {
      stock.stockStatus = "Low Stock";
    } else {
      stock.stockStatus = "In Stock";
    }
  });
  setStored("central_depot_stocks", paperStocks);
};

// Auto-run on load
recalculateStocks();

export const dataManager = {
  getStocks: (): PaperStock[] => {
    recalculateStocks();
    return paperStocks;
  },

  getReceipts: (): PaperReceipt[] => {
    return paperReceipts;
  },

  getOrders: (): PrinterOrder[] => {
    return printerOrders;
  },

  getDistributions: (): PaperDistribution[] => {
    return distributions;
  },

  getTransactions: (): StockTransaction[] => {
    return transactions;
  },

  // Record a Paper Receipt (GRN)
  addReceipt: (receipt: Omit<PaperReceipt, "unit" | "weightInMt">): void => {
    const newReceipt: PaperReceipt = {
      ...receipt,
      unit: "MT",
      weightInMt: receipt.quantity,
    };
    paperReceipts.push(newReceipt);
    setStored("central_depot_receipts", paperReceipts);

    // Update stocks
    recalculateStocks();
    const updatedStock = paperStocks.find(
      (s) => s.gsm === receipt.gsm && s.paperType === receipt.paperType,
    );
    const balance = updatedStock
      ? updatedStock.availableQuantity
      : receipt.quantity;

    // Record Stock transaction
    const newTx: StockTransaction = {
      id: transactions.length + 1,
      date: receipt.receiptDate,
      transactionNo: receipt.receiptNo,
      gsm: receipt.gsm,
      type: "Receipt",
      reference: `Supplier: ${receipt.supplier} (Challan: ${receipt.challanNo})`,
      quantity: receipt.quantity,
      balance,
    };
    transactions.push(newTx);
    setStored("central_depot_transactions", transactions);
  },

  // Record a Distribution (Issue Paper)
  addDistribution: (dist: Omit<PaperDistribution, "status">): void => {
    const newDist: PaperDistribution = {
      ...dist,
      status: "Dispatched",
    };
    distributions.push(newDist);
    setStored("central_depot_distributions", distributions);

    // Update printer order supplied quantity & status
    const orderIndex = printerOrders.findIndex(
      (o) => o.orderNo === dist.orderNo,
    );
    if (orderIndex !== -1) {
      const order = printerOrders[orderIndex];
      order.suppliedQty += dist.issueQuantity;
      order.pendingQty = Math.max(0, order.approvedQty - order.suppliedQty);

      if (order.suppliedQty >= order.approvedQty) {
        order.status = "Completed";
      } else if (order.suppliedQty > 0) {
        order.status = "Partially Supplied";
      } else {
        order.status = "Pending";
      }
      setStored("central_depot_orders", printerOrders);
    }

    // Update stocks
    recalculateStocks();
    const updatedStock = paperStocks.find(
      (s) => s.gsm === dist.gsm && s.paperType === dist.paperType,
    );
    const balance = updatedStock ? updatedStock.availableQuantity : 0;

    // Record transaction
    const newTx: StockTransaction = {
      id: transactions.length + 1,
      date: dist.distributionDate,
      transactionNo: dist.distributionNo,
      gsm: dist.gsm,
      type: "Distribution",
      reference: `Printer: ${dist.printer} (Order: ${dist.orderNo})`,
      quantity: -dist.issueQuantity,
      balance,
    };
    transactions.push(newTx);
    setStored("central_depot_transactions", transactions);
  },

  // Record a Paper Issue to Printer with strict validations (Service Layer)
  issuePaperToPrinter: (dist: Omit<PaperDistribution, "status">): void => {
    // 1. Fetch approved paper requirement
    const orderIndex = printerOrders.findIndex(
      (o) => o.orderNo === dist.orderNo,
    );
    if (orderIndex === -1) {
      throw new Error(`Work order ${dist.orderNo} not found.`);
    }
    const order = printerOrders[orderIndex];
    const approvedQty = order.approvedQty;

    // 2. Calculate total paper already issued for this order
    const alreadyIssued = distributions
      .filter(
        (d) =>
          d.orderNo === dist.orderNo &&
          d.gsm === dist.gsm &&
          d.paperType === dist.paperType,
      )
      .reduce((sum, d) => sum + d.issueQuantity, 0);

    // 3. Calculate remaining requirement
    const remainingQty = approvedQty - alreadyIssued;

    // 4. Fetch current GSM-wise Central Depot stock
    const stock = paperStocks.find(
      (s) => s.gsm === dist.gsm && s.paperType === dist.paperType,
    );
    const availableStock = stock ? stock.availableQuantity : 0;

    const qtyToIssue = dist.issueQuantity;

    // 5. Validate requested issue quantity
    if (remainingQty <= 0) {
      throw new Error("This printing order is already fully issued.");
    }
    if (qtyToIssue > remainingQty) {
      throw new Error(
        `Issue quantity cannot exceed the remaining paper requirement of ${remainingQty.toLocaleString()} MT.`,
      );
    }
    if (qtyToIssue > availableStock) {
      throw new Error(
        `Only ${availableStock.toLocaleString()} MT is currently available in Central Depot stock.`,
      );
    }

    // 6. Perform the stock deduction and issue creation atomically/transactionally
    const newDist: PaperDistribution = {
      ...dist,
      status: "Dispatched",
    };
    distributions.push(newDist);
    setStored("central_depot_distributions", distributions);

    // Update printer order supplied quantity & status
    order.suppliedQty += qtyToIssue;
    order.pendingQty = Math.max(0, order.approvedQty - order.suppliedQty);

    if (order.suppliedQty >= order.approvedQty) {
      order.status = "Completed";
    } else if (order.suppliedQty > 0) {
      order.status = "Partially Supplied";
    } else {
      order.status = "Pending";
    }
    setStored("central_depot_orders", printerOrders);

    // Update stocks
    recalculateStocks();
    const updatedStock = paperStocks.find(
      (s) => s.gsm === dist.gsm && s.paperType === dist.paperType,
    );
    const balance = updatedStock ? updatedStock.availableQuantity : 0;

    // Record Stock Ledger transaction (ISSUE TO PRINTER)
    const newTx: StockTransaction = {
      id: transactions.length + 1,
      date: dist.distributionDate,
      transactionNo: dist.distributionNo,
      gsm: dist.gsm,
      type: "ISSUE TO PRINTER",
      reference: `Printer: ${dist.printer} (Order: ${dist.orderNo})`,
      quantity: -qtyToIssue,
      balance,
      remarks: dist.remarks,
    };
    transactions.push(newTx);
    setStored("central_depot_transactions", transactions);
  },

  // Reset data to initial mock settings
  resetData: () => {
    localStorage.removeItem("central_depot_stocks");
    localStorage.removeItem("central_depot_receipts");
    localStorage.removeItem("central_depot_orders");
    localStorage.removeItem("central_depot_distributions");
    localStorage.removeItem("central_depot_transactions");
    paperStocks = initialStock();
    paperReceipts = initialReceipts();
    printerOrders = initialOrders();
    distributions = initialDistributions();
    transactions = initialTransactions();
    recalculateStocks();
  },

  // Helper lists from existing master data
  getGsmMasterList: () => {
    return mockGsms.filter((g) => g.isActive);
  },

  getPrinterMasterList: () => {
    return initialPrinterRegistrationListData.filter(
      (p) => p.status === "Approved",
    );
  },

  getVendorMasterList: () => {
    return mockVendors;
  },
};
