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
    gsm: 80,
    paperType: "Text Paper",
    paperSpecification: "80 GSM Text Paper (Inner Pages)",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 30,
    receivedQuantity: 2200,
    issuedQuantity: 1480,
    availableQuantity: 750,
    unit: "MT",
    dailyConsumption: 350,
    minimumStockLevel: 250,
    maximumStockLevel: 5000,
    daysOfStock: 2.1,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 11:30 AM",
  },
  {
    id: 2,
    gsm: 70,
    paperType: "Text Paper",
    paperSpecification: "70 GSM Text Paper (Inner Pages)",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 18,
    receivedQuantity: 750,
    issuedQuantity: 500,
    availableQuantity: 268,
    unit: "MT",
    dailyConsumption: 180,
    minimumStockLevel: 150,
    maximumStockLevel: 4000,
    daysOfStock: 1.5,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 12:15 PM",
  },
  {
    id: 3,
    gsm: 250,
    paperType: "Cover Paper",
    paperSpecification: "250 GSM Cover Paper (Book Covers)",
    reelWidth: 84,
    cutoff: 560,
    sheetSize: "56.0 × 84",
    openingStock: 12,
    receivedQuantity: 215,
    issuedQuantity: 145,
    availableQuantity: 82,
    unit: "MT",
    dailyConsumption: 50,
    minimumStockLevel: 40,
    maximumStockLevel: 1000,
    daysOfStock: 1.6,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 03:00 PM",
  },
];

const initialReceipts = (): PaperReceipt[] => [
  {
    receiptNo: "GRN-001",
    receiptDate: "2026-08-10",
    supplier: "Malwa Paper Mills Ltd.",
    gsm: 80,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 1250,
    unit: "MT",
    weightInMt: 1250,
    vehicleNo: "MP04HE1234",
    challanNo: "CHL-99812",
    invoiceNo: "INV-2026-901",
    remarks: "Received 80 GSM Text Paper in good condition",
  },
  {
    receiptNo: "GRN-002",
    receiptDate: "2026-08-12",
    supplier: "Rewa Paper Products",
    gsm: 80,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 950,
    unit: "MT",
    weightInMt: 950,
    vehicleNo: "MP09KJ8765",
    challanNo: "CHL-77123",
    invoiceNo: "INV-2026-102",
    remarks: "Moisture levels verified within standard tolerance",
  },
  {
    receiptNo: "GRN-003",
    receiptDate: "2026-08-15",
    supplier: "Bhopal Paper & Board Industry",
    gsm: 70,
    paperType: "Text Paper",
    reelWidth: 84,
    cutoff: 578,
    quantity: 750,
    unit: "MT",
    weightInMt: 750,
    vehicleNo: "MP04GA1212",
    challanNo: "CHL-88231",
    invoiceNo: "INV-2026-554",
    remarks: "70 GSM Text Paper reels batch accepted",
  },
  {
    receiptNo: "GRN-004",
    receiptDate: "2026-08-17",
    supplier: "Central India Paper Suppliers",
    gsm: 250,
    paperType: "Cover Paper",
    reelWidth: 84,
    cutoff: 560,
    quantity: 215,
    unit: "MT",
    weightInMt: 215,
    vehicleNo: "MP04LA8901",
    challanNo: "CHL-10291",
    invoiceNo: "INV-2026-302",
    remarks: "250 GSM Cover Paper reels received",
  },
];

