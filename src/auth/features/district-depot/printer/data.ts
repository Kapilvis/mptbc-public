// ─── Printer Assigned Demand Data ────────────────────────────────────────────
export interface PrinterDemandItem {
  id: number;
  printerName: string;
  printerCode: string;
  groupNo: string;
  jobCode: string;
  totalOrdered: number;
  deliveredToDepot: number;
  remaining: number;
  lastDeliveryDate: string;
  status: "In Progress" | "Completed" | "Delayed";
}

export const printerDemandData: PrinterDemandItem[] = [
  {
    id: 1,
    printerName: "Messrs Ajanta Packaging, Bhopal",
    printerCode: "PR001",
    groupNo: "GRP-001",
    jobCode: "JOB-2026001",
    totalOrdered: 550000,
    deliveredToDepot: 432000,
    remaining: 118000,
    lastDeliveryDate: "16 Aug 2026",
    status: "In Progress",
  },
  {
    id: 2,
    printerName: "G Tech Print Works, Indore",
    printerCode: "PR002",
    groupNo: "GRP-002",
    jobCode: "JOB-2026002",
    totalOrdered: 380000,
    deliveredToDepot: 320000,
    remaining: 60000,
    lastDeliveryDate: "15 Aug 2026",
    status: "In Progress",
  },
  {
    id: 3,
    printerName: "Drishti Offset Printers, Gwalior",
    printerCode: "PR003",
    groupNo: "GRP-003",
    jobCode: "JOB-2026003",
    totalOrdered: 290000,
    deliveredToDepot: 290000,
    remaining: 0,
    lastDeliveryDate: "12 Aug 2026",
    status: "Completed",
  },
  {
    id: 4,
    printerName: "M.K. Offset Press, Jabalpur",
    printerCode: "PR004",
    groupNo: "GRP-004",
    jobCode: "JOB-2026004",
    totalOrdered: 240000,
    deliveredToDepot: 185000,
    remaining: 55000,
    lastDeliveryDate: "14 Aug 2026",
    status: "Delayed",
  },
  {
    id: 5,
    printerName: "New Lakshmi Printers, Rewa",
    printerCode: "PR005",
    groupNo: "GRP-005",
    jobCode: "JOB-2026005",
    totalOrdered: 195000,
    deliveredToDepot: 172000,
    remaining: 23000,
    lastDeliveryDate: "13 Aug 2026",
    status: "In Progress",
  },
  {
    id: 6,
    printerName: "Balaji Printers, Sagar",
    printerCode: "PR006",
    groupNo: "GRP-006",
    jobCode: "JOB-2026006",
    totalOrdered: 165000,
    deliveredToDepot: 165000,
    remaining: 0,
    lastDeliveryDate: "10 Aug 2026",
    status: "Completed",
  },
  {
    id: 7,
    printerName: "Jayesh Printers & Publishers, Ujjain",
    printerCode: "PR007",
    groupNo: "GRP-007",
    jobCode: "JOB-2026007",
    totalOrdered: 145000,
    deliveredToDepot: 122000,
    remaining: 23000,
    lastDeliveryDate: "11 Aug 2026",
    status: "In Progress",
  },
  {
    id: 8,
    printerName: "Saraswati Press, Khandwa",
    printerCode: "PR008",
    groupNo: "GRP-008",
    jobCode: "JOB-2026008",
    totalOrdered: 98000,
    deliveredToDepot: 75000,
    remaining: 23000,
    lastDeliveryDate: "09 Aug 2026",
    status: "Delayed",
  },
];

// ─── Printer Challan Received Data ────────────────────────────────────────────
export interface PrinterChallanItem {
  id: number;
  challanNo: string;
  challanDate: string;
  receiptDate: string;
  depotCode: string;
  printerName: string;
  printerCode: string;
  vehicleNo: string;
  driverName: string;
  driverMobile: string;
  title: string;
  dispatchedQty: number;
  receivedQty: number;
  shortage: number;
  damagedQty?: number;
  warehouse?: string;
  status: "Received" | "Shortage" | "Pending" | "Damaged";
}

