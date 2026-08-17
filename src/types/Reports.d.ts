declare namespace Reports {
  export interface AgencyDemandReportItem {
    id: number;
    depotSNo: number;
    depotName: string;
    districtName: string;
    demand: number;
    supply: number;
    supplyPercent: number;
    isDepotTotal?: boolean;
  }

  export interface AgencyDemandReportFilter {
    academicYear?: string;
    depotName?: string;
    search?: string;
    tier: "class1to4" | "class5to8" | "class9to12";
  }
}
