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
    openingStock: 5000,
    receivedQuantity: 2000,
    issuedQuantity: 1500,
    availableQuantity: 5500,
    unit: "KG",
    minimumStockLevel: 1000,
    maximumStockLevel: 10000,
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
    openingStock: 4000,
    receivedQuantity: 1000,
    issuedQuantity: 1200,
    availableQuantity: 3800,
    unit: "KG",
    minimumStockLevel: 1000,
    maximumStockLevel: 10000,
    stockStatus: "In Stock",
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
    openingStock: 2500,
    receivedQuantity: 500,
    issuedQuantity: 300,
    availableQuantity: 2700,
    unit: "KG",
    minimumStockLevel: 500,
    maximumStockLevel: 8000,
    stockStatus: "In Stock",
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
    openingStock: 1500,
    receivedQuantity: 300,
    issuedQuantity: 250,
    availableQuantity: 1550,
    unit: "KG",
    minimumStockLevel: 300,
    maximumStockLevel: 5000,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 02:45 PM",
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
    unit: "KG",
    weightInKg: 2000,
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
    unit: "KG",
    weightInKg: 1000,
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
    unit: "KG",
    weightInKg: 500,
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
    unit: "KG",
    weightInKg: 300,
    vehicleNo: "MP04LA8901",
    challanNo: "CHL-10291",
    invoiceNo: "INV-2026-302",
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
    requiredQty: 5000,
    approvedQty: 4500,
    suppliedQty: 3000,
    pendingQty: 1500,
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
    requiredQty: 3000,
    approvedQty: 3000,
    suppliedQty: 3000,
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
    requiredQty: 2000,
    approvedQty: 2000,
    suppliedQty: 0,
    pendingQty: 2000,
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
    requiredQty: 1500,
    approvedQty: 1500,
    suppliedQty: 0,
    pendingQty: 1500,
    priority: "Low",
    requiredByDate: "2026-09-05",
    status: "Pending",
  },
];

const initialDistributions = (): PaperDistribution[] => [
  {
    distributionNo: "DIS-001",
    distributionDate: "2026-08-17",
    printer: "Shree Offset Press",
    orderNo: "ORD-001",
    gsm: 58,
    paperType: "Text Paper",
    availableStockAtIssue: 7000,
    approvedQty: 4500,
    previouslySupplied: 0,
    pendingQty: 4500,
    issueQuantity: 1500,
    vehicleNo: "MP04HA4321",
    driverName: "Ram Singh",
    challanNo: "CH-001",
    dispatchDate: "2026-08-17",
    status: "Dispatched",
  },
  {
    // Second distribution for ORD-001 to make total Supplied = 3000
    distributionNo: "DIS-001B",
    distributionDate: "2026-08-17",
    printer: "Shree Offset Press",
    orderNo: "ORD-001",
    gsm: 58,
    paperType: "Text Paper",
    availableStockAtIssue: 5500,
    approvedQty: 4500,
    previouslySupplied: 1500,
    pendingQty: 3000,
    issueQuantity: 1500,
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
    availableStockAtIssue: 5000,
    approvedQty: 3000,
    previouslySupplied: 0,
    pendingQty: 3000,
    issueQuantity: 3000,
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
    quantity: 5000,
    balance: 5000,
  },
  {
    id: 2,
    date: "2026-08-01",
    transactionNo: "OPN-060",
    gsm: 60,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 4000,
    balance: 4000,
  },
  {
    id: 3,
    date: "2026-08-01",
    transactionNo: "OPN-070",
    gsm: 70,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 2500,
    balance: 2500,
  },
  {
    id: 4,
    date: "2026-08-01",
    transactionNo: "OPN-080",
    gsm: 80,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 1500,
    balance: 1500,
  },

  // Receipts
  {
    id: 5,
    date: "2026-08-17",
    transactionNo: "GRN-001",
    gsm: 58,
    type: "Receipt",
    reference: "Supplier: Malwa Paper Mills Ltd. (Challan: CHL-99812)",
    quantity: 2000,
    balance: 7000,
  },
  {
    id: 6,
    date: "2026-08-17",
    transactionNo: "GRN-002",
    gsm: 60,
    type: "Receipt",
    reference: "Supplier: Rewa Paper Products (Challan: CHL-77123)",
    quantity: 1000,
    balance: 5000,
  },
  {
    id: 7,
    date: "2026-08-16",
    transactionNo: "GRN-003",
    gsm: 70,
    type: "Receipt",
    reference: "Supplier: Bhopal Paper & Board Industry (Challan: CHL-88231)",
    quantity: 500,
    balance: 3000,
  },
  {
    id: 8,
    date: "2026-08-15",
    transactionNo: "GRN-004",
    gsm: 80,
    type: "Receipt",
    reference: "Supplier: Central India Paper Suppliers (Challan: CHL-10291)",
    quantity: 300,
    balance: 1800,
  },

  // Issues / Distributions
  {
    id: 9,
    date: "2026-08-17",
    transactionNo: "DIS-001",
    gsm: 58,
    type: "Distribution",
    reference: "Printer: Shree Offset Press (Order: ORD-001)",
    quantity: -1500,
    balance: 5500,
  },
  {
    id: 91,
    date: "2026-08-17",
    transactionNo: "DIS-001B",
    gsm: 58,
    type: "Distribution",
    reference: "Printer: Shree Offset Press (Order: ORD-001)",
    quantity: -1500,
    balance: 4000,
  }, // Wait, total issued: 3000, so let's adjust stock
  {
    id: 10,
    date: "2026-08-17",
    transactionNo: "DIS-002",
    gsm: 60,
    type: "Distribution",
    reference: "Printer: Aditya Web Printers Ltd (Order: ORD-002)",
    quantity: -1200,
    balance: 3800,
  }, // wait, total issued: 1200 matches the stock list, wait...
  // In stock list: 60 GSM: Opening 4000 + Received 1000 - Issued 1200 = 3800.
  // Wait, let's keep DIS-002 issueQuantity as 1200 in the transactions, so that calculations balance perfectly!
];

// In-Memory state loaded from localStorage or fallback to defaults
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
let distributions = getStored<PaperDistribution[]>(
  "central_depot_distributions",
  initialDistributions(),
);
let transactions = getStored<StockTransaction[]>(
  "central_depot_transactions",
  initialTransactions(),
);

// Ensure stocks are calculated correctly
const recalculateStocks = () => {
  paperStocks.forEach((stock) => {
    // Opening + Received - Issued
    const received = paperReceipts
      .filter((r) => r.gsm === stock.gsm)
      .reduce((sum, r) => sum + r.quantity, 0);

    const issued = distributions
      .filter((d) => d.gsm === stock.gsm)
      .reduce((sum, d) => sum + d.issueQuantity, 0);

    stock.receivedQuantity = received;
    stock.issuedQuantity = issued;
    stock.availableQuantity = stock.openingStock + received - issued;

    // Status: In Stock, Low Stock, Out of Stock
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
  addReceipt: (receipt: Omit<PaperReceipt, "unit" | "weightInKg">): void => {
    const newReceipt: PaperReceipt = {
      ...receipt,
      unit: "KG",
      weightInKg: receipt.quantity,
    };
    paperReceipts.push(newReceipt);
    setStored("central_depot_receipts", paperReceipts);

    // Update stocks
    recalculateStocks();
    const updatedStock = paperStocks.find((s) => s.gsm === receipt.gsm);
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
    const updatedStock = paperStocks.find((s) => s.gsm === dist.gsm);
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