const initialOrders = (): PrinterOrder[] => [
  {
    orderNo: "ORD-2026-001",
    orderDate: "2026-08-18",
    printer: "MP Text Printers Bhopal",
    printerCode: "PRN-001",
    bookTitle: "NCERT भाषा भारती (वसंत) - Class 6",
    classLevel: "Class 6",
    subject: "Hindi",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 600,
    approvedQty: 600,
    suppliedQty: 540,
    pendingQty: 60,
    priority: "High",
    requiredByDate: "2026-09-15",
    status: "Partially Supplied",
    remarks: "Printing in progress for Bhopal Depot supply.",
  },
  {
    orderNo: "ORD-2026-002",
    orderDate: "2026-08-18",
    printer: "Malwa Print Pack Indore",
    printerCode: "PRN-000130",
    bookTitle: "NCERT Honeycomb English - Class 7",
    classLevel: "Class 7",
    subject: "English",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 467,
    approvedQty: 467,
    suppliedQty: 425,
    pendingQty: 42,
    priority: "High",
    requiredByDate: "2026-09-20",
    status: "Partially Supplied",
    remarks: "Printing in progress for Indore Depot supply.",
  },
  {
    orderNo: "ORD-2026-003",
    orderDate: "2026-08-19",
    printer: "Mahakaushal Graphics Jabalpur",
    printerCode: "PRN-000133",
    bookTitle: "NCERT Hindi Durva - Class 7",
    classLevel: "Class 7",
    subject: "Hindi",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 520,
    approvedQty: 520,
    suppliedQty: 420,
    pendingQty: 100,
    priority: "Medium",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Jabalpur Depot supply.",
  },
  {
    orderNo: "ORD-2026-004",
    orderDate: "2026-08-19",
    printer: "Chambal Security Printers Gwalior",
    printerCode: "PRN-000128",
    bookTitle: "NCERT Hindi Kritika - Class 9",
    classLevel: "Class 9",
    subject: "Hindi",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 480,
    approvedQty: 480,
    suppliedQty: 380,
    pendingQty: 100,
    priority: "Medium",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Gwalior Depot supply.",
  },
  {
    orderNo: "ORD-2026-005",
    orderDate: "2026-08-20",
    printer: "Shree Ganesh Offset Ujjain",
    printerCode: "PRN-000124",
    bookTitle: "NCERT संस्कृत (रुचिरा) - Class 6",
    classLevel: "Class 6",
    subject: "Sanskrit",
    gsm: 70,
    paperType: "Text Paper",
    requiredQty: 500,
    approvedQty: 500,
    suppliedQty: 400,
    pendingQty: 100,
    priority: "Low",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Ujjain Depot supply.",
  },
  {
    orderNo: "ORD-2026-006",
    orderDate: "2026-08-21",
    printer: "Bundelkhand Offset Sagar",
    printerCode: "PRN-000135",
    bookTitle: "NCERT Hindi Sparsh - Class 9",
    classLevel: "Class 9",
    subject: "Hindi",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 450,
    approvedQty: 450,
    suppliedQty: 380,
    pendingQty: 70,
    priority: "Low",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Sagar Depot supply.",
  },
  {
    orderNo: "ORD-2026-007",
    orderDate: "2026-08-22",
    printer: "Vindhya Offset Rewa",
    printerCode: "PRN-000136",
    bookTitle: "NCERT Hindi Kshitij - Class 10",
    classLevel: "Class 10",
    subject: "Hindi",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 400,
    approvedQty: 400,
    suppliedQty: 340,
    pendingQty: 60,
    priority: "Low",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Rewa Depot supply.",
  },
  {
    orderNo: "ORD-2026-008",
    orderDate: "2026-08-23",
    printer: "Nimar Printers Khandwa",
    printerCode: "PRN-000137",
    bookTitle: "NCERT Mathematics - Class 6",
    classLevel: "Class 6",
    subject: "Mathematics",
    gsm: 60,
    paperType: "Text Paper",
    requiredQty: 350,
    approvedQty: 350,
    suppliedQty: 280,
    pendingQty: 70,
    priority: "Low",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Khandwa Depot supply.",
  },
];

const initialDistributions = (): PaperDistribution[] => [
  {
    distributionNo: "DIS-2026-001",
    distributionDate: "2026-08-18",
    printer: "MP Text Printers Bhopal",
    orderNo: "ORD-2026-001",
    gsm: 80,
    paperType: "Text Paper",
    availableStockAtIssue: 750,
    approvedQty: 600,
    previouslySupplied: 0,
    pendingQty: 60,
    issueQuantity: 540,
    vehicleNo: "MP04HA7788",
    driverName: "Karan Johar",
    challanNo: "CH-PO-001",
    dispatchDate: "2026-08-18",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-002",
    distributionDate: "2026-08-18",
    printer: "Malwa Print Pack Indore",
    orderNo: "ORD-2026-002",
    gsm: 80,
    paperType: "Text Paper",
    availableStockAtIssue: 750,
    approvedQty: 467,
    previouslySupplied: 0,
    pendingQty: 42,
    issueQuantity: 425,
    vehicleNo: "MP09HA9911",
    driverName: "Sohan Lal",
    challanNo: "CH-PO-002",
    dispatchDate: "2026-08-18",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-003",
    distributionDate: "2026-08-19",
    printer: "Mahakaushal Graphics Jabalpur",
    orderNo: "ORD-2026-003",
    gsm: 70,
    paperType: "Text Paper",
    availableStockAtIssue: 600,
    approvedQty: 520,
    previouslySupplied: 0,
    pendingQty: 100,
    issueQuantity: 420,
    vehicleNo: "MP20HA4321",
    driverName: "Ram Singh",
    challanNo: "CH-PO-003",
    dispatchDate: "2026-08-19",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-004",
    distributionDate: "2026-08-19",
    printer: "Chambal Security Printers Gwalior",
    orderNo: "ORD-2026-004",
    gsm: 70,
    paperType: "Text Paper",
    availableStockAtIssue: 600,
    approvedQty: 480,
    previouslySupplied: 0,
    pendingQty: 100,
    issueQuantity: 380,
    vehicleNo: "MP07HA9999",
    driverName: "Hari Prasad",
    challanNo: "CH-PO-004",
    dispatchDate: "2026-08-19",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-005",
    distributionDate: "2026-08-20",
    printer: "Shree Ganesh Offset Ujjain",
    orderNo: "ORD-2026-005",
    gsm: 70,
    paperType: "Text Paper",
    availableStockAtIssue: 600,
    approvedQty: 500,
    previouslySupplied: 0,
    pendingQty: 100,
    issueQuantity: 400,
    vehicleNo: "MP13KL4321",
    driverName: "Shyam Lal",
    challanNo: "CH-PO-005",
    dispatchDate: "2026-08-20",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-006",
    distributionDate: "2026-08-21",
    printer: "Bundelkhand Offset Sagar",
    orderNo: "ORD-2026-006",
    gsm: 60,
    paperType: "Text Paper",
    availableStockAtIssue: 500,
    approvedQty: 450,
    previouslySupplied: 0,
    pendingQty: 70,
    issueQuantity: 380,
    vehicleNo: "MP15HA3344",
    driverName: "Raju Verma",
    challanNo: "CH-PO-006",
    dispatchDate: "2026-08-21",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-007",
    distributionDate: "2026-08-22",
    printer: "Vindhya Offset Rewa",
    orderNo: "ORD-2026-007",
    gsm: 60,
    paperType: "Text Paper",
    availableStockAtIssue: 500,
    approvedQty: 400,
    previouslySupplied: 0,
    pendingQty: 60,
    issueQuantity: 340,
    vehicleNo: "MP17HA5566",
    driverName: "Manoj Singh",
    challanNo: "CH-PO-007",
    dispatchDate: "2026-08-22",
    status: "Dispatched",
  },
  {
    distributionNo: "DIS-2026-008",
    distributionDate: "2026-08-23",
    printer: "Nimar Printers Khandwa",
    orderNo: "ORD-2026-008",
    gsm: 60,
    paperType: "Text Paper",
    availableStockAtIssue: 500,
    approvedQty: 350,
    previouslySupplied: 0,
    pendingQty: 70,
    issueQuantity: 280,
    vehicleNo: "MP12HA7788",
    driverName: "Dinesh Patel",
    challanNo: "CH-PO-008",
    dispatchDate: "2026-08-23",
    status: "Dispatched",
  },
];

