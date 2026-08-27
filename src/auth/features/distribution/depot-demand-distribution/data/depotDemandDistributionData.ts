export interface DepotTitleItem {
  id: string;
  titleName: string;
  classNo: string;
  medium: string;
  demandQty: number;
  approvedDemandQty: number;
  openingStock: number;
  workAllocationQty: number;
  receivedInDepot: number;
  dispatchedToBlock: number;
}

export interface DepotBlockItem {
  blockCode: string;
  blockName: string;
  district: string;
  totalBooksRequirement: number;
  dispatchedQty: number;
  pendingQty: number;
  completionPercent: number;
}

export interface DepotDemandDistributionItem {
  id: string;
  depotCode: string;
  depotName: string;
  groupCategory: "A" | "B" | "C" | "D";
  groupDescription: string;
  totalDemand: number;
  approvedDemand: number;
  openingStock: number;
  actualDemandForWorkAllocation: number; // approvedDemand - openingStock
  workAllocatedToPrinter: number;
  deliveryInDepot: number; // received from printer
  dispatchToBlock: number; // sent to block
  currentDepotStock: number; // openingStock + deliveryInDepot - dispatchToBlock
  printerPendingDelivery: number; // workAllocatedToPrinter - deliveryInDepot
  blockPendingDispatch: number; // approvedDemand - dispatchToBlock
  deliveryPercent: number; // (deliveryInDepot / workAllocatedToPrinter) * 100
  dispatchPercent: number; // (dispatchToBlock / approvedDemand) * 100
  assignedPrinters: string[];
  districtCount: number;
  blockCount: number;
  titleDetails: DepotTitleItem[];
  blockDetails: DepotBlockItem[];
}

export interface DepotGroupSummary {
  groupCategory: "A" | "B" | "C" | "D";
  groupTitle: string;
  depots: string[];
  totalDemand: number;
  approvedDemand: number;
  openingStock: number;
  workAllocation: number;
  deliveryInDepot: number;
  dispatchToBlock: number;
  deliveryPercent: number;
  dispatchPercent: number;
  themeColor: string;
}

