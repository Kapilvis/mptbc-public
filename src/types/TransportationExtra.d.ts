declare namespace Transportation {
  interface Dispatch {
    dispatchId: string;
    workOrderId: string;
    truckNo: string;
    driverName: string;
    driverMobile: string;
    capacity: number; // in Tons
    bundlesLoaded: number;
    dispatchDate: string;
    actualDeliveryDate?: string;
    deliveryDelayDays?: number;
    lrNumber: string;
    gatePassNo?: string;
    gpsDeviceId?: string;
    lat?: number;
    lng?: number;
    status: "In Transit" | "Delivered" | "Pending Dispatch";
    podFilePath?: string;
    podUploaded?: boolean;
    podSubmittedAt?: string;
    billingStatus?:
      | "Pending"
      | "Verified"
      | "Approved"
      | "Paid"
      | "Disbursed"
      | "Rejected"
      | "Advance Claimed"
      | "Final Settlement Claimed"
      | "Advance Paid"
      | "Settled"
      | string;
  }

  interface WorkOrder {
    workOrderId: string;
    tenderId?: string;
    allocatedTransporterId: number;
    transporterName: string;
    district: string;
    block: string;
    totalBundles: number;
    nineTonTrucksRequired?: number;
    fourPointFiveTonTrucksRequired?: number;
    trucks9T?: number;
    trucks45T?: number;
    instructionDate?: string;
    issueDate?: string;
    dueDate: string;
    status: "Pending Dispatch" | "In Transit" | "Delivered" | "Delayed";
    dispatches?: Dispatch[];
  }
}