const initialTransactions = (): StockTransaction[] => [
  // 60 GSM
  {
    id: 1,
    date: "2026-08-01",
    transactionNo: "OPN-060",
    gsm: 60,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 20,
    balance: 20,
  },
  {
    id: 2,
    date: "2026-08-17",
    transactionNo: "GRN-002",
    gsm: 60,
    type: "Receipt",
    reference: "Supplier: Rewa Paper Products (Challan: CHL-77123)",
    quantity: 1180,
    balance: 1200,
  },
  {
    id: 3,
    date: "2026-08-17",
    transactionNo: "DIS-002",
    gsm: 60,
    type: "Distribution",
    reference: "Printer: Aditya Web Printers Ltd (Order: ORD-002)",
    quantity: -1000,
    balance: 200,
  },

  // 70 GSM
  {
    id: 4,
    date: "2026-08-01",
    transactionNo: "OPN-070",
    gsm: 70,
    type: "Opening",
    reference: "Opening Balance",
    quantity: 25,
    balance: 25,
  },
  {
    id: 5,
    date: "2026-08-16",
    transactionNo: "GRN-003",
    gsm: 70,
    type: "Receipt",
    reference: "Supplier: Bhopal Paper & Board Industry (Challan: CHL-88231)",
    quantity: 1475,
    balance: 1500,
  },
  {
    id: 6,
    date: "2026-08-16",
    transactionNo: "DIS-003",
    gsm: 70,
    type: "Distribution",
    reference: "Printer: Shree Offset Press (Order: ORD-003)",
    quantity: -1250,
    balance: 250,
  },

  // 80 GSM
  {
    id: 7,
    date: "2026-08-01",
    transactionNo: "OPN-080T",
    gsm: 80,
    type: "Opening",
    reference: "Opening Balance (Text Paper)",
    quantity: 15,
    balance: 15,
  },
  {
    id: 8,
    date: "2026-08-17",
    transactionNo: "GRN-005",
    gsm: 80,
    type: "Receipt",
    reference: "Supplier: Malwa Paper Mills Ltd. (Challan: CHL-99815)",
    quantity: 1052,
    balance: 1067,
  },
  {
    id: 9,
    date: "2026-08-15",
    transactionNo: "DIS-004",
    gsm: 80,
    type: "Distribution",
    reference: "Printer: Aditya Web Printers Ltd (Order: ORD-004)",
    quantity: -915,
    balance: 152,
  },
];

// In-Memory state loaded from localStorage or fallback to defaults
const initialDists = initialDistributions();
let storedDists = getStored<PaperDistribution[]>(
  "central_depot_distributions",
  initialDists,
);

// If stored data has old out-of-bounds mock data, clear localStorage
if (!localStorage.getItem("central_depot_data_v27")) {
  localStorage.removeItem("central_depot_stocks");
  localStorage.removeItem("central_depot_receipts");
  localStorage.removeItem("central_depot_orders");
  localStorage.removeItem("central_depot_distributions");
  localStorage.removeItem("central_depot_transactions");
  localStorage.removeItem("central_depot_low_stock_v6");
  localStorage.setItem("central_depot_data_v27", "true");
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
