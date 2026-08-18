declare namespace PaperSupplyDispatch {
  type DispatchStatus = "Approved" | "Pending" | "In Transit" | "Received";

  interface PaperDispatchItem {
    dispatchId: number;
    challanNo: string;
    challanDate: string;
    orderNo: string;
    orderDate: string;
    dispatchDate: string;
    vendorId: number;
    paperMillName: string;
    paperType: string;
    consigneeName: string;
    godownName: string;
    reelCount: number;
    totalWeightTon: number;
    truckNo: string;
    driverName: string;
    driverMobile: string;
    grNo: string;
    grDate: string;
    remarks?: string;
    challanCopyPath?: string;
    isActive: boolean;
    status: DispatchStatus;
    createdDate?: string;
  }

  interface PaperDispatchForm {
    challanNo: string;
    challanDate: string;
    orderNo: string;
    orderDate: string;
    dispatchDate: string;
    vendorId: number;
    paperMillName: string;
    paperType: string;
    consigneeName: string;
    godownName: string;
    reelCount: number;
    totalWeightTon: number;
    truckNo: string;
    driverName: string;
    driverMobile: string;
    grNo: string;
    grDate: string;
    remarks?: string;
    challanCopyPath?: string;
  }

  interface Filter {
    orderNo?: string;
    consigneeName?: string;
    status?: string;
    search?: string;
  }
}