export const DEPOT_DEMAND_DISTRIBUTION_DATA: DepotDemandDistributionItem[] = [
  // ─── GROUP B: BHOPAL & JABALPUR ───
  {
    id: "depot-bhopal",
    depotCode: "DPT-BPL-01",
    depotName: "Bhopal",
    groupCategory: "B",
    groupDescription: "Book marked as B (Bhopal & Jabalpur)",
    totalDemand: 80000,
    approvedDemand: 70000,
    openingStock: 5500,
    actualDemandForWorkAllocation: 64500,
    workAllocatedToPrinter: 64500,
    deliveryInDepot: 33000,
    dispatchToBlock: 28000,
    currentDepotStock: 10500, // 5500 + 33000 - 28000
    printerPendingDelivery: 31500, // 64500 - 33000
    blockPendingDispatch: 42000, // 70000 - 28000
    deliveryPercent: 51.2,
    dispatchPercent: 40.0,
    assignedPrinters: ["MP Text Printers Bhopal", "Shree Ganesh Offset"],
    districtCount: 4,
    blockCount: 16,
    titleDetails: [
      {
        id: "bpl-t1",
        titleName: "NCERT Hindi Vasant Bhag-1",
        classNo: "Class 6",
        medium: "Hindi",
        demandQty: 18000,
        approvedDemandQty: 16000,
        openingStock: 1200,
        workAllocationQty: 14800,
        receivedInDepot: 7500,
        dispatchedToBlock: 6500,
      },
      {
        id: "bpl-t2",
        titleName: "NCERT Mathematics Ganit",
        classNo: "Class 6",
        medium: "Hindi",
        demandQty: 22000,
        approvedDemandQty: 19000,
        openingStock: 1500,
        workAllocationQty: 17500,
        receivedInDepot: 9000,
        dispatchedToBlock: 7500,
      },
      {
        id: "bpl-t3",
        titleName: "NCERT Science Vigyan",
        classNo: "Class 7",
        medium: "Hindi",
        demandQty: 20000,
        approvedDemandQty: 17500,
        openingStock: 1400,
        workAllocationQty: 16100,
        receivedInDepot: 8250,
        dispatchedToBlock: 7000,
      },
      {
        id: "bpl-t4",
        titleName: "NCERT Social Science Samajik Vigyan",
        classNo: "Class 8",
        medium: "Hindi",
        demandQty: 20000,
        approvedDemandQty: 17500,
        openingStock: 1400,
        workAllocationQty: 16100,
        receivedInDepot: 8250,
        dispatchedToBlock: 7000,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-BPL-01",
        blockName: "Phanda Urban",
        district: "Bhopal",
        totalBooksRequirement: 22000,
        dispatchedQty: 9500,
        pendingQty: 12500,
        completionPercent: 43.2,
      },
      {
        blockCode: "BLK-BPL-02",
        blockName: "Phanda Rural",
        district: "Bhopal",
        totalBooksRequirement: 18000,
        dispatchedQty: 7500,
        pendingQty: 10500,
        completionPercent: 41.7,
      },
      {
        blockCode: "BLK-BPL-03",
        blockName: "Berasia",
        district: "Bhopal",
        totalBooksRequirement: 15000,
        dispatchedQty: 6000,
        pendingQty: 9000,
        completionPercent: 40.0,
      },
      {
        blockCode: "BLK-BPL-04",
        blockName: "Sehore Block",
        district: "Sehore",
        totalBooksRequirement: 15000,
        dispatchedQty: 5000,
        pendingQty: 10000,
        completionPercent: 33.3,
      },
    ],
  },
  {
    id: "depot-jabalpur",
    depotCode: "DPT-JBL-05",
    depotName: "Jabalpur",
    groupCategory: "B",
    groupDescription: "Book marked as B (Bhopal & Jabalpur)",
    totalDemand: 65000,
    approvedDemand: 56000,
    openingStock: 4500,
    actualDemandForWorkAllocation: 51500,
    workAllocatedToPrinter: 51500,
    deliveryInDepot: 26000,
    dispatchToBlock: 22000,
    currentDepotStock: 8500, // 4500 + 26000 - 22000
    printerPendingDelivery: 25500, // 51500 - 26000
    blockPendingDispatch: 34000,
    deliveryPercent: 50.5,
    dispatchPercent: 39.3,
    assignedPrinters: ["Mahakaushal Graphics Jabalpur", "Kailash Press"],
    districtCount: 5,
    blockCount: 18,
    titleDetails: [
      {
        id: "jbl-t1",
        titleName: "NCERT Hindi Durva",
        classNo: "Class 7",
        medium: "Hindi",
        demandQty: 22000,
        approvedDemandQty: 19000,
        openingStock: 1600,
        workAllocationQty: 17400,
        receivedInDepot: 8800,
        dispatchedToBlock: 7500,
      },
      {
        id: "jbl-t2",
        titleName: "NCERT Mathematics Ganit",
        classNo: "Class 8",
        medium: "Hindi",
        demandQty: 23000,
        approvedDemandQty: 20000,
        openingStock: 1500,
        workAllocationQty: 18500,
        receivedInDepot: 9400,
        dispatchedToBlock: 8000,
      },
      {
        id: "jbl-t3",
        titleName: "NCERT Science Vigyan",
        classNo: "Class 8",
        medium: "Hindi",
        demandQty: 20000,
        approvedDemandQty: 17000,
        openingStock: 1400,
        workAllocationQty: 15600,
        receivedInDepot: 7800,
        dispatchedToBlock: 6500,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-JBL-01",
        blockName: "Jabalpur Urban",
        district: "Jabalpur",
        totalBooksRequirement: 18000,
        dispatchedQty: 7500,
        pendingQty: 10500,
        completionPercent: 41.7,
      },
      {
        blockCode: "BLK-JBL-02",
        blockName: "Patan",
        district: "Jabalpur",
        totalBooksRequirement: 14000,
        dispatchedQty: 5500,
        pendingQty: 8500,
        completionPercent: 39.3,
      },
      {
        blockCode: "BLK-JBL-03",
        blockName: "Sihora",
        district: "Jabalpur",
        totalBooksRequirement: 12000,
        dispatchedQty: 4800,
        pendingQty: 7200,
        completionPercent: 40.0,
      },
      {
        blockCode: "BLK-JBL-04",
        blockName: "Katni Urban",
        district: "Katni",
        totalBooksRequirement: 12000,
        dispatchedQty: 4200,
        pendingQty: 7800,
        completionPercent: 35.0,
      },
    ],
  },

  // ─── GROUP A: INDORE, UJJAIN & KHANDWA ───
  {
    id: "depot-indore",
    depotCode: "DPT-IND-02",
    depotName: "Indore",
    groupCategory: "A",
    groupDescription: "Book marked as A (Indore, Ujjain & Khandwa)",
    totalDemand: 85000,
    approvedDemand: 75000,
    openingStock: 6000,
    actualDemandForWorkAllocation: 69000,
    workAllocatedToPrinter: 69000,
    deliveryInDepot: 35000,
    dispatchToBlock: 30000,
    currentDepotStock: 11000, // 6000 + 35000 - 30000
    printerPendingDelivery: 34000,
    blockPendingDispatch: 45000,
    deliveryPercent: 50.7,
    dispatchPercent: 40.0,
    assignedPrinters: ["Malwa Print Pack Indore", "Avinash Offset"],
    districtCount: 4,
    blockCount: 15,
    titleDetails: [
      {
        id: "ind-t1",
        titleName: "NCERT Honeycomb English",
        classNo: "Class 7",
        medium: "English",
        demandQty: 28000,
        approvedDemandQty: 25000,
        openingStock: 2000,
        workAllocationQty: 23000,
        receivedInDepot: 11800,
        dispatchedToBlock: 10000,
      },
      {
        id: "ind-t2",
        titleName: "NCERT Science Textbook",
        classNo: "Class 6",
        medium: "English",
        demandQty: 30000,
        approvedDemandQty: 26000,
        openingStock: 2100,
        workAllocationQty: 23900,
        receivedInDepot: 12200,
        dispatchedToBlock: 10500,
      },
      {
        id: "ind-t3",
        titleName: "NCERT Social Science Our Past",
        classNo: "Class 6",
        medium: "English",
        demandQty: 27000,
        approvedDemandQty: 24000,
        openingStock: 1900,
        workAllocationQty: 22100,
        receivedInDepot: 11000,
        dispatchedToBlock: 9500,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-IND-01",
        blockName: "Indore Urban",
        district: "Indore",
        totalBooksRequirement: 28000,
        dispatchedQty: 12000,
        pendingQty: 16000,
        completionPercent: 42.9,
      },
      {
        blockCode: "BLK-IND-02",
        blockName: "Mhow (Dr. Ambedkar Nagar)",
        district: "Indore",
        totalBooksRequirement: 18000,
        dispatchedQty: 7200,
        pendingQty: 10800,
        completionPercent: 40.0,
      },
      {
        blockCode: "BLK-IND-03",
        blockName: "Sanwer",
        district: "Indore",
        totalBooksRequirement: 15000,
        dispatchedQty: 5800,
        pendingQty: 9200,
        completionPercent: 38.7,
      },
      {
        blockCode: "BLK-IND-04",
        blockName: "Depalpur",
        district: "Indore",
        totalBooksRequirement: 14000,
        dispatchedQty: 5000,
        pendingQty: 9000,
        completionPercent: 35.7,
      },
    ],
  },
  {
    id: "depot-ujjain",
    depotCode: "DPT-UJN-03",
    depotName: "Ujjain",
    groupCategory: "A",
    groupDescription: "Book marked as A (Indore, Ujjain & Khandwa)",
    totalDemand: 50000,
    approvedDemand: 43000,
    openingStock: 3500,
    actualDemandForWorkAllocation: 39500,
    workAllocatedToPrinter: 39500,
    deliveryInDepot: 20000,
    dispatchToBlock: 16000,
    currentDepotStock: 7500, // 3500 + 20000 - 16000
    printerPendingDelivery: 19500,
    blockPendingDispatch: 27000,
    deliveryPercent: 50.6,
    dispatchPercent: 37.2,
    assignedPrinters: ["Avantika Printers Ujjain", "Narmada Print"],
    districtCount: 3,
    blockCount: 12,
    titleDetails: [
      {
        id: "ujn-t1",
        titleName: "NCERT Sanskrit Ruchira",
        classNo: "Class 6",
        medium: "Sanskrit",
        demandQty: 25000,
        approvedDemandQty: 21500,
        openingStock: 1750,
        workAllocationQty: 19750,
        receivedInDepot: 10000,
        dispatchedToBlock: 8000,
      },
      {
        id: "ujn-t2",
        titleName: "NCERT Sanskrit Ruchira Bhag-2",
        classNo: "Class 7",
        medium: "Sanskrit",
        demandQty: 25000,
        approvedDemandQty: 21500,
        openingStock: 1750,
        workAllocationQty: 19750,
        receivedInDepot: 10000,
        dispatchedToBlock: 8000,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-UJN-01",
        blockName: "Ujjain Urban",
        district: "Ujjain",
        totalBooksRequirement: 16000,
        dispatchedQty: 6200,
        pendingQty: 9800,
        completionPercent: 38.8,
      },
      {
        blockCode: "BLK-UJN-02",
        blockName: "Nagda",
        district: "Ujjain",
        totalBooksRequirement: 14000,
        dispatchedQty: 5200,
        pendingQty: 8800,
        completionPercent: 37.1,
      },
      {
        blockCode: "BLK-UJN-03",
        blockName: "Mahidpur",
        district: "Ujjain",
        totalBooksRequirement: 13000,
        dispatchedQty: 4600,
        pendingQty: 8400,
        completionPercent: 35.4,
      },
    ],
  },
  {
    id: "depot-khandwa",
    depotCode: "DPT-KHD-08",
    depotName: "Khandwa",
    groupCategory: "A",
    groupDescription: "Book marked as A (Indore, Ujjain & Khandwa)",
    totalDemand: 30000,
    approvedDemand: 25000,
    openingStock: 2000,
    actualDemandForWorkAllocation: 23000,
    workAllocatedToPrinter: 23000,
    deliveryInDepot: 11000,
    dispatchToBlock: 8000,
    currentDepotStock: 5000, // 2000 + 11000 - 8000
    printerPendingDelivery: 12000,
    blockPendingDispatch: 17000,
    deliveryPercent: 47.8,
    dispatchPercent: 32.0,
    assignedPrinters: ["Nimar Printers Khandwa"],
    districtCount: 2,
    blockCount: 9,
    titleDetails: [
      {
        id: "khd-t1",
        titleName: "NCERT Mathematics Class 6",
        classNo: "Class 6",
        medium: "Hindi",
        demandQty: 15000,
        approvedDemandQty: 12500,
        openingStock: 1000,
        workAllocationQty: 11500,
        receivedInDepot: 5500,
        dispatchedToBlock: 4000,
      },
      {
        id: "khd-t2",
        titleName: "NCERT Environmental Science",
        classNo: "Class 5",
        medium: "Hindi",
        demandQty: 15000,
        approvedDemandQty: 12500,
        openingStock: 1000,
        workAllocationQty: 11500,
        receivedInDepot: 5500,
        dispatchedToBlock: 4000,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-KHD-01",
        blockName: "Khandwa Urban",
        district: "Khandwa",
        totalBooksRequirement: 12000,
        dispatchedQty: 4200,
        pendingQty: 7800,
        completionPercent: 35.0,
      },
      {
        blockCode: "BLK-KHD-02",
        blockName: "Pandhana",
        district: "Khandwa",
        totalBooksRequirement: 7000,
        dispatchedQty: 2200,
        pendingQty: 4800,
        completionPercent: 31.4,
      },
      {
        blockCode: "BLK-KHD-03",
        blockName: "Punasa",
        district: "Khandwa",
        totalBooksRequirement: 6000,
        dispatchedQty: 1600,
        pendingQty: 4400,
        completionPercent: 26.7,
      },
    ],
  },

  // ─── GROUP C: GWALIOR & SAGAR ───
  {
    id: "depot-gwalior",
    depotCode: "DPT-GWL-04",
    depotName: "Gwalior",
    groupCategory: "C",
    groupDescription: "Book marked as C (Gwalior & Sagar)",
    totalDemand: 60000,
    approvedDemand: 52000,
    openingStock: 4000,
    actualDemandForWorkAllocation: 48000,
    workAllocatedToPrinter: 48000,
    deliveryInDepot: 24500,
    dispatchToBlock: 20000,
    currentDepotStock: 8500, // 4000 + 24500 - 20000
    printerPendingDelivery: 23500,
    blockPendingDispatch: 32000,
    deliveryPercent: 51.0,
    dispatchPercent: 38.5,
    assignedPrinters: ["Chambal Security Printers", "Gwalior Print Line"],
    districtCount: 4,
    blockCount: 16,
    titleDetails: [
      {
        id: "gwl-t1",
        titleName: "NCERT Hindi Kritika Bhag-1",
        classNo: "Class 9",
        medium: "Hindi",
        demandQty: 30000,
        approvedDemandQty: 26000,
        openingStock: 2000,
        workAllocationQty: 24000,
        receivedInDepot: 12250,
        dispatchedToBlock: 10000,
      },
      {
        id: "gwl-t2",
        titleName: "NCERT Science Class 9",
        classNo: "Class 9",
        medium: "Hindi",
        demandQty: 30000,
        approvedDemandQty: 26000,
        openingStock: 2000,
        workAllocationQty: 24000,
        receivedInDepot: 12250,
        dispatchedToBlock: 10000,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-GWL-01",
        blockName: "Gwalior Urban",
        district: "Gwalior",
        totalBooksRequirement: 20000,
        dispatchedQty: 8500,
        pendingQty: 11500,
        completionPercent: 42.5,
      },
      {
        blockCode: "BLK-GWL-02",
        blockName: "Morar Rural",
        district: "Gwalior",
        totalBooksRequirement: 14000,
        dispatchedQty: 5500,
        pendingQty: 8500,
        completionPercent: 39.3,
      },
      {
        blockCode: "BLK-GWL-03",
        blockName: "Dabra",
        district: "Gwalior",
        totalBooksRequirement: 10000,
        dispatchedQty: 3800,
        pendingQty: 6200,
        completionPercent: 38.0,
      },
      {
        blockCode: "BLK-GWL-04",
        blockName: "Bhitarwar",
        district: "Gwalior",
        totalBooksRequirement: 8000,
        dispatchedQty: 2200,
        pendingQty: 5800,
        completionPercent: 27.5,
      },
    ],
  },
  {
    id: "depot-sagar",
    depotCode: "DPT-SGR-06",
    depotName: "Sagar",
    groupCategory: "C",
    groupDescription: "Book marked as C (Gwalior & Sagar)",
    totalDemand: 42000,
    approvedDemand: 36000,
    openingStock: 2500,
    actualDemandForWorkAllocation: 33500,
    workAllocatedToPrinter: 33500,
    deliveryInDepot: 17000,
    dispatchToBlock: 14000,
    currentDepotStock: 5500, // 2500 + 17000 - 14000
    printerPendingDelivery: 16500,
    blockPendingDispatch: 22000,
    deliveryPercent: 50.7,
    dispatchPercent: 38.9,
    assignedPrinters: ["Bundelkhand Offset Sagar"],
    districtCount: 3,
    blockCount: 11,
    titleDetails: [
      {
        id: "sgr-t1",
        titleName: "NCERT Hindi Sparsh Bhag-1",
        classNo: "Class 9",
        medium: "Hindi",
        demandQty: 21000,
        approvedDemandQty: 18000,
        openingStock: 1250,
        workAllocationQty: 16750,
        receivedInDepot: 8500,
        dispatchedToBlock: 7000,
      },
      {
        id: "sgr-t2",
        titleName: "NCERT Social Science Class 9",
        classNo: "Class 9",
        medium: "Hindi",
        demandQty: 21000,
        approvedDemandQty: 18000,
        openingStock: 1250,
        workAllocationQty: 16750,
        receivedInDepot: 8500,
        dispatchedToBlock: 7000,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-SGR-01",
        blockName: "Sagar Urban",
        district: "Sagar",
        totalBooksRequirement: 14000,
        dispatchedQty: 5800,
        pendingQty: 8200,
        completionPercent: 41.4,
      },
      {
        blockCode: "BLK-SGR-02",
        blockName: "Banda",
        district: "Sagar",
        totalBooksRequirement: 12000,
        dispatchedQty: 4600,
        pendingQty: 7400,
        completionPercent: 38.3,
      },
      {
        blockCode: "BLK-SGR-03",
        blockName: "Rehli",
        district: "Sagar",
        totalBooksRequirement: 10000,
        dispatchedQty: 3600,
        pendingQty: 6400,
        completionPercent: 36.0,
      },
    ],
  },

  // ─── GROUP D: REWA ───
  {
    id: "depot-rewa",
    depotCode: "DPT-REW-07",
    depotName: "Rewa",
    groupCategory: "D",
    groupDescription: "Book marked as D (Rewa)",
    totalDemand: 38000,
    approvedDemand: 33000,
    openingStock: 2500,
    actualDemandForWorkAllocation: 30500,
    workAllocatedToPrinter: 30500,
    deliveryInDepot: 14000,
    dispatchToBlock: 12000,
    currentDepotStock: 4500, // 2500 + 14000 - 12000
    printerPendingDelivery: 16500,
    blockPendingDispatch: 21000,
    deliveryPercent: 45.9,
    dispatchPercent: 36.4,
    assignedPrinters: ["Vindhya Offset Rewa"],
    districtCount: 4,
    blockCount: 14,
    titleDetails: [
      {
        id: "rew-t1",
        titleName: "NCERT Hindi Kshitij Bhag-2",
        classNo: "Class 10",
        medium: "Hindi",
        demandQty: 19000,
        approvedDemandQty: 16500,
        openingStock: 1250,
        workAllocationQty: 15250,
        receivedInDepot: 7000,
        dispatchedToBlock: 6000,
      },
      {
        id: "rew-t2",
        titleName: "NCERT Mathematics Class 10",
        classNo: "Class 10",
        medium: "Hindi",
        demandQty: 19000,
        approvedDemandQty: 16500,
        openingStock: 1250,
        workAllocationQty: 15250,
        receivedInDepot: 7000,
        dispatchedToBlock: 6000,
      },
    ],
    blockDetails: [
      {
        blockCode: "BLK-REW-01",
        blockName: "Rewa Urban",
        district: "Rewa",
        totalBooksRequirement: 14000,
        dispatchedQty: 5400,
        pendingQty: 8600,
        completionPercent: 38.6,
      },
      {
        blockCode: "BLK-REW-02",
        blockName: "Mauganj",
        district: "Rewa",
        totalBooksRequirement: 10000,
        dispatchedQty: 3600,
        pendingQty: 6400,
        completionPercent: 36.0,
      },
      {
        blockCode: "BLK-REW-03",
        blockName: "Hanumana",
        district: "Rewa",
        totalBooksRequirement: 9000,
        dispatchedQty: 3000,
        pendingQty: 6000,
        completionPercent: 33.3,
      },
    ],
  },
];

