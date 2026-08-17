declare namespace Transportation {
  interface WorkOrder {
    workOrderId: string;
    district: string;
    block: string;
    totalBundles: number;
    allocatedTransporterId: number;
    transporterName: string;
    instructionDate: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD (instructionDate + 3 days)
    status: "Draft" | "Pending Dispatch" | "In Transit" | "Delivered";
    nineTonTrucksRequired: number;
    fourPointFiveTonTrucksRequired: number;
    dispatches?: Dispatch[];
  }

  interface Dispatch {
    dispatchId: string;
    workOrderId: string;
    truckNo: string;
    driverName: string;
    driverMobile: string;
    capacity: number; // in Tons
    bundlesLoaded: number;
    dispatchDate: string;
    status: "In Transit" | "Delivered";
    lrNumber: string;
    podUploaded?: boolean;
    podFilePath?: string;
    podSubmittedAt?: string;
    actualDeliveryDate?: string;
    deliveryDelayDays?: number;
    freightAmount?: number;
    penaltyAmount?: number;
    finalFreightPaid?: number;
    billingStatus?:
      | "Pending"
      | "Advance Claimed"
      | "Advance Paid"
      | "Final Settlement Claimed"
      | "Settled";
  }
}
