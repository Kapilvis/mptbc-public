declare namespace Distribution {
  type DemandStatus =
    | "Approved"
    | "Pending"
    | "In Process"
    | "Rejected"
    | "Hold";

  type ReceiptStatus = "Pending" | "Received" | "Need Info";

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

  interface DemandApprovalItem {
    id: number;
    agencyName: string;
    district: string;
    titleName: string;
    bookType: string;
    classGroup: string;
    medium: string;
    requestedDemand: number;
    currentStock: number;
    variance: string;
    status: DemandStatus;
    academicYear?: string;
  }

  interface DemandApprovalFilter {
    academicYear?: string;
    agency?: string;
    bookType?: string;
    classGroup?: string;
    search?: string;
  }

  // Title Received (RSK / CPI Receiving Desk) Types
  interface TitleReceivedItem {
    id: number;
    titleCode: string;
    titleName: string;
    localTitleName?: string;
    department: "RSK" | "CPI";
    className: string;
    medium: string;
    bookType: string;
    totalPages: number;
    innerGsm: string;
    coverGsm: string;
    weight: number;
    paperArea: number;
    submissionDate: string;
    receiptStatus: ReceiptStatus;
    matterDocumentUrl?: string;
    receivedBy?: string;
    receiptDate?: string;
    remarks?: string;
    academicYear?: string;
  }

  interface TitleReceivedFilter {
    academicYear?: string;
    department?: string;
    receiptStatus?: string;
    search?: string;
  }

  // Title Approval Types
  interface TitleApprovalItem {
    id: number;
    titleCode: string;
    titleName: string;
    localTitleName?: string;
    department: "RSK" | "CPI";
    className: string;
    medium: string;
    bookType: string;
    totalPages: number;
    innerGsm: string;
    coverGsm: string;
    weight: number;
    paperArea: number;
    receivedDate: string;
    status: "Approved" | "Pending" | "Rejected" | "Hold";
    matterDocumentUrl?: string;
    approvedBy?: string;
    approvalDate?: string;
    academicYear?: string;
  }

  interface TitleApprovalFilter {
    academicYear?: string;
    department?: string;
    status?: string;
    search?: string;
  }
}
