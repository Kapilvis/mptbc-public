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
    printerName: "MP Text Printers Bhopal",
    printerCode: "PR001",
    groupNo: "Group B",
    jobCode: "JOB-2026001",
    totalOrdered: 64500,
    deliveredToDepot: 33000,
    remaining: 31500,
    lastDeliveryDate: "16 Aug 2026",
    status: "In Progress",
  },
  {
    id: 2,
    printerName: "Malwa Print Pack Indore",
    printerCode: "PR002",
    groupNo: "Group A",
    jobCode: "JOB-2026002",
    totalOrdered: 69000,
    deliveredToDepot: 35000,
    remaining: 34000,
    lastDeliveryDate: "15 Aug 2026",
    status: "In Progress",
  },
  {
    id: 3,
    printerName: "Chambal Security Printers Gwalior",
    printerCode: "PR003",
    groupNo: "Group C",
    jobCode: "JOB-2026003",
    totalOrdered: 48000,
    deliveredToDepot: 24500,
    remaining: 23500,
    lastDeliveryDate: "12 Aug 2026",
    status: "In Progress",
  },
  {
    id: 4,
    printerName: "Mahakaushal Graphics Jabalpur",
    printerCode: "PR004",
    groupNo: "Group B",
    jobCode: "JOB-2026004",
    totalOrdered: 51500,
    deliveredToDepot: 26000,
    remaining: 25500,
    lastDeliveryDate: "14 Aug 2026",
    status: "In Progress",
  },
  {
    id: 5,
    printerName: "Vindhya Offset Rewa",
    printerCode: "PR005",
    groupNo: "Group D",
    jobCode: "JOB-2026005",
    totalOrdered: 30500,
    deliveredToDepot: 14000,
    remaining: 16500,
    lastDeliveryDate: "13 Aug 2026",
    status: "In Progress",
  },
  {
    id: 6,
    printerName: "Bundelkhand Offset Sagar",
    printerCode: "PR006",
    groupNo: "Group C",
    jobCode: "JOB-2026006",
    totalOrdered: 33500,
    deliveredToDepot: 17000,
    remaining: 16500,
    lastDeliveryDate: "10 Aug 2026",
    status: "In Progress",
  },
  {
    id: 7,
    printerName: "Shree Ganesh Offset Ujjain",
    printerCode: "PR007",
    groupNo: "Group A",
    jobCode: "JOB-2026007",
    totalOrdered: 39500,
    deliveredToDepot: 20000,
    remaining: 19500,
    lastDeliveryDate: "11 Aug 2026",
    status: "In Progress",
  },
  {
    id: 8,
    printerName: "Nimar Printers Khandwa",
    printerCode: "PR008",
    groupNo: "Group A",
    jobCode: "JOB-2026008",
    totalOrdered: 23000,
    deliveredToDepot: 11000,
    remaining: 12000,
    lastDeliveryDate: "09 Aug 2026",
    status: "In Progress",
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
    dispatchedQty: 60000,
    receivedQty: 60000,
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
    dispatchedQty: 20000,
    receivedQty: 20000,
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
    dispatchedQty: 20180,
    receivedQty: 20000,
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
    dispatchedQty: 25000,
    receivedQty: 25000,
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
    dispatchedQty: 25000,
    receivedQty: 25000,
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
    dispatchedQty: 20320,
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
    dispatchedQty: 10000,
    receivedQty: 0,
    shortage: 0,
    warehouse: "—",
    status: "Pending",
  },
];