export const printerChallanData: PrinterChallanItem[] = [
  {
    id: 1,
    challanNo: "PR-CHL/2026/1199",
    challanDate: "16 Aug 2026",
    receiptDate: "16 Aug 2026",
    depotCode: "RWA",
    printerName: "Messrs Ajanta Packaging",
    printerCode: "PR001",
    vehicleNo: "MP20HB9633",
    driverName: "Ramesh Kumar",
    driverMobile: "9876543210",
    title: "भाषा भारती (Hindi) - Class 1",
    dispatchedQty: 65591,
    receivedQty: 65591,
    shortage: 0,
    warehouse: "Warehouse 1",
    status: "Received",
  },
  {
    id: 2,
    challanNo: "PR-CHL/2026/4610",
    challanDate: "16 Aug 2026",
    receiptDate: "16 Aug 2026",
    depotCode: "RWA",
    printerName: "G Tech Print Works",
    printerCode: "PR002",
    vehicleNo: "MP20HB9633",
    driverName: "Ramesh Kumar",
    driverMobile: "9876543210",
    title: "गणित (Mathematics) - Class 5",
    dispatchedQty: 17540,
    receivedQty: 17540,
    shortage: 0,
    warehouse: "Warehouse 1",
    status: "Received",
  },
  {
    id: 3,
    challanNo: "PR-CHL/2026/7714",
    challanDate: "15 Aug 2026",
    receiptDate: "15 Aug 2026",
    depotCode: "SGR",
    printerName: "Drishti Offset Printers",
    printerCode: "PR003",
    vehicleNo: "MP15ZC5100",
    driverName: "Dinesh Patel",
    driverMobile: "9765432100",
    title: "विज्ञान (Science) - Class 8",
    dispatchedQty: 18380,
    receivedQty: 18200,
    shortage: 180,
    warehouse: "Warehouse 2",
    status: "Shortage",
  },
  {
    id: 4,
    challanNo: "PR-CHL/2026/3841",
    challanDate: "14 Aug 2026",
    receiptDate: "14 Aug 2026",
    depotCode: "GWL",
    printerName: "M.K. Offset Press",
    printerCode: "PR004",
    vehicleNo: "MP07GA2268",
    driverName: "Suresh Singh",
    driverMobile: "9654321000",
    title: "English Reader - Class 1",
    dispatchedQty: 30056,
    receivedQty: 30056,
    shortage: 0,
    warehouse: "Warehouse 1",
    status: "Received",
  },
  {
    id: 5,
    challanNo: "PR-CHL/2026/9679",
    challanDate: "13 Aug 2026",
    receiptDate: "13 Aug 2026",
    depotCode: "RWA",
    printerName: "New Lakshmi Printers",
    printerCode: "PR005",
    vehicleNo: "MP20ZR9933",
    driverName: "Manoj Tiwari",
    driverMobile: "9543210000",
    title: "सामाजिक विज्ञान - Class 7",
    dispatchedQty: 27302,
    receivedQty: 27302,
    shortage: 0,
    warehouse: "Warehouse 3",
    status: "Received",
  },
  {
    id: 6,
    challanNo: "PR-CHL/2026/8821",
    challanDate: "18 Aug 2026",
    receiptDate: "—",
    depotCode: "BPL",
    printerName: "Balaji Printers",
    printerCode: "PR006",
    vehicleNo: "MP04HE4412",
    driverName: "Vikram Sharma",
    driverMobile: "9826012345",
    title: "पर्यावरण अध्ययन - Class 4",
    dispatchedQty: 42000,
    receivedQty: 0,
    shortage: 0,
    warehouse: "—",
    status: "Pending",
  },
  {
    id: 7,
    challanNo: "PR-CHL/2026/9104",
    challanDate: "18 Aug 2026",
    receiptDate: "—",
    depotCode: "IND",
    printerName: "Jayesh Printers & Publishers",
    printerCode: "PR007",
    vehicleNo: "MP09AB7788",
    driverName: "Sunil Verma",
    driverMobile: "9425098765",
    title: "संस्कृत - Class 6",
    dispatchedQty: 35500,
    receivedQty: 0,
    shortage: 0,
    warehouse: "—",
    status: "Pending",
  },
];
