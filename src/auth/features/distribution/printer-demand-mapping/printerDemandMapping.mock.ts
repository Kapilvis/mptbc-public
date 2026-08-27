import type {
  ApprovedTender,
  PrinterItem,
  Allocation,
  MappingHistoryItem,
  PrinterCapacityDetails,
  SavedOrder,
  OrderBookAllocation,
  OrderStatus,
  TitleWiseWorkSummary,
  PaperGsmSummary,
  WorkReAllocationRecord,
} from "./printerDemandMapping.types";

// Initial Approved Tenders Mock Data across 8 Depots (2026-2027 Total: 390,000 Approved - 30,500 Opening Stock = 359,500 Work Allocation)
const initialTenders: ApprovedTender[] = [
  {
    id: 1,
    tenderNo: "TN-2026-001",
    tenderDate: "2026-08-10",
    department: "CPI",
    district: "Bhopal",
    depot: "Bhopal",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 70000,
    totalOpeningStock: 5500,
    totalWorkAllocation: 64500,
    titles: [
      {
        bookCode: "BK-BPL-01",
        class: "Class 6",
        subject: "Hindi",
        bookName: "NCERT Hindi Vasant Bhag-1",
        approvedDemandQty: 35000,
        openingStock: 2750,
        workAllocationQty: 32250,
        requiredQty: 32250,
        coverGsm: 220,
        pageGsm: 80,
      },
      {
        bookCode: "BK-BPL-02",
        class: "Class 6",
        subject: "Mathematics",
        bookName: "NCERT Mathematics Ganit",
        approvedDemandQty: 35000,
        openingStock: 2750,
        workAllocationQty: 32250,
        requiredQty: 32250,
        coverGsm: 250,
        pageGsm: 80,
      },
    ],
  },
  {
    id: 2,
    tenderNo: "TN-2026-002",
    tenderDate: "2026-08-12",
    department: "RSK",
    district: "Indore",
    depot: "Indore",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 75000,
    totalOpeningStock: 6000,
    totalWorkAllocation: 69000,
    titles: [
      {
        bookCode: "BK-IND-01",
        class: "Class 7",
        subject: "English",
        bookName: "NCERT Honeycomb English",
        approvedDemandQty: 38000,
        openingStock: 3000,
        workAllocationQty: 35000,
        requiredQty: 35000,
        coverGsm: 200,
        pageGsm: 70,
      },
      {
        bookCode: "BK-IND-02",
        class: "Class 6",
        subject: "Science",
        bookName: "NCERT Science Textbook",
        approvedDemandQty: 37000,
        openingStock: 3000,
        workAllocationQty: 34000,
        requiredQty: 34000,
        coverGsm: 220,
        pageGsm: 70,
      },
    ],
  },
  {
    id: 3,
    tenderNo: "TN-2026-003",
    tenderDate: "2026-08-14",
    department: "RSK",
    district: "Jabalpur",
    depot: "Jabalpur",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 56000,
    totalOpeningStock: 4500,
    totalWorkAllocation: 51500,
    titles: [
      {
        bookCode: "BK-JBL-01",
        class: "Class 7",
        subject: "Hindi",
        bookName: "NCERT Hindi Durva",
        approvedDemandQty: 28000,
        openingStock: 2250,
        workAllocationQty: 25750,
        requiredQty: 25750,
        coverGsm: 170,
        pageGsm: 60,
      },
      {
        bookCode: "BK-JBL-02",
        class: "Class 8",
        subject: "Mathematics",
        bookName: "NCERT Mathematics Ganit",
        approvedDemandQty: 28000,
        openingStock: 2250,
        workAllocationQty: 25750,
        requiredQty: 25750,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  {
    id: 4,
    tenderNo: "TN-2026-004",
    tenderDate: "2026-08-15",
    department: "CPI",
    district: "Gwalior",
    depot: "Gwalior",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 52000,
    totalOpeningStock: 4000,
    totalWorkAllocation: 48000,
    titles: [
      {
        bookCode: "BK-GWL-01",
        class: "Class 9",
        subject: "Hindi",
        bookName: "NCERT Hindi Kritika Bhag-1",
        approvedDemandQty: 26000,
        openingStock: 2000,
        workAllocationQty: 24000,
        requiredQty: 24000,
        coverGsm: 170,
        pageGsm: 60,
      },
      {
        bookCode: "BK-GWL-02",
        class: "Class 9",
        subject: "Science",
        bookName: "NCERT Science Class 9",
        approvedDemandQty: 26000,
        openingStock: 2000,
        workAllocationQty: 24000,
        requiredQty: 24000,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  {
    id: 5,
    tenderNo: "TN-2026-005",
    tenderDate: "2026-08-16",
    department: "CPI",
    district: "Ujjain",
    depot: "Ujjain",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 43000,
    totalOpeningStock: 3500,
    totalWorkAllocation: 39500,
    titles: [
      {
        bookCode: "BK-UJN-01",
        class: "Class 6",
        subject: "Sanskrit",
        bookName: "NCERT Sanskrit Ruchira",
        approvedDemandQty: 21500,
        openingStock: 1750,
        workAllocationQty: 19750,
        requiredQty: 19750,
        coverGsm: 170,
        pageGsm: 60,
      },
      {
        bookCode: "BK-UJN-02",
        class: "Class 7",
        subject: "Sanskrit",
        bookName: "NCERT Sanskrit Ruchira Bhag-2",
        approvedDemandQty: 21500,
        openingStock: 1750,
        workAllocationQty: 19750,
        requiredQty: 19750,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  {
    id: 6,
    tenderNo: "TN-2026-006",
    tenderDate: "2026-08-17",
    department: "RSK",
    district: "Sagar",
    depot: "Sagar",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 36000,
    totalOpeningStock: 2500,
    totalWorkAllocation: 33500,
    titles: [
      {
        bookCode: "BK-SGR-01",
        class: "Class 9",
        subject: "Hindi",
        bookName: "NCERT Hindi Sparsh Bhag-1",
        approvedDemandQty: 18000,
        openingStock: 1250,
        workAllocationQty: 16750,
        requiredQty: 16750,
        coverGsm: 170,
        pageGsm: 60,
      },
      {
        bookCode: "BK-SGR-02",
        class: "Class 9",
        subject: "Social Science",
        bookName: "NCERT Social Science Class 9",
        approvedDemandQty: 18000,
        openingStock: 1250,
        workAllocationQty: 16750,
        requiredQty: 16750,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  {
    id: 7,
    tenderNo: "TN-2026-007",
    tenderDate: "2026-08-18",
    department: "RSK",
    district: "Rewa",
    depot: "Rewa",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 33000,
    totalOpeningStock: 2500,
    totalWorkAllocation: 30500,
    titles: [
      {
        bookCode: "BK-REW-01",
        class: "Class 10",
        subject: "Hindi",
        bookName: "NCERT Hindi Kshitij Bhag-2",
        approvedDemandQty: 16500,
        openingStock: 1250,
        workAllocationQty: 15250,
        requiredQty: 15250,
        coverGsm: 170,
        pageGsm: 60,
      },
      {
        bookCode: "BK-REW-02",
        class: "Class 10",
        subject: "Mathematics",
        bookName: "NCERT Mathematics Class 10",
        approvedDemandQty: 16500,
        openingStock: 1250,
        workAllocationQty: 15250,
        requiredQty: 15250,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  {
    id: 8,
    tenderNo: "TN-2026-008",
    tenderDate: "2026-08-19",
    department: "CPI",
    district: "Khandwa",
    depot: "Khandwa",
    academicYear: "2026-2027",
    status: "Approved",
    totalApprovedDemand: 25000,
    totalOpeningStock: 2000,
    totalWorkAllocation: 23000,
    titles: [
      {
        bookCode: "BK-KHD-01",
        class: "Class 6",
        subject: "Mathematics",
        bookName: "NCERT Mathematics Class 6",
        approvedDemandQty: 12500,
        openingStock: 1000,
        workAllocationQty: 11500,
        requiredQty: 11500,
        coverGsm: 170,
        pageGsm: 60,
      },
      {
        bookCode: "BK-KHD-02",
        class: "Class 5",
        subject: "Environmental Science",
        bookName: "NCERT Environmental Science",
        approvedDemandQty: 12500,
        openingStock: 1000,
        workAllocationQty: 11500,
        requiredQty: 11500,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  // Archived Tenders
  {
    id: 9,
    tenderNo: "TN-2025-001",
    tenderDate: "2025-08-15",
    department: "CPI",
    district: "Bhopal",
    depot: "Bhopal",
    academicYear: "2025-2026",
    status: "Approved",
    totalApprovedDemand: 350000,
    totalOpeningStock: 28000,
    totalWorkAllocation: 322000,
    titles: [
      {
        bookCode: "BK-OLD-01",
        class: "Class 8",
        subject: "Hindi",
        bookName: "भाषा भारती - Class 8",
        approvedDemandQty: 350000,
        openingStock: 28000,
        workAllocationQty: 322000,
        requiredQty: 322000,
      },
    ],
  },
];

// Initial registered active printers mock data
const initialPrinters: PrinterItem[] = [
  {
    printerCode: "PRN-001",
    printerName: "MP Text Printers Bhopal",
    category: "Category A",
    district: "Bhopal",
    approvedCapacity: 140000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000124",
    printerName: "Shree Ganesh Offset",
    category: "Category A",
    district: "Bhopal",
    approvedCapacity: 150000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000128",
    printerName: "Chambal Security Printers",
    category: "Category A",
    district: "Gwalior",
    approvedCapacity: 120000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000130",
    printerName: "Malwa Print Pack Indore",
    category: "Category A",
    district: "Indore",
    approvedCapacity: 150000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000133",
    printerName: "Mahakaushal Graphics Jabalpur",
    category: "Category A",
    district: "Jabalpur",
    approvedCapacity: 150000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000135",
    printerName: "Bundelkhand Offset Sagar",
    category: "Category A",
    district: "Sagar",
    approvedCapacity: 100000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000136",
    printerName: "Vindhya Offset Rewa",
    category: "Category A",
    district: "Rewa",
    approvedCapacity: 100000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000137",
    printerName: "Nimar Printers Khandwa",
    category: "Category A",
    district: "Khandwa",
    approvedCapacity: 100000,
    status: "Approved",
  },
];

// Seed initial allocations — grouped under orders (2026-2027 Sum: 359,500)
const initialAllocations: Allocation[] = [
  {
    tenderNo: "TN-2026-001",
    bookCode: "BK-BPL-01",
    printerCode: "PRN-001",
    quantity: 32250,
    mappingDate: "2026-08-18",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-15",
    orderNo: "ORD-2026-001",
    academicYear: "2026-2027",
    openingStock: 2750,
    approvedDemand: 35000,
  },
  {
    tenderNo: "TN-2026-001",
    bookCode: "BK-BPL-02",
    printerCode: "PRN-001",
    quantity: 32250,
    mappingDate: "2026-08-18",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-20",
    orderNo: "ORD-2026-001",
    academicYear: "2026-2027",
    openingStock: 2750,
    approvedDemand: 35000,
  },
  {
    tenderNo: "TN-2026-002",
    bookCode: "BK-IND-01",
    printerCode: "PRN-000130",
    quantity: 35000,
    mappingDate: "2026-08-18",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Indore",
    expectedCompletionDate: "2026-09-20",
    orderNo: "ORD-2026-002",
    academicYear: "2026-2027",
    openingStock: 3000,
    approvedDemand: 38000,
  },
  {
    tenderNo: "TN-2026-002",
    bookCode: "BK-IND-02",
    printerCode: "PRN-000130",
    quantity: 34000,
    mappingDate: "2026-08-18",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Indore",
    expectedCompletionDate: "2026-09-22",
    orderNo: "ORD-2026-002",
    academicYear: "2026-2027",
    openingStock: 3000,
    approvedDemand: 37000,
  },
  {
    tenderNo: "TN-2026-003",
    bookCode: "BK-JBL-01",
    printerCode: "PRN-000133",
    quantity: 25750,
    mappingDate: "2026-08-19",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Jabalpur",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-003",
    academicYear: "2026-2027",
    openingStock: 2250,
    approvedDemand: 28000,
  },
  {
    tenderNo: "TN-2026-003",
    bookCode: "BK-JBL-02",
    printerCode: "PRN-000133",
    quantity: 25750,
    mappingDate: "2026-08-19",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Jabalpur",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-003",
    academicYear: "2026-2027",
    openingStock: 2250,
    approvedDemand: 28000,
  },
  {
    tenderNo: "TN-2026-004",
    bookCode: "BK-GWL-01",
    printerCode: "PRN-000128",
    quantity: 24000,
    mappingDate: "2026-08-19",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Gwalior",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-004",
    academicYear: "2026-2027",
    openingStock: 2000,
    approvedDemand: 26000,
  },
  {
    tenderNo: "TN-2026-004",
    bookCode: "BK-GWL-02",
    printerCode: "PRN-000128",
    quantity: 24000,
    mappingDate: "2026-08-19",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Gwalior",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-004",
    academicYear: "2026-2027",
    openingStock: 2000,
    approvedDemand: 26000,
  },
  {
    tenderNo: "TN-2026-005",
    bookCode: "BK-UJN-01",
    printerCode: "PRN-000124",
    quantity: 19750,
    mappingDate: "2026-08-20",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Ujjain",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-005",
    academicYear: "2026-2027",
    openingStock: 1750,
    approvedDemand: 21500,
  },
  {
    tenderNo: "TN-2026-005",
    bookCode: "BK-UJN-02",
    printerCode: "PRN-000124",
    quantity: 19750,
    mappingDate: "2026-08-20",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Ujjain",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-005",
    academicYear: "2026-2027",
    openingStock: 1750,
    approvedDemand: 21500,
  },
  {
    tenderNo: "TN-2026-006",
    bookCode: "BK-SGR-01",
    printerCode: "PRN-000135",
    quantity: 16750,
    mappingDate: "2026-08-21",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Sagar",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-006",
    academicYear: "2026-2027",
    openingStock: 1250,
    approvedDemand: 18000,
  },
  {
    tenderNo: "TN-2026-006",
    bookCode: "BK-SGR-02",
    printerCode: "PRN-000135",
    quantity: 16750,
    mappingDate: "2026-08-21",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Sagar",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-006",
    academicYear: "2026-2027",
    openingStock: 1250,
    approvedDemand: 18000,
  },
  {
    tenderNo: "TN-2026-007",
    bookCode: "BK-REW-01",
    printerCode: "PRN-000136",
    quantity: 15250,
    mappingDate: "2026-08-22",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Rewa",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-007",
    academicYear: "2026-2027",
    openingStock: 1250,
    approvedDemand: 16500,
  },
  {
    tenderNo: "TN-2026-007",
    bookCode: "BK-REW-02",
    printerCode: "PRN-000136",
    quantity: 15250,
    mappingDate: "2026-08-22",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Rewa",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-007",
    academicYear: "2026-2027",
    openingStock: 1250,
    approvedDemand: 16500,
  },
  {
    tenderNo: "TN-2026-008",
    bookCode: "BK-KHD-01",
    printerCode: "PRN-000137",
    quantity: 11500,
    mappingDate: "2026-08-23",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Khandwa",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-008",
    academicYear: "2026-2027",
    openingStock: 1000,
    approvedDemand: 12500,
  },
  {
    tenderNo: "TN-2026-008",
    bookCode: "BK-KHD-02",
    printerCode: "PRN-000137",
    quantity: 11500,
    mappingDate: "2026-08-23",
    mappedBy: "Distribution Officer",
    deliveryDepot: "Khandwa",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-008",
    academicYear: "2026-2027",
    openingStock: 1000,
    approvedDemand: 12500,
  },
];

const initialHistory: MappingHistoryItem[] = [
  {
    mappingId: "MAP-10001",
    tenderNo: "TN-2026-001",
    printerName: "MP Text Printers Bhopal",
    printerCode: "PRN-001",
    bookName: "NCERT Hindi Vasant Bhag-1",
    bookCode: "BK-BPL-01",
    allocatedQty: 32250,
    mappingDate: "2026-08-18",
    mappedBy: "Distribution Officer",
    status: "Confirmed",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-15",
    orderNo: "ORD-2026-001",
    academicYear: "2026-2027",
  },
];

// Initial order statuses — keyed by orderNo
const initialOrderStatuses: Record<string, OrderStatus> = {
  "ORD-2026-001": "InProgress",
  "ORD-2026-002": "InProgress",
  "ORD-2026-003": "Completed",
  "ORD-2026-004": "InProgress",
  "ORD-2026-005": "InProgress",
  "ORD-2026-006": "InProgress",
  "ORD-2026-007": "InProgress",
  "ORD-2026-008": "InProgress",
};

// Initial re-allocation records
const initialReAllocations: WorkReAllocationRecord[] = [];

// Helper to interact with localStorage
const getStored = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getRawAllocations = (): Allocation[] => {
  return getStored<Allocation[]>(
    "mptbc_pwa_allocations_v10",
    initialAllocations,
  );
};

export const getRawHistory = (): MappingHistoryItem[] => {
  return getStored<MappingHistoryItem[]>(
    "mptbc_pwa_history_v10",
    initialHistory,
  );
};

export const getPrintersRaw = (): PrinterItem[] => {
  return getStored<PrinterItem[]>("mptbc_pwa_printers_v10", initialPrinters);
};

export const getTendersRaw = (): ApprovedTender[] => {
  return getStored<ApprovedTender[]>("mptbc_pwa_tenders_v10", initialTenders);
};

const getOrderStatuses = (): Record<string, OrderStatus> => {
  return getStored<Record<string, OrderStatus>>(
    "mptbc_pwa_statuses_v10",
    initialOrderStatuses,
  );
};

export const getRawReAllocations = (): WorkReAllocationRecord[] => {
  return getStored<WorkReAllocationRecord[]>(
    "mptbc_pwa_reallocations_v10",
    initialReAllocations,
  );
};

// Generate next order number
const getNextOrderNo = (): string => {
  const allocations = getRawAllocations();
  const existingOrders = new Set(
    allocations.map((a) => a.orderNo).filter(Boolean),
  );
  let idx = existingOrders.size + 1;
  let orderNo = `ORD-2026-${String(idx).padStart(3, "0")}`;
  while (existingOrders.has(orderNo)) {
    idx++;
    orderNo = `ORD-2026-${String(idx).padStart(3, "0")}`;
  }
  return orderNo;
};

// Generate next re-allocation ID
const getNextReAllocationId = (): string => {
  const records = getRawReAllocations();
  return `RA-2026-${String(records.length + 1).padStart(3, "0")}`;
};

// Main Exported Mock Database Controller
export const printerDemandMappingMock = {
  // Get all active tenders with derived allocation values and derived mapping status
  getDemandsList: (academicYear?: string) => {
    let tenders = getTendersRaw();
    if (academicYear) {
      tenders = tenders.filter((t) => t.academicYear === academicYear);
    }
    const allocations = getRawAllocations();

    return tenders.map((tender) => {
      let totalApprovedDemand = 0;
      let totalOpeningStock = 0;
      let totalWorkAllocation = 0;
      let totalAllocated = 0;

      const titlesWithAllocations = tender.titles.map((title) => {
        const titleAllocated = allocations
          .filter(
            (a) =>
              a.tenderNo === tender.tenderNo && a.bookCode === title.bookCode,
          )
          .reduce((sum, a) => sum + a.quantity, 0);

        const approvedQty = title.approvedDemandQty ?? title.requiredQty;
        const openingStock = title.openingStock ?? 0;
        const workAllocQty =
          title.workAllocationQty ?? approvedQty - openingStock;

        totalApprovedDemand += approvedQty;
        totalOpeningStock += openingStock;
        totalWorkAllocation += workAllocQty;
        totalAllocated += titleAllocated;

        return {
          ...title,
          approvedDemandQty: approvedQty,
          openingStock: openingStock,
          workAllocationQty: workAllocQty,
          allocatedQty: titleAllocated,
          remainingQty: Math.max(0, workAllocQty - titleAllocated),
        };
      });

      let mappingStatus: "Pending" | "Partially Mapped" | "Fully Mapped" =
        "Pending";
      if (totalAllocated === 0) {
        mappingStatus = "Pending";
      } else if (totalAllocated >= totalWorkAllocation) {
        mappingStatus = "Fully Mapped";
      } else {
        mappingStatus = "Partially Mapped";
      }

      return {
        ...tender,
        demandNo: tender.tenderNo,
        demandDate: tender.tenderDate,
        titles: titlesWithAllocations,
        totalTitles: tender.titles.length,
        totalApprovedDemand,
        totalOpeningStock,
        totalBooks: totalWorkAllocation, // Work allocation quantity to printer
        mappedBooks: totalAllocated,
        pendingBooks: Math.max(0, totalWorkAllocation - totalAllocated),
        mappingStatus,
      };
    });
  },

  // Get order-grouped list for the main grid
  getOrdersList: (academicYear?: string): SavedOrder[] => {
    let allocations = getRawAllocations();
    const tenders = getTendersRaw();
    const printers = getPrintersRaw();
    const statuses = getOrderStatuses();

    if (academicYear) {
      allocations = allocations.filter(
        (a) => (a.academicYear || "2026-2027") === academicYear,
      );
    }

    // Group allocations by orderNo
    const orderMap = new Map<string, Allocation[]>();
    for (const alloc of allocations) {
      if (!alloc.orderNo) continue;
      const existing = orderMap.get(alloc.orderNo) || [];
      existing.push(alloc);
      orderMap.set(alloc.orderNo, existing);
    }

    const orders: SavedOrder[] = [];
    for (const [orderNo, allocs] of orderMap.entries()) {
      const first = allocs[0];
      const tender = tenders.find((t) => t.tenderNo === first.tenderNo);
      const printer = printers.find((p) => p.printerCode === first.printerCode);

      // Calculate latest expected date
      const dates = allocs
        .map((a) => a.expectedCompletionDate)
        .filter(Boolean) as string[];
      const latestDate = dates.length > 0 ? dates.sort().reverse()[0] : "N/A";

      // Build book allocations
      let totalApproved = 0;
      let totalOpening = 0;

      const bookAllocations: OrderBookAllocation[] = allocs.map((a) => {
        const title = tender?.titles.find((t) => t.bookCode === a.bookCode);
        const approved =
          a.approvedDemand ?? title?.approvedDemandQty ?? a.quantity;
        const opening = a.openingStock ?? title?.openingStock ?? 0;

        totalApproved += approved;
        totalOpening += opening;

        return {
          bookCode: a.bookCode,
          bookName: title?.bookName || a.bookCode,
          allocatedQty: a.quantity,
          approvedDemandQty: approved,
          openingStock: opening,
        };
      });

      const totalQuantity = allocs.reduce((sum, a) => sum + a.quantity, 0);
      const status: OrderStatus = statuses[orderNo] ?? "InProgress";

      orders.push({
        orderNo,
        tenderNo: first.tenderNo,
        printerCode: first.printerCode,
        printerName: printer?.printerName || first.printerCode,
        deliveryDepot: first.deliveryDepot || tender?.depot || "N/A",
        expectedDeliveryDate: latestDate,
        mappingDate: first.mappingDate,
        mappedBy: first.mappedBy,
        academicYear: first.academicYear || tender?.academicYear || "2026-2027",
        approvedDemand: totalApproved,
        openingStock: totalOpening,
        workAllocation: totalQuantity,
        allocations: bookAllocations,
        totalQuantity,
        status,
      });
    }

    return orders;
  },

  // Get details for a specific order (for View Details modal)
  getOrderDetails: (
    orderNo: string,
  ): {
    order: SavedOrder | null;
    printerCapacity: PrinterCapacityDetails | null;
  } => {
    const orders = printerDemandMappingMock.getOrdersList();
    const order = orders.find((o) => o.orderNo === orderNo) || null;

    if (!order) return { order: null, printerCapacity: null };

    const capacityList = printerDemandMappingMock.getPrintersCapacityDetails();
    const printerCapacity =
      capacityList.find((p) => p.printerCode === order.printerCode) || null;

    return { order, printerCapacity };
  },

  // Get active printers with dynamically derived capacity details
  getPrintersCapacityDetails: (): PrinterCapacityDetails[] => {
    const printers = getPrintersRaw();
    const allocations = getRawAllocations();

    return printers
      .filter((p) => p.status === "Approved")
      .map((printer) => {
        const currentAllocated = allocations
          .filter((a) => a.printerCode === printer.printerCode)
          .reduce((sum, a) => sum + a.quantity, 0);

        return {
          printerCode: printer.printerCode,
          printerName: printer.printerName,
          category: printer.category,
          district: printer.district,
          approvedCapacity: printer.approvedCapacity,
          currentAllocated,
          availableCapacity: Math.max(
            0,
            printer.approvedCapacity - currentAllocated,
          ),
          status: printer.status,
        };
      });
  },

  // Fetch audit history for a specific tender
  getMappingHistory: (tenderNo: string): MappingHistoryItem[] => {
    const history = getRawHistory();
    return history.filter((h) => h.tenderNo === tenderNo);
  },

  // Get single tender details
  getDemandDetails: (tenderNo: string) => {
    const list = printerDemandMappingMock.getDemandsList();
    return list.find((d) => d.demandNo === tenderNo);
  },

  // Get title-wise work summary for an order (for Re-Allocation modal)
  getWorkSummaryForOrder: (orderNo: string): TitleWiseWorkSummary[] => {
    const orders = printerDemandMappingMock.getOrdersList();
    const order = orders.find((o) => o.orderNo === orderNo);
    if (!order) return [];

    return order.allocations.map((alloc) => {
      const printedPct = 0.5;
      const printed = Math.floor(alloc.allocatedQty * printedPct);
      const remaining = alloc.allocatedQty - printed;
      return {
        bookCode: alloc.bookCode,
        bookName: alloc.bookName,
        ordered: alloc.allocatedQty,
        printedAndDelivered: printed,
        remaining,
        depotName: order.deliveryDepot,
      };
    });
  },

  // Get GSM-wise paper summary for an order (for Re-Allocation modal)
  getGsmPaperSummaryForOrder: (orderNo: string): PaperGsmSummary[] => {
    const tenders = getTendersRaw();
    const allocations = getRawAllocations();

    const orderAllocs = allocations.filter((a) => a.orderNo === orderNo);
    if (orderAllocs.length === 0) return [];

    const tender = tenders.find((t) => t.tenderNo === orderAllocs[0].tenderNo);
    if (!tender) return [];

    // Aggregate by GSM
    const gsmMap = new Map<
      number,
      { coverQty: number; pageQty: number; pages: number }
    >();

    for (const alloc of orderAllocs) {
      const title = tender.titles.find((t) => t.bookCode === alloc.bookCode);
      if (!title) continue;

      const coverGsm = title.coverGsm ?? 200;
      const pageGsm = title.pageGsm ?? 70;
      const qty = alloc.quantity;
      const numPages = 200;

      const coverEntry = gsmMap.get(coverGsm) ?? {
        coverQty: 0,
        pageQty: 0,
        pages: 0,
      };
      coverEntry.coverQty += qty;
      gsmMap.set(coverGsm, coverEntry);

      const pageEntry = gsmMap.get(pageGsm) ?? {
        coverQty: 0,
        pageQty: 0,
        pages: 0,
      };
      pageEntry.pageQty += qty;
      pageEntry.pages += qty * numPages;
      gsmMap.set(pageGsm, pageEntry);
    }

    const result: PaperGsmSummary[] = [];
    for (const [gsm, data] of gsmMap.entries()) {
      const isCoverGsm = data.coverQty > 0 && data.pageQty === 0;
      const isPageGsm = data.pageQty > 0 && data.coverQty === 0;
      const isBoth = data.coverQty > 0 && data.pageQty > 0;

      const paperType = isBoth
        ? "Cover & Inner"
        : isCoverGsm
          ? "Cover"
          : isPageGsm
            ? "Inner Pages"
            : "Mixed";

      const coverMt = parseFloat((data.coverQty * 0.0015).toFixed(2));
      const pageMt = parseFloat((data.pageQty * 0.008).toFixed(2));
      const supplyIssued = parseFloat((coverMt + pageMt).toFixed(2));
      const paperSupply = parseFloat((supplyIssued * 1.05).toFixed(2));
      const used = parseFloat((supplyIssued * 0.65).toFixed(2));
      const wastage = parseFloat((used * 0.04).toFixed(2));
      const paperUsedInclWastage = parseFloat((used + wastage).toFixed(2));
      const paperStock = parseFloat(
        Math.max(0, paperSupply - paperUsedInclWastage).toFixed(2),
      );

      result.push({
        gsm,
        paperType,
        supplyIssued,
        paperSupply,
        paperUsedInclWastage,
        paperStock,
      });
    }

    return result;
  },

  // Save new allocations as a batch order
  saveAllocations: (
    items: Array<{
      tenderNo: string;
      bookCode: string;
      printerCode: string;
      quantity: number;
      deliveryDepot: string;
      expectedCompletionDate: string;
    }>,
  ): SavedOrder => {
    const allocations = getRawAllocations();
    const history = getRawHistory();
    const tenders = getTendersRaw();
    const printers = getPrintersRaw();
    const statuses = getOrderStatuses();

    const orderNo = getNextOrderNo();
    const today = new Date().toISOString().split("T")[0];

    const firstItem = items[0];
    const tender = tenders.find((t) => t.tenderNo === firstItem?.tenderNo);
    const printer = printers.find(
      (p) => p.printerCode === firstItem?.printerCode,
    );

    const dates = items
      .map((i) => i.expectedCompletionDate)
      .filter(Boolean) as string[];
    const latestDate = dates.length > 0 ? dates.sort().reverse()[0] : "N/A";

    const newAllocs: Allocation[] = items.map((item) => ({
      tenderNo: item.tenderNo,
      bookCode: item.bookCode,
      printerCode: item.printerCode,
      quantity: item.quantity,
      mappingDate: today,
      mappedBy: "Distribution Officer",
      deliveryDepot: item.deliveryDepot,
      expectedCompletionDate: item.expectedCompletionDate,
      orderNo,
      academicYear: tender?.academicYear || "2026-2027",
    }));

    const newHistoryItems: MappingHistoryItem[] = items.map((item, idx) => {
      const title = tender?.titles.find((t) => t.bookCode === item.bookCode);
      return {
        mappingId: `MAP-${Date.now()}-${idx + 1}`,
        tenderNo: item.tenderNo,
        printerName: printer?.printerName || item.printerCode,
        printerCode: item.printerCode,
        bookName: title?.bookName || item.bookCode,
        bookCode: item.bookCode,
        allocatedQty: item.quantity,
        mappingDate: today,
        mappedBy: "Distribution Officer",
        status: "Confirmed",
        deliveryDepot: item.deliveryDepot,
        expectedCompletionDate: item.expectedCompletionDate,
        orderNo,
        academicYear: tender?.academicYear || "2026-2027",
      };
    });

    const updatedAllocs = [...allocations, ...newAllocs];
    const updatedHistory = [...history, ...newHistoryItems];

    setStored("mptbc_pwa_allocations_v10", updatedAllocs);
    setStored("mptbc_pwa_history_v10", updatedHistory);

    statuses[orderNo] = "InProgress";
    setStored("mptbc_pwa_statuses_v10", statuses);

    const bookAllocations: OrderBookAllocation[] = items.map((i) => {
      const title = tender?.titles.find((t) => t.bookCode === i.bookCode);
      return {
        bookCode: i.bookCode,
        bookName: title?.bookName || i.bookCode,
        allocatedQty: i.quantity,
      };
    });

    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      orderNo,
      tenderNo: firstItem?.tenderNo || "",
      printerCode: firstItem?.printerCode || "",
      printerName: printer?.printerName || firstItem?.printerCode || "",
      deliveryDepot: firstItem?.deliveryDepot || "N/A",
      expectedDeliveryDate: latestDate,
      mappingDate: today,
      mappedBy: "Distribution Officer",
      academicYear: tender?.academicYear || "2026-2027",
      allocations: bookAllocations,
      totalQuantity,
      status: "InProgress",
    };
  },

  // Save work re-allocation
  saveWorkReAllocation: (
    originalOrderNo: string,
    newPrinterCode: string,
    reason: string,
    reAllocatedBooks: Array<{
      bookCode: string;
      reAllocatedQty: number;
      newExpectedDate: string;
      newDeliveryDepot: string;
    }>,
  ): { success: boolean; newOrderNo: string } => {
    const allocations = getRawAllocations();
    const history = getRawHistory();
    const printers = getPrintersRaw();
    const tenders = getTendersRaw();
    const statuses = getOrderStatuses();
    const reAllocRecords = getRawReAllocations();

    const originalAllocs = allocations.filter(
      (a) => a.orderNo === originalOrderNo,
    );
    if (originalAllocs.length === 0) {
      return { success: false, newOrderNo: "" };
    }

    const firstOrig = originalAllocs[0];
    const tender = tenders.find((t) => t.tenderNo === firstOrig.tenderNo);
    const newPrinter = printers.find((p) => p.printerCode === newPrinterCode);

    const newOrderNo = getNextOrderNo();
    const today = new Date().toISOString().split("T")[0];

    const newAllocs: Allocation[] = reAllocatedBooks.map((rb) => ({
      tenderNo: firstOrig.tenderNo,
      bookCode: rb.bookCode,
      printerCode: newPrinterCode,
      quantity: rb.reAllocatedQty,
      mappingDate: today,
      mappedBy: "Distribution Officer",
      deliveryDepot: rb.newDeliveryDepot,
      expectedCompletionDate: rb.newExpectedDate,
      orderNo: newOrderNo,
      academicYear:
        firstOrig.academicYear || tender?.academicYear || "2026-2027",
    }));

    const newHistoryItems: MappingHistoryItem[] = reAllocatedBooks.map(
      (rb, idx) => {
        const title = tender?.titles.find((t) => t.bookCode === rb.bookCode);
        return {
          mappingId: `MAP-${Date.now()}-${idx + 1}`,
          tenderNo: firstOrig.tenderNo,
          printerName: newPrinter?.printerName || newPrinterCode,
          printerCode: newPrinterCode,
          bookName: title?.bookName || rb.bookCode,
          bookCode: rb.bookCode,
          allocatedQty: rb.reAllocatedQty,
          mappingDate: today,
          mappedBy: "Distribution Officer",
          status: "Confirmed",
          deliveryDepot: rb.newDeliveryDepot,
          expectedCompletionDate: rb.newExpectedDate,
          orderNo: newOrderNo,
          academicYear:
            firstOrig.academicYear || tender?.academicYear || "2026-2027",
        };
      },
    );

    const updatedAllocs = [...allocations, ...newAllocs];
    const updatedHistory = [...history, ...newHistoryItems];

    setStored("mptbc_pwa_allocations_v10", updatedAllocs);
    setStored("mptbc_pwa_history_v10", updatedHistory);

    statuses[originalOrderNo] = "ReAllocated";
    statuses[newOrderNo] = "InProgress";
    setStored("mptbc_pwa_statuses_v10", statuses);

    const reAllocId = getNextReAllocationId();
    const newRecord: WorkReAllocationRecord = {
      reAllocationId: reAllocId,
      originalOrderNo,
      newOrderNo,
      reason,
      reallocatedBy: "Distribution Officer",
      reallocatedDate: today,
      status: "Confirmed",
    };
    setStored("mptbc_pwa_reallocations_v10", [...reAllocRecords, newRecord]);

    return { success: true, newOrderNo };
  },

  // Helper for Create page
  saveNewAllocations: (
    tenderNo: string,
    items: Array<{
      bookCode: string;
      printerCode: string;
      quantity: number;
      deliveryDepot: string;
      expectedCompletionDate: string;
    }>,
  ): { success: boolean; message: string; orderNo?: string } => {
    try {
      const saved = printerDemandMappingMock.saveAllocations(
        items.map((i) => ({
          tenderNo,
          ...i,
        })),
      );
      return {
        success: true,
        message: `Allocations successfully saved for Tender ${tenderNo}. Order ${saved.orderNo} created.`,
        orderNo: saved.orderNo,
      };
    } catch {
      return {
        success: false,
        message: "Failed to save printer work allocations.",
      };
    }
  },

  // Helper for Re-allocation Modal
  saveReAllocation: (
    orderNo: string,
    newPrinterCode: string,
    reason: string,
  ): { success: boolean; message: string; newOrderNo?: string } => {
    try {
      const allocations = getRawAllocations().filter(
        (a) => a.orderNo === orderNo,
      );
      if (allocations.length === 0) {
        return { success: false, message: `Order ${orderNo} not found.` };
      }
      const reAllocBooks = allocations.map((a) => ({
        bookCode: a.bookCode,
        reAllocatedQty: a.quantity,
        newExpectedDate: a.expectedCompletionDate || "",
        newDeliveryDepot: a.deliveryDepot || "",
      }));
      const res = printerDemandMappingMock.saveWorkReAllocation(
        orderNo,
        newPrinterCode,
        reason,
        reAllocBooks,
      );
      if (res.success) {
        return {
          success: true,
          message: `Work Order ${orderNo} successfully re-allocated to Printer ${newPrinterCode}. New Order: ${res.newOrderNo}`,
          newOrderNo: res.newOrderNo,
        };
      }
      return {
        success: false,
        message: "Re-allocation could not be completed.",
      };
    } catch {
      return { success: false, message: "Error during work re-allocation." };
    }
  },

  // Reset database to initial state
  resetAll: (): void => {
    localStorage.removeItem("mptbc_pwa_tenders_v10");
    localStorage.removeItem("mptbc_pwa_allocations_v10");
    localStorage.removeItem("mptbc_pwa_history_v10");
    localStorage.removeItem("mptbc_pwa_printers_v10");
    localStorage.removeItem("mptbc_pwa_statuses_v10");
    localStorage.removeItem("mptbc_pwa_reallocations_v10");
  },
};
