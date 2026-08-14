declare namespace Report {
  // ── Depot Wise District Textbook Supply Status ─────────────────────────────
  interface DepotWiseDistrictTextbookSupplyStatusRow {
    srNo: number;
    depotName: string;
    generalSale: number | string;
    districtName: string;

    class1To8Demand: number | string;
    class1To8Supply: number | string;
    class1To8SupplyPercent: number | string;

    class9To12Demand: number | string;
    class9To12Supply: number | string;
    class9To12SupplyPercent: number | string;

    totalDemand: number | string;
    totalSupply: number | string;
    totalSupplyPercent: number | string;
  }
}
