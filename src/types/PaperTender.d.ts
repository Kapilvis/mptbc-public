declare namespace PaperTender {
  type TenderStatus = "Draft" | "Published" | "Under Evaluation" | "Awarded";

  interface TenderLotItem {
    lotNo: number;
    gsmCode: string;
    gsmName: string;
    paperCategory: string;
    quantityMt: number;
    bisStandard: string;
    estimatedCostLakhs: number;
    deliveryDepots: string[];
  }

  interface TenderComplianceItem {
    id: string;
    label: string;
    description: string;
    required: boolean;
    checked: boolean;
  }

  interface Item {
    tenderId: number;
    tenderRefNo: string;
    academicYear: string;
    tenderTitle: string;
    tenderType: string;
    contractForm: string;
    emdAmount: number;
    tenderFee: number;
    processingFee: number;
    bidValidityDays: number;

    // Schedule Dates
    publishDate: string;
    docDownloadStartDate: string;
    docDownloadEndDate: string;
    preBidMeetingDate: string;
    preBidVenue: string;
    bidSubmissionEndDate: string;
    techBidOpeningDate: string;

    // Aggregates & Lots
    totalGrossTonnageMt: number;
    totalEstBudgetCrores: number;
    lots: TenderLotItem[];
    complianceChecklist: TenderComplianceItem[];

    status: TenderStatus;
    createdBy?: string;
    publishedDate?: string;
  }

  interface Filter {
    academicYear?: string;
    tenderType?: string;
    status?: string;
    search?: string;
  }
}
