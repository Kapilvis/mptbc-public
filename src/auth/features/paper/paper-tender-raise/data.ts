export const mockPaperTenderData: PaperTender.Item = {
  tenderId: 1,
  tenderRefNo: "MPTBC/PAPER/2026-27/P-1",
  academicYear: "2026-2027",
  tenderTitle:
    "Notice Inviting Tender for Procurement of Printing Maplitho & Art Card Cover Paper (Academic Year 2026-27)",
  tenderType: "Open Tender (Two Envelope System)",
  contractForm: "Item Wise Rate Contract",
  emdAmount: 1000000,
  tenderFee: 35400,
  processingFee: 295,
  bidValidityDays: 180,

  // Schedule Dates
  publishDate: "2026-08-20",
  docDownloadStartDate: "2026-08-21",
  docDownloadEndDate: "2026-09-08",
  preBidMeetingDate: "2026-08-28",
  preBidVenue: "Conference Hall, MPTBC Head Office, Arera Hills, Bhopal (M.P.)",
  bidSubmissionEndDate: "2026-09-10",
  techBidOpeningDate: "2026-09-12",

  totalGrossTonnageMt: 1308.7,
  totalEstBudgetCrores: 9.85,

  lots: [
    {
      lotNo: 1,
      gsmCode: "GSM-58-REEL",
      gsmName: "58 GSM Maplitho Reel Paper",
      paperCategory: "Reel Paper (Inner)",
      quantityMt: 441.525,
      bisStandard: "IS 1848:2007 (Min 80% Brightness)",
      estimatedCostLakhs: 300.23,
      deliveryDepots: [
        "Central Godown Bhopal",
        "Indore Depot",
        "Gwalior Depot",
      ],
    },
    {
      lotNo: 2,
      gsmCode: "GSM-70-REEL",
      gsmName: "70 GSM Maplitho Reel Paper",
      paperCategory: "Reel Paper (Inner)",
      quantityMt: 404.46,
      bisStandard: "IS 1848:2007 (Min 82% Brightness)",
      estimatedCostLakhs: 291.21,
      deliveryDepots: ["Central Godown Bhopal", "Jabalpur Depot"],
    },
    {
      lotNo: 3,
      gsmCode: "GSM-200-SHEET",
      gsmName: "200 GSM Art Card Sheet Paper",
      paperCategory: "Sheet Paper (Cover)",
      quantityMt: 129.574,
      bisStandard: "IS 4658:1988 (Coated Art Card)",
      estimatedCostLakhs: 110.13,
      deliveryDepots: ["Central Godown Bhopal"],
    },
    {
      lotNo: 4,
      gsmCode: "GSM-250-SHEET",
      gsmName: "250 GSM Art Card Sheet Paper",
      paperCategory: "Sheet Paper (Cover)",
      quantityMt: 149.762,
      bisStandard: "IS 4658:1988 (High Bulk Cover Card)",
      estimatedCostLakhs: 134.78,
      deliveryDepots: ["Central Godown Bhopal", "Indore Depot"],
    },
  ],

  complianceChecklist: [
    {
      id: "comp-1",
      label:
        "Valid BIS Quality Registration Certificate & ISO 9001:2015 Certification",
      description:
        "Mandatory Bureau of Indian Standards (BIS) mill registration certificate",
      required: true,
      checked: true,
    },
    {
      id: "comp-2",
      label:
        "Valid GST Registration & Income Tax Returns for FY 2023-24 & 2024-25",
      description:
        "Copy of GST return filings & audited balance sheet certified by CA",
      required: true,
      checked: true,
    },
    {
      id: "comp-3",
      label: "Paper Mill Annual Manufacturing Capacity Audit Report",
      description:
        "Minimum 15,000 MT annual production capacity verification report",
      required: true,
      checked: true,
    },
    {
      id: "comp-4",
      label: "Declaration of Non-Debarment / Non-Blacklisting (Annexure VII)",
      description:
        "Self-attested affidavit on Rs. 100 non-judicial stamp paper",
      required: true,
      checked: true,
    },
  ],

  status: "Draft",
};
