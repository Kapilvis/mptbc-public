import { initialPrinterRegistrationListData } from "auth/features/printing/printer-registration/data";
import type {
  PaperStock,
  PrinterOrder,
  PaperDistribution,
} from "../../inventory/types";

// Unique storage keys for Paper Issue To Printer section
const ORDERS_KEY = "paper_issue_to_printer_orders_v3";
const DISTRIBUTIONS_KEY = "paper_issue_to_printer_distributions_v3";
const STOCKS_KEY = "paper_issue_to_printer_stocks_v3";

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

const initialOrders = (): PrinterOrder[] => [
  {
    orderNo: "ORD-2026-001",
    orderDate: "2026-08-18",
    printer: "MP Text Printers Bhopal",
    printerCode: "PRN-000122",
    bookTitle: "NCERT Hindi Vasant - Class 6",
    classLevel: "Class 6",
    subject: "Hindi",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 700,
    approvedQty: 700,
    suppliedQty: 600,
    pendingQty: 100,
    priority: "High",
    requiredByDate: "2026-09-15",
    status: "Partially Supplied",
    remarks: "Paper dispatch in progress.",
  },
  {
    orderNo: "ORD-2026-002",
    orderDate: "2026-08-18",
    printer: "Malwa Print Pack Indore",
    printerCode: "PRN-000125",
    bookTitle: "NCERT Mathematics - Class 7",
    classLevel: "Class 7",
    subject: "Mathematics",
    gsm: 80,
    paperType: "Text Paper",
    requiredQty: 550,
    approvedQty: 550,
    suppliedQty: 480,
    pendingQty: 70,
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
    requiredQty: 500,
    approvedQty: 500,
    suppliedQty: 450,
    pendingQty: 50,
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
    requiredQty: 450,
    approvedQty: 450,
    suppliedQty: 400,
    pendingQty: 50,
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
    requiredQty: 400,
    approvedQty: 400,
    suppliedQty: 350,
    pendingQty: 50,
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
    requiredQty: 400,
    approvedQty: 400,
    suppliedQty: 320,
    pendingQty: 80,
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
    requiredQty: 357,
    approvedQty: 357,
    suppliedQty: 300,
    pendingQty: 57,
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
    suppliedQty: 265,
    pendingQty: 85,
    priority: "Low",
    requiredByDate: "2026-09-25",
    status: "Partially Supplied",
    remarks: "Printing in progress for Khandwa Depot supply.",
  },
];

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
    issuedQuantity: 1900,
    availableQuantity: 330,
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
    issuedQuantity: 578,
    availableQuantity: 190,
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
    gsm: 60,
    paperType: "Text Paper",
    paperSpecification: "60 GSM Text Paper (Inner Pages)",
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    openingStock: 12,
    receivedQuantity: 600,
    issuedQuantity: 450,
    availableQuantity: 162,
    unit: "MT",
    dailyConsumption: 120,
    minimumStockLevel: 100,
    maximumStockLevel: 3000,
    daysOfStock: 1.35,
    stockStatus: "In Stock",
    lastUpdated: "2026-08-17 01:00 PM",
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
    approvedQty: 700,
    previouslySupplied: 0,
    pendingQty: 100,
    issueQuantity: 600,
    vehicleNo: "MP04HA7788",
    driverName: "Karan Johar",
    challanNo: "CH-PO-001",
    dispatchDate: "2026-08-18",
    status: "Dispatched",
  },
];

export const paperIssueDataManager = {
  getPrinterMasterList: () => initialPrinterRegistrationListData,
  getOrders: () => getStored<PrinterOrder[]>(ORDERS_KEY, initialOrders()),
  saveOrders: (orders: PrinterOrder[]) => setStored(ORDERS_KEY, orders),
  getStocks: () => getStored<PaperStock[]>(STOCKS_KEY, initialStock()),
  getDistributions: () =>
    getStored<PaperDistribution[]>(DISTRIBUTIONS_KEY, initialDistributions()),

  addDistribution: (dispatch: Partial<PaperDistribution>) => {
    const distributions = paperIssueDataManager.getDistributions();
    const newDist: PaperDistribution = {
      distributionNo: `DIS-2026-${String(distributions.length + 1).padStart(3, "0")}`,
      distributionDate:
        dispatch.distributionDate || new Date().toISOString().split("T")[0],
      printer: dispatch.printer || "",
      orderNo: dispatch.orderNo || "",
      gsm: dispatch.gsm || 80,
      paperType: dispatch.paperType || "Text Paper",
      availableStockAtIssue: dispatch.availableStockAtIssue || 0,
      approvedQty: dispatch.approvedQty || 0,
      previouslySupplied: dispatch.previouslySupplied || 0,
      pendingQty: dispatch.pendingQty || 0,
      issueQuantity: dispatch.issueQuantity || 0,
      vehicleNo: dispatch.vehicleNo || "",
      driverName: dispatch.driverName || "",
      challanNo: dispatch.challanNo || "",
      dispatchDate:
        dispatch.dispatchDate || new Date().toISOString().split("T")[0],
      status: dispatch.status || "Dispatched",
      remarks: dispatch.remarks,
    };

    distributions.push(newDist);
    setStored(DISTRIBUTIONS_KEY, distributions);

    // Update order state
    const orders = paperIssueDataManager.getOrders();
    const targetOrderIndex = orders.findIndex(
      (o) => o.orderNo === dispatch.orderNo,
    );
    if (targetOrderIndex !== -1) {
      const order = orders[targetOrderIndex];
      const newSupplied = order.suppliedQty + (dispatch.issueQuantity || 0);
      const newPending = Math.max(0, order.approvedQty - newSupplied);
      const newStatus = newPending <= 0 ? "Completed" : "Partially Supplied";

      orders[targetOrderIndex] = {
        ...order,
        suppliedQty: newSupplied,
        pendingQty: newPending,
        status: newStatus,
      };
      paperIssueDataManager.saveOrders(orders);
    }
    return newDist;
  },
  issuePaperToPrinter: (dispatch: Partial<PaperDistribution>) => {
    return paperIssueDataManager.addDistribution(dispatch);
  },
};
