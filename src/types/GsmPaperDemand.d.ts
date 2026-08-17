declare namespace Paper {
  type DemandLockStatus = "Draft" | "Locked";

  interface GsmPaperDemandItem {
    id: number;
    gsmCode: string;
    gsmName: string;
    gsmValue: number;
    paperCategory: "Reel Paper (Inner)" | "Sheet Paper (Cover)";
    usageType: string;
    titlesCount: number;
    totalBooksCount: number;
    netDemandMt: number;
    wastagePercent: number;
    grossDemandMt: number;
    estPricePerMt: number;
    totalBudgetLakhs: number;
    status: DemandLockStatus;
    lockedBy?: string;
    lockedDate?: string;
    academicYear?: string;
  }

  interface GsmPaperDemandFilter {
    academicYear?: string;
    paperCategory?: string;
    status?: string;
    search?: string;
  }
}
