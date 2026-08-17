export interface AppendixItem {
  district: string;
  block: string;
  nineTonTrucksRequired: number;
  fourPointFiveTonTrucksRequired: number;
  bundles: number;
}

export const appendixDataIndore: AppendixItem[] = [
  {
    district: "Indore",
    block: "Indore City",
    nineTonTrucksRequired: 24,
    fourPointFiveTonTrucksRequired: 4,
    bundles: 124,
  },
  {
    district: "Indore",
    block: "Mhow",
    nineTonTrucksRequired: 10,
    fourPointFiveTonTrucksRequired: 3,
    bundles: 62,
  },
  {
    district: "Indore",
    block: "Sanwer",
    nineTonTrucksRequired: 7,
    fourPointFiveTonTrucksRequired: 1,
    bundles: 55,
  },
];

export const mockWorkOrders: Transportation.WorkOrder[] = [
  {
    workOrderId: "WO-IND-001",
    district: "Indore",
    block: "Indore City",
    totalBundles: 120,
    allocatedTransporterId: 3, // Verma Logistics
    transporterName: "Verma Logistics",
    instructionDate: "2026-08-15",
    dueDate: "2026-08-18",
    status: "In Transit",
    nineTonTrucksRequired: 20,
    fourPointFiveTonTrucksRequired: 5,
    dispatches: [
      {
        dispatchId: "DISP-101",
        workOrderId: "WO-IND-001",
        truckNo: "MP-09-AB-1234",
        driverName: "Ramesh Singh",
        driverMobile: "9876543210",
        capacity: 9,
        bundlesLoaded: 80,
        dispatchDate: "2026-08-16",
        status: "In Transit",
        lrNumber: "LR-9011",
        podUploaded: false,
      },
    ],
  },
  {
    workOrderId: "WO-IND-002",
    district: "Indore",
    block: "Mhow",
    totalBundles: 60,
    allocatedTransporterId: 3, // Verma Logistics
    transporterName: "Verma Logistics",
    instructionDate: "2026-08-14",
    dueDate: "2026-08-17",
    status: "Delivered",
    nineTonTrucksRequired: 10,
    fourPointFiveTonTrucksRequired: 2,
    dispatches: [
      {
        dispatchId: "DISP-102",
        workOrderId: "WO-IND-002",
        truckNo: "MP-09-CD-5678",
        driverName: "Sanjay Kumar",
        driverMobile: "9988776655",
        capacity: 4.5,
        bundlesLoaded: 60,
        dispatchDate: "2026-08-14",
        status: "Delivered",
        lrNumber: "LR-9012",
        podUploaded: true,
        podFilePath: "mock_uploads/pod_signed_challan.pdf",
        podSubmittedAt: "2026-08-16 14:30",
        actualDeliveryDate: "2026-08-16",
        deliveryDelayDays: 0,
      },
    ],
  },
  {
    workOrderId: "WO-IND-003",
    district: "Indore",
    block: "Sanwer",
    totalBundles: 55,
    allocatedTransporterId: 3, // Verma Logistics
    transporterName: "Verma Logistics",
    instructionDate: "2026-08-12",
    dueDate: "2026-08-15",
    status: "In Transit",
    nineTonTrucksRequired: 7,
    fourPointFiveTonTrucksRequired: 1,
    dispatches: [
      {
        dispatchId: "DISP-103",
        workOrderId: "WO-IND-003",
        truckNo: "MP-09-EF-9012",
        driverName: "Vikram Dev",
        driverMobile: "9123456789",
        capacity: 4.5,
        bundlesLoaded: 55,
        dispatchDate: "2026-08-12", // due Aug 15, SLA Breached
        status: "In Transit",
        lrNumber: "LR-9013",
        podUploaded: false,
      },
    ],
  },
  {
    workOrderId: "WO-IND-004",
    district: "Indore",
    block: "Sanwer",
    totalBundles: 40,
    allocatedTransporterId: 3, // Verma Logistics
    transporterName: "Verma Logistics",
    instructionDate: "2026-08-10",
    dueDate: "2026-08-13",
    status: "Delivered",
    nineTonTrucksRequired: 5,
    fourPointFiveTonTrucksRequired: 1,
    dispatches: [
      {
        dispatchId: "DISP-104",
        workOrderId: "WO-IND-004",
        truckNo: "MP-09-XY-9999",
        driverName: "Karan Johar",
        driverMobile: "9876123450",
        capacity: 4.5,
        bundlesLoaded: 40,
        dispatchDate: "2026-08-10",
        status: "Delivered",
        lrNumber: "LR-9014",
        podUploaded: true,
        podFilePath: "mock_uploads/pod_signed_challan.pdf",
        podSubmittedAt: "2026-08-16 17:45",
        actualDeliveryDate: "2026-08-16",
        deliveryDelayDays: 3,
      },
    ],
  },
];
