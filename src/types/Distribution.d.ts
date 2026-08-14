declare namespace Distribution {
  type DemandStatus = "Approved" | "Pending" | "In Process" | "Rejected";

  interface DepartmentDemandItem {
    id: number;
    agency: string;
    district: string;
    block: string;
    titleName: string;
    medium: string;
    classNo: number;
    demandQty: number;
    receivedDate: string;
    status: DemandStatus;

    // Tracker details
    grossDemand: number;
    sentToBrc: number;
    sentPercent: number;
    brcReceived: number;
    sentToSchool: number;
    distributedToStudent: number;
    academicYear?: string;
  }

  interface DepartmentDemandFilter {
    academicYear?: string;
    department?: string;
    district?: string;
    medium?: string;
    search?: string;
  }
}
