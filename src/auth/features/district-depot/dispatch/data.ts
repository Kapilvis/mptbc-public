// ─── Dispatch Order History (from Excel) ─────────────────────────────────────
export interface DispatchHistoryItem {
  srNo: number;
  year: string;
  classGroup: string;
  depotCode: string;
  depotName: string;
  blockName: string;
  challanNo: string;
  date: string;
  totalBundles: number;
  totalBooks: number;
  truckNo: string;
  status: 0 | 1; // 0 = Pending, 1 = Acknowledged
}

export const dispatchHistoryData: DispatchHistoryItem[] = [
  {
    srNo: 1,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "RWA",
    depotName: "रीवा",
    blockName: "चितरंगी",
    challanNo: "1199061",
    date: "16 Aug 2026",
    totalBundles: 412,
    totalBooks: 65591,
    truckNo: "MP20HB9633",
    status: 0,
  },
  {
    srNo: 2,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "RWA",
    depotName: "रीवा",
    blockName: "देवसर",
    challanNo: "4610467",
    date: "16 Aug 2026",
    totalBundles: 113,
    totalBooks: 17540,
    truckNo: "MP20HB9633",
    status: 0,
  },
  {
    srNo: 3,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "RWA",
    depotName: "रीवा",
    blockName: "वैडन",
    challanNo: "7714174",
    date: "16 Aug 2026",
    totalBundles: 67,
    totalBooks: 12822,
    truckNo: "MP20HB9633",
    status: 0,
  },
  {
    srNo: 4,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "SGR",
    depotName: "सागर",
    blockName: "दमोह",
    challanNo: "982872",
    date: "15 Aug 2026",
    totalBundles: 116,
    totalBooks: 18380,
    truckNo: "MP15ZC5100",
    status: 0,
  },
  {
    srNo: 5,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "GWL",
    depotName: "ग्वालियर",
    blockName: "भांडेर",
    challanNo: "3841390",
    date: "15 Aug 2026",
    totalBundles: 0,
    totalBooks: 16,
    truckNo: "MP07GA2268",
    status: 1,
  },
  {
    srNo: 6,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "GWL",
    depotName: "ग्वालियर",
    blockName: "दतिया",
    challanNo: "3376905",
    date: "15 Aug 2026",
    totalBundles: 0,
    totalBooks: 18,
    truckNo: "MP07GA2268",
    status: 0,
  },
  {
    srNo: 7,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "GWL",
    depotName: "ग्वालियर",
    blockName: "दतिया",
    challanNo: "5834453",
    date: "15 Aug 2026",
    totalBundles: 0,
    totalBooks: 6,
    truckNo: "MP07GA2268",
    status: 0,
  },
  {
    srNo: 8,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "GWL",
    depotName: "ग्वालियर",
    blockName: "शिवपुरी",
    challanNo: "484316",
    date: "15 Aug 2026",
    totalBundles: 0,
    totalBooks: 56,
    truckNo: "MP07GA6093",
    status: 0,
  },
  {
    srNo: 9,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "GWL",
    depotName: "ग्वालियर",
    blockName: "विजयपुर",
    challanNo: "2475880",
    date: "13 Aug 2026",
    totalBundles: 181,
    totalBooks: 30056,
    truckNo: "MP07GA2268",
    status: 0,
  },
  {
    srNo: 10,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "RWA",
    depotName: "रीवा",
    blockName: "अनूपपुर",
    challanNo: "4252888",
    date: "13 Aug 2026",
    totalBundles: 175,
    totalBooks: 27302,
    truckNo: "MP20ZR9933",
    status: 0,
  },
  {
    srNo: 11,
    year: "2026-2027",
    classGroup: "Class 1 To 8",
    depotCode: "BPL",
    depotName: "भोपाल",
    blockName: "हुजूर",
    challanNo: "CHL2026001",
    date: "12 Aug 2026",
    totalBundles: 210,
    totalBooks: 42500,
    truckNo: "MP04GA4120",
    status: 1,
  },
  {
    srNo: 12,
    year: "2026-2027",
    classGroup: "Class 9 To 12",
    depotCode: "IND",
    depotName: "इंदौर",
    blockName: "सांवेर",
    challanNo: "CHL2026002",
    date: "12 Aug 2026",
    totalBundles: 95,
    totalBooks: 19800,
    truckNo: "MP09CD3311",
    status: 1,
  },
];

// ─── Challan to Block (form list) ────────────────────────────────────────────
export interface ChallanToBlockItem {
  id: number;
  scheme: string;
  academicYear: string;
  depotCode: string;
  block: string;
  brcCentre: string;
  title: string;
  allottedQty: number;
  issuedQty: number;
  challanNo: string;
  vehicleNo: string;
  receiverName: string;
  receiverMobile: string;
  date: string;
  status: "Dispatched" | "Pending" | "Acknowledged";
}

export const challanToBlockData: ChallanToBlockItem[] = [
  {
    id: 1,
    scheme: "Free Textbook (RSK)",
    academicYear: "2026-2027",
    depotCode: "BPL",
    block: "Huzur",
    brcCentre: "Huzur",
    title: "भाषा भारती (Hindi) - Class 1",
    allottedQty: 24500,
    issuedQty: 24500,
    challanNo: "CHL/2026/0118",
    vehicleNo: "MP04GA4120",
    receiverName: "Rajesh Sharma",
    receiverMobile: "9876543210",
    date: "16 Aug 2026",
    status: "Acknowledged",
  },
  {
    id: 2,
    scheme: "Free Textbook (RSK)",
    academicYear: "2026-2027",
    depotCode: "BPL",
    block: "Bairasiya",
    brcCentre: "Bairasiya",
    title: "गणित (Mathematics) - Class 5",
    allottedQty: 18200,
    issuedQty: 18200,
    challanNo: "CHL/2026/0119",
    vehicleNo: "MP04GA4157",
    receiverName: "Mohan Lal",
    receiverMobile: "9765432100",
    date: "16 Aug 2026",
    status: "Dispatched",
  },
  {
    id: 3,
    scheme: "CPI Demand",
    academicYear: "2026-2027",
    depotCode: "BPL",
    block: "Sanver",
    brcCentre: "Sanver",
    title: "अकाउंटेन्सी (Part-1) - Class 12",
    allottedQty: 21000,
    issuedQty: 21000,
    challanNo: "CHL/2026/0120",
    vehicleNo: "MP04GA4120",
    receiverName: "Priya Verma",
    receiverMobile: "9654321000",
    date: "15 Aug 2026",
    status: "Acknowledged",
  },
];
