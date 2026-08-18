export interface TenderRateSlabs {
  cat1: number; // < 4.5 Ton rate per Ton (Rs)
  cat2: number; // 4.5 - 9.0 Ton rate per Ton (Rs)
  cat3: number; // >= 9.0 Ton rate per Ton (Rs)
}

export interface DistrictTransporterAllocation {
  id: string;
  district: string;
  transporterId: number;
  transporterName: string;
  contractRole: "Primary" | "Secondary" | "Reserve";
  rates: TenderRateSlabs;
  agreementRef?: string;
  emdAmount?: number;
  assignedBlocks?: string[];
}

export interface TenderRecord {
  tenderId: string;
  tenderRefNo: string;
  title: string;
  financialYear: string;
  nitDate: string;
  agreementDate: string;
  validTill: string;
  status: "Active" | "Closed" | "Draft";
  remarks?: string;
  allocations: DistrictTransporterAllocation[];
}

export const mockTendersList: TenderRecord[] = [
  {
    tenderId: "TND-2026-001",
    tenderRefNo: "MPTBC/LOG/2026/01",
    title:
      "Annual State Textbook Transportation Tender (Malwa & Central Division)",
    financialYear: "2026-27",
    nitDate: "2026-01-10",
    agreementDate: "2026-02-01",
    validTill: "2027-03-31",
    status: "Active",
    remarks:
      "Multi-transporter rate contract awarded for Malwa & Bhopal divisions",
    allocations: [
      {
        id: "ALLOC-001",
        district: "Indore",
        transporterId: 3,
        transporterName: "Verma Logistics",
        contractRole: "Primary",
        rates: { cat1: 330, cat2: 480, cat3: 620 },
        agreementRef: "AGR/IND/2026/01",
        emdAmount: 250000,
        assignedBlocks: ["Indore City", "Mhow", "Sanwer"],
      },
      {
        id: "ALLOC-002",
        district: "Indore",
        transporterId: 1,
        transporterName: "Sharma Transport Co.",
        contractRole: "Secondary",
        rates: { cat1: 350, cat2: 500, cat3: 650 },
        agreementRef: "AGR/IND/2026/02",
        emdAmount: 250000,
        assignedBlocks: ["Depalpur", "Hatod"],
      },
      {
        id: "ALLOC-003",
        district: "Bhopal",
        transporterId: 2,
        transporterName: "Patel Roadways",
        contractRole: "Primary",
        rates: { cat1: 340, cat2: 490, cat3: 630 },
        agreementRef: "AGR/BPL/2026/01",
        emdAmount: 200000,
        assignedBlocks: ["Bhopal City", "Kolar", "Berasia"],
      },
      {
        id: "ALLOC-004",
        district: "Bhopal",
        transporterId: 4,
        transporterName: "MP Roadlines",
        contractRole: "Secondary",
        rates: { cat1: 355, cat2: 510, cat3: 645 },
        agreementRef: "AGR/BPL/2026/02",
        emdAmount: 200000,
        assignedBlocks: ["Phanda"],
      },
      {
        id: "ALLOC-005",
        district: "Ujjain",
        transporterId: 3,
        transporterName: "Verma Logistics",
        contractRole: "Primary",
        rates: { cat1: 325, cat2: 475, cat3: 615 },
        agreementRef: "AGR/UJN/2026/01",
        emdAmount: 180000,
        assignedBlocks: ["Ujjain City", "Nagda", "Mahidpur"],
      },
    ],
  },
  {
    tenderId: "TND-2025-004",
    tenderRefNo: "MPTBC/LOG/2025/04",
    title: "Supplementary Textbook Distribution Contract (Gwalior-Chambal)",
    financialYear: "2025-26",
    nitDate: "2025-06-15",
    agreementDate: "2025-07-01",
    validTill: "2026-03-31",
    status: "Closed",
    remarks: "Completed successfully with 98% on-time delivery index",
    allocations: [
      {
        id: "ALLOC-006",
        district: "Gwalior",
        transporterId: 4,
        transporterName: "MP Roadlines",
        contractRole: "Primary",
        rates: { cat1: 320, cat2: 470, cat3: 610 },
        agreementRef: "AGR/GWL/2025/01",
        emdAmount: 150000,
        assignedBlocks: ["Gwalior City", "Dabra", "Morar"],
      },
    ],
  },
];
