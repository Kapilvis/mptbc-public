declare namespace Distribution {
  export interface TitleApprovalItem {
    id: number;
    titleCode: string;
    titleName: string;
    localTitleName?: string;
    department: "RSK" | "CPI";
    className: string;
    medium: string;
    bookType: string;
    innerPages: number;
    coverPages: number;
    totalPages: number;
    innerGsm: string;
    coverGsm: string;
    weight: number;
    paperArea: number;
    matterDocumentUrl: string;
    receivedDate: string;
    status: "Pending" | "Approved" | "Rejected" | "Hold";
    academicYear: string;
    approvedBy?: string;
    approvalDate?: string;
  }

  export interface TitleApprovalFilter {
    academicYear?: string;
    department?: string;
    status?: string;
    search?: string;
  }
}