export const GROUP_SUMMARIES: DepotGroupSummary[] = [
  {
    groupCategory: "A",
    groupTitle: "Book Marked as A",
    depots: ["Indore", "Ujjain", "Khandwa"],
    totalDemand: 165000, // 85k + 50k + 30k
    approvedDemand: 143000, // 75k + 43k + 25k
    openingStock: 11500, // 6k + 3.5k + 2k
    workAllocation: 131500, // 69k + 39.5k + 23k
    deliveryInDepot: 66000, // 35k + 20k + 11k
    dispatchToBlock: 54000, // 30k + 16k + 8k
    deliveryPercent: 50.2,
    dispatchPercent: 37.8,
    themeColor: "emerald",
  },
  {
    groupCategory: "B",
    groupTitle: "Book Marked as B",
    depots: ["Bhopal", "Jabalpur"],
    totalDemand: 145000, // 80k + 65k
    approvedDemand: 126000, // 70k + 56k
    openingStock: 10000, // 5.5k + 4.5k
    workAllocation: 116000, // 64.5k + 51.5k
    deliveryInDepot: 59000, // 33k + 26k
    dispatchToBlock: 50000, // 28k + 22k
    deliveryPercent: 50.9,
    dispatchPercent: 39.7,
    themeColor: "blue",
  },
  {
    groupCategory: "C",
    groupTitle: "Book Marked as C",
    depots: ["Gwalior", "Sagar"],
    totalDemand: 102000, // 60k + 42k
    approvedDemand: 88000, // 52k + 36k
    openingStock: 6500, // 4k + 2.5k
    workAllocation: 81500, // 48k + 33.5k
    deliveryInDepot: 41500, // 24.5k + 17k
    dispatchToBlock: 34000, // 20k + 14k
    deliveryPercent: 50.9,
    dispatchPercent: 38.6,
    themeColor: "indigo",
  },
  {
    groupCategory: "D",
    groupTitle: "Book Marked as D",
    depots: ["Rewa"],
    totalDemand: 38000,
    approvedDemand: 33000,
    openingStock: 2500,
    workAllocation: 30500,
    deliveryInDepot: 14000,
    dispatchToBlock: 12000,
    deliveryPercent: 45.9,
    dispatchPercent: 36.4,
    themeColor: "amber",
  },
];

export const OVERALL_TOTALS = {
  totalDemand: 450000, // 450K
  approvedDemand: 390000, // 390K
  openingStock: 30500, // 30.5K
  actualDemandForWorkAllocation: 359500, // 359.5K (390k - 30.5k)
  workAllocatedToPrinter: 359500, // 359.5K
  deliveryInDepot: 180500, // 180.5K (Updated)
  dispatchToBlock: 150000, // 150K
  currentDepotStock: 61000, // 30.5k + 180.5k - 150k
  printerPendingDelivery: 179000, // 359.5k - 180.5k
  blockPendingDispatch: 240000, // 390k - 150k
  deliveryPercent: 50.2, // (180500 / 359500) * 100
  dispatchPercent: 38.5,
  totalDepots: 8,
};
