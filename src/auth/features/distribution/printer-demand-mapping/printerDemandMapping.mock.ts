import type {
  ApprovedTender,
  PrinterItem,
  Allocation,
  MappingHistoryItem,
  PrinterCapacityDetails,
  SavedOrder,
  OrderBookAllocation,
} from "./printerDemandMapping.types";

// Initial Approved Tenders Mock Data
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
    titles: [
      {
        bookCode: "BK-901",
        class: "Class 9",
        subject: "Accountancy",
        bookName: "पाठ्यपुस्तक / एकाउंटेन्सी (Part 1)",
        requiredQty: 100000,
        coverGsm: 220,
        pageGsm: 80,
      },
      {
        bookCode: "BK-902",
        class: "Class 10",
        subject: "Mathematics",
        bookName: "पाठ्यपुस्तक / गणित - Class 10",
        requiredQty: 150000,
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
    titles: [
      {
        bookCode: "BK-701",
        class: "Class 7",
        subject: "Social Science",
        bookName: "सामाजिक विज्ञान - Class 7",
        requiredQty: 80000,
        coverGsm: 200,
        pageGsm: 70,
      },
      {
        bookCode: "BK-801",
        class: "Class 8",
        subject: "Science",
        bookName: "विज्ञान - Class 8",
        requiredQty: 60000,
        coverGsm: 220,
        pageGsm: 70,
      },
    ],
  },
  {
    id: 3,
    tenderNo: "TN-2026-003",
    tenderDate: "2026-08-14",
    department: "CPI",
    district: "Gwalior",
    depot: "Gwalior",
    academicYear: "2026-2027",
    status: "Approved",
    titles: [
      {
        bookCode: "BK-101",
        class: "Class 1",
        subject: "English",
        bookName: "English Reader - Class 1",
        requiredQty: 50000,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
  {
    id: 4,
    tenderNo: "TN-2026-004",
    tenderDate: "2026-08-15",
    department: "RSK",
    district: "Jabalpur",
    depot: "Jabalpur",
    academicYear: "2026-2027",
    status: "Approved",
    titles: [
      {
        bookCode: "BK-601",
        class: "Class 6",
        subject: "Sanskrit",
        bookName: "संस्कृत भारती - Class 6",
        requiredQty: 45000,
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
    academicYear: "2025-2026",
    status: "Approved",
    titles: [
      {
        bookCode: "BK-501",
        class: "Class 5",
        subject: "Hindi",
        bookName: "भाषा भारती - Class 5",
        requiredQty: 30000,
        coverGsm: 170,
        pageGsm: 60,
      },
    ],
  },
];

// Initial registered active printers mock data
const initialPrinters: PrinterItem[] = [
  {
    printerCode: "PRN-001",
    printerName: "ABC Printing Press",
    category: "Category A",
    district: "Bhopal",
    approvedCapacity: 1000000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000124",
    printerName: "Shree Offset Press",
    category: "Category A",
    district: "Bhopal",
    approvedCapacity: 500000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000128",
    printerName: "Gwalior Text Offset Printers",
    category: "Category A",
    district: "Gwalior",
    approvedCapacity: 950000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000130",
    printerName: "National Offset & Packagers",
    category: "Category A",
    district: "Indore",
    approvedCapacity: 600000,
    status: "Approved",
  },
  {
    printerCode: "PRN-000133",
    printerName: "Narmada Printing Press",
    category: "Category A",
    district: "Jabalpur",
    approvedCapacity: 1100000,
    status: "Approved",
  },
];

// Seed initial allocations — grouped under orders
const initialAllocations: Allocation[] = [
  {
    tenderNo: "TN-2026-001",
    bookCode: "BK-901",
    printerCode: "PRN-001",
    quantity: 40000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-15",
    orderNo: "ORD-2026-001",
  },
  {
    tenderNo: "TN-2026-001",
    bookCode: "BK-902",
    printerCode: "PRN-001",
    quantity: 50000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-20",
    orderNo: "ORD-2026-001",
  },
  {
    tenderNo: "TN-2026-001",
    bookCode: "BK-902",
    printerCode: "PRN-000124",
    quantity: 100000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-10",
    orderNo: "ORD-2026-002",
  },
  {
    tenderNo: "TN-2026-002",
    bookCode: "BK-701",
    printerCode: "PRN-000130",
    quantity: 20000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    deliveryDepot: "Indore",
    expectedCompletionDate: "2026-09-20",
    orderNo: "ORD-2026-003",
  },
  {
    tenderNo: "TN-2026-001",
    bookCode: "BK-901",
    printerCode: "PRN-000128",
    quantity: 60000,
    mappingDate: "2026-08-19",
    mappedBy: "Admin User",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-004",
  },
  {
    tenderNo: "TN-2026-002",
    bookCode: "BK-701",
    printerCode: "PRN-000133",
    quantity: 60000,
    mappingDate: "2026-08-19",
    mappedBy: "Admin User",
    deliveryDepot: "Jabalpur",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-005",
  },
  {
    tenderNo: "TN-2026-002",
    bookCode: "BK-801",
    printerCode: "PRN-000133",
    quantity: 60000,
    mappingDate: "2026-08-19",
    mappedBy: "Admin User",
    deliveryDepot: "Jabalpur",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-005",
  },
];

const initialHistory: MappingHistoryItem[] = [
  {
    mappingId: "MAP-10001",
    tenderNo: "TN-2026-001",
    printerName: "ABC Printing Press",
    printerCode: "PRN-001",
    bookName: "पाठ्यपुस्तक / एकाउंटेन्सी (Part 1)",
    bookCode: "BK-901",
    allocatedQty: 40000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-15",
    orderNo: "ORD-2026-001",
  },
  {
    mappingId: "MAP-10002",
    tenderNo: "TN-2026-001",
    printerName: "ABC Printing Press",
    printerCode: "PRN-001",
    bookName: "पाठ्यपुस्तक / गणित - Class 10",
    bookCode: "BK-902",
    allocatedQty: 50000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-20",
    orderNo: "ORD-2026-001",
  },
  {
    mappingId: "MAP-10003",
    tenderNo: "TN-2026-001",
    printerName: "Shree Offset Press",
    printerCode: "PRN-000124",
    bookName: "पाठ्यपुस्तक / गणित - Class 10",
    bookCode: "BK-902",
    allocatedQty: 100000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-10",
    orderNo: "ORD-2026-002",
  },
  {
    mappingId: "MAP-10004",
    tenderNo: "TN-2026-002",
    printerName: "National Offset & Packagers",
    printerCode: "PRN-000130",
    bookName: "सामाजिक विज्ञान - Class 7",
    bookCode: "BK-701",
    allocatedQty: 20000,
    mappingDate: "2026-08-18",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Indore",
    expectedCompletionDate: "2026-09-20",
    orderNo: "ORD-2026-003",
  },
  {
    mappingId: "MAP-10005",
    tenderNo: "TN-2026-001",
    printerName: "Gwalior Text Offset Printers",
    printerCode: "PRN-000128",
    bookName: "पाठ्यपुस्तक / एकाउंटेन्सी (Part 1)",
    bookCode: "BK-901",
    allocatedQty: 60000,
    mappingDate: "2026-08-19",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Bhopal",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-004",
  },
  {
    mappingId: "MAP-10006",
    tenderNo: "TN-2026-002",
    printerName: "Narmada Printing Press",
    printerCode: "PRN-000133",
    bookName: "सामाजिक विज्ञान - Class 7",
    bookCode: "BK-701",
    allocatedQty: 60000,
    mappingDate: "2026-08-19",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Jabalpur",
    expectedCompletionDate: "2026-09-25",
    orderNo: "ORD-2026-005",
  },
  {
    mappingId: "MAP-10007",
    tenderNo: "TN-2026-002",
    printerName: "Narmada Printing Press",
    printerCode: "PRN-000133",
    bookName: "विज्ञान - Class 8",
    bookCode: "BK-801",
    allocatedQty: 60000,
    mappingDate: "2026-08-19",
    mappedBy: "Admin User",
    status: "Confirmed",
    deliveryDepot: "Jabalpur",
    expectedCompletionDate: "2026-09-28",
    orderNo: "ORD-2026-005",
  },
];

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
    "mptbc_pwa_allocations_v4",
    initialAllocations,
  );
};

export const getRawHistory = (): MappingHistoryItem[] => {
  return getStored<MappingHistoryItem[]>(
    "mptbc_pwa_history_v4",
    initialHistory,
  );
};

export const getPrintersRaw = (): PrinterItem[] => {
  return getStored<PrinterItem[]>("mptbc_pwa_printers_v4", initialPrinters);
};

export const getTendersRaw = (): ApprovedTender[] => {
  return getStored<ApprovedTender[]>("mptbc_pwa_tenders_v4", initialTenders);
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

// Main Exported Mock Database Controller
export const printerDemandMappingMock = {
  // Get all active tenders with derived allocation values and derived mapping status
  getDemandsList: () => {
    const tenders = getTendersRaw();
    const allocations = getRawAllocations();

    return tenders.map((tender) => {
      let totalRequired = 0;
      let totalAllocated = 0;

      const titlesWithAllocations = tender.titles.map((title) => {
        const titleAllocated = allocations
          .filter(
            (a) =>
              a.tenderNo === tender.tenderNo && a.bookCode === title.bookCode,
          )
          .reduce((sum, a) => sum + a.quantity, 0);

        totalRequired += title.requiredQty;
        totalAllocated += titleAllocated;

        return {
          ...title,
          allocatedQty: titleAllocated,
          remainingQty: Math.max(0, title.requiredQty - titleAllocated),
        };
      });

      let mappingStatus: "Pending" | "Partially Mapped" | "Fully Mapped" =
        "Pending";
      if (totalAllocated === 0) {
        mappingStatus = "Pending";
      } else if (totalAllocated >= totalRequired) {
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
        totalBooks: totalRequired,
        mappedBooks: totalAllocated,
        pendingBooks: Math.max(0, totalRequired - totalAllocated),
        mappingStatus,
      };
    });
  },

  // Get order-grouped list for the main grid
  getOrdersList: (): SavedOrder[] => {
    const allocations = getRawAllocations();
    const tenders = getTendersRaw();
    const printers = getPrintersRaw();

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
      const bookAllocations: OrderBookAllocation[] = allocs.map((a) => {
        const title = tender?.titles.find((t) => t.bookCode === a.bookCode);
        return {
          bookCode: a.bookCode,
          bookName: title?.bookName || a.bookCode,
          allocatedQty: a.quantity,
        };
      });

      const totalQuantity = allocs.reduce((sum, a) => sum + a.quantity, 0);

      orders.push({
        orderNo,
        tenderNo: first.tenderNo,
        printerCode: first.printerCode,
        printerName: printer?.printerName || first.printerCode,
        deliveryDepot: first.deliveryDepot || "N/A",
        expectedDeliveryDate: latestDate,
        mappingDate: first.mappingDate,
        mappedBy: first.mappedBy,
        allocations: bookAllocations,
        totalQuantity,
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

  // Save new allocations — auto-generates orderNo
  saveNewAllocations: (
    tenderNo: string,
    newAllocations: {
      bookCode: string;
      printerCode: string;
      quantity: number;
      deliveryDepot?: string;
      expectedCompletionDate?: string;
    }[],
    mappedBy: string = "Admin User",
  ): { success: boolean; message: string; orderNo?: string } => {
    const allocations = getRawAllocations();
    const history = getRawHistory();
    const tenders = getTendersRaw();
    const printers = getPrintersRaw();

    const tender = tenders.find((d) => d.tenderNo === tenderNo);
    if (!tender) {
      return { success: false, message: `Tender ${tenderNo} not found.` };
    }

    // Validate allocations
    for (const alloc of newAllocations) {
      if (alloc.quantity <= 0) {
        return {
          success: false,
          message: `Allocation quantity must be greater than zero.`,
        };
      }

      const title = tender.titles.find((t) => t.bookCode === alloc.bookCode);
      if (!title) {
        return {
          success: false,
          message: `Book Title with code ${alloc.bookCode} not found in this tender.`,
        };
      }

      const alreadyAllocated = allocations
        .filter((a) => a.tenderNo === tenderNo && a.bookCode === alloc.bookCode)
        .reduce((sum, a) => sum + a.quantity, 0);

      const newBatchAllocatedForTitle = newAllocations
        .filter((a) => a.bookCode === alloc.bookCode)
        .reduce((sum, a) => sum + a.quantity, 0);

      const remainingDemand = title.requiredQty - alreadyAllocated;
      if (newBatchAllocatedForTitle > remainingDemand) {
        return {
          success: false,
          message: `Total allocated quantity for ${title.bookName} (${newBatchAllocatedForTitle} copies) exceeds the remaining tender quantity of ${remainingDemand} copies.`,
        };
      }

      // Validate against Printer Available Capacity
      const printer = printers.find((p) => p.printerCode === alloc.printerCode);
      if (!printer) {
        return {
          success: false,
          message: `Printer with code ${alloc.printerCode} not found.`,
        };
      }

      const printerCurrentAllocated = allocations
        .filter((a) => a.printerCode === alloc.printerCode)
        .reduce((sum, a) => sum + a.quantity, 0);

      const newBatchAllocatedForPrinter = newAllocations
        .filter((a) => a.printerCode === alloc.printerCode)
        .reduce((sum, a) => sum + a.quantity, 0);

      const printerAvailableCapacity =
        printer.approvedCapacity - printerCurrentAllocated;
      if (newBatchAllocatedForPrinter > printerAvailableCapacity) {
        return {
          success: false,
          message: `Total allocated quantity to ${printer.printerName} (${newBatchAllocatedForPrinter} copies) exceeds its available capacity of ${printerAvailableCapacity} copies.`,
        };
      }
    }

    // Generate order number server-side
    const orderNo = getNextOrderNo();
    const mappingDate = new Date().toISOString().split("T")[0];
    const newAllocationsToSave: Allocation[] = [];
    const newHistoryToSave: MappingHistoryItem[] = [];

    newAllocations.forEach((alloc, idx) => {
      const savedAlloc: Allocation = {
        tenderNo,
        bookCode: alloc.bookCode,
        printerCode: alloc.printerCode,
        quantity: alloc.quantity,
        mappingDate,
        mappedBy,
        deliveryDepot: alloc.deliveryDepot,
        expectedCompletionDate: alloc.expectedCompletionDate,
        orderNo,
      };
      newAllocationsToSave.push(savedAlloc);

      const printerName =
        printers.find((p) => p.printerCode === alloc.printerCode)
          ?.printerName || alloc.printerCode;
      const bookName =
        tender.titles.find((t) => t.bookCode === alloc.bookCode)?.bookName ||
        alloc.bookCode;

      const historyItem: MappingHistoryItem = {
        mappingId: `MAP-${Date.now() + idx}`,
        tenderNo,
        printerName,
        printerCode: alloc.printerCode,
        bookName,
        bookCode: alloc.bookCode,
        allocatedQty: alloc.quantity,
        mappingDate,
        mappedBy,
        status: "Confirmed",
        deliveryDepot: alloc.deliveryDepot,
        expectedCompletionDate: alloc.expectedCompletionDate,
        orderNo,
      };
      newHistoryToSave.push(historyItem);
    });

    const updatedAllocations = [...allocations, ...newAllocationsToSave];
    const updatedHistory = [...history, ...newHistoryToSave];

    setStored("mptbc_pwa_allocations_v4", updatedAllocations);
    setStored("mptbc_pwa_history_v4", updatedHistory);

    return {
      success: true,
      message: `Printer work allocation ${orderNo} saved successfully!`,
      orderNo,
    };
  },
};
