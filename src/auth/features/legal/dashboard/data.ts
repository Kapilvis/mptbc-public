export interface AdvocateDetails {
  standingCounsel: string;
  contact: string;
}

export interface OwdCompliance {
  isOwd: boolean;
  directionSummary?: string | null;
  complianceDeadline?: string | null;
}

export interface AuditTrailEvent {
  date: string;
  event: string;
  court: string;
}

export interface LegalCaseItem {
  id: string;
  caseId: string;
  courtBench: "Principal Seat Jabalpur" | "Bench Gwalior" | "Bench Indore";
  caseType: "WP" | "WA" | "CONC" | "SLP" | "ARB";
  caseNumber: string;
  filingYear: number;
  district: string;
  caseSubject:
    | "Printer LD & Penalty Dispute"
    | "Paper Quality Dispute"
    | "Employee Increment"
    | "Retirement Benefits"
    | "Transfer Matter"
    | "Service Salary Matter";
  petitioner: string;
  respondent: string;
  advocateDetails: AdvocateDetails;
  priorityFlag:
    | "HIGH_PRIORITY"
    | "UPCOMING_HEARING"
    | "PENDING"
    | "OWD_DISPOSED";
  statusStage:
    | "PENDING_HEARING"
    | "COUNTER_AFFIDAVIT_FILED"
    | "STAY_ORDER_ACTIVE"
    | "ORDER_PASSED";
  nextHearingDate: string;
  owdCompliance: OwdCompliance;
  financialStakeLakhs: number;
  auditTrail: AuditTrailEvent[];
}

export const initialLegalKpis = {
  highPriorityCount: 171,
  upcomingHearingsCount: 338,
  pendingCasesCount: 12441,
  owdDisposedCount: 11121,
  totalFinancialStakeCr: "₹ 48.50 Cr",
};

export const courtBenchDistributionData = [
  {
    bench: "Principal Seat Jabalpur",
    casesCount: 6840,
    percentage: 55,
    color: "#006A38",
  },
  {
    bench: "High Court Bench Gwalior",
    casesCount: 3230,
    percentage: 26,
    color: "#2563eb",
  },
  {
    bench: "High Court Bench Indore",
    casesCount: 2371,
    percentage: 19,
    color: "#d97706",
  },
];

export const caseTypeDistributionData = [
  { type: "WP (Writ Petition)", count: 7420, color: "#006A38" },
  { type: "CONC (Contempt Case)", count: 2810, color: "#2563eb" },
  { type: "WA (Writ Appeal)", count: 1240, color: "#d97706" },
  { type: "SLP (Supreme Court)", count: 580, color: "#7c3aed" },
  { type: "ARB (Arbitration)", count: 391, color: "#dc2626" },
];

export const yearWiseBreakdownData = [
  { year: "2026 (Current)", activeCount: 1840, resolvedCount: 920 },
  { year: "2025", activeCount: 3450, resolvedCount: 2810 },
  { year: "2024", activeCount: 2980, resolvedCount: 3120 },
  { year: "2023", activeCount: 2150, resolvedCount: 2430 },
  { year: "2020 - 2022", activeCount: 2021, resolvedCount: 1841 },
];

export const subjectMatrixData = [
  {
    subject: "Printer LD & Penalty Dispute",
    active: 42,
    stake: "₹ 18.40 Cr",
    risk: "HIGH",
  },
  {
    subject: "Paper Quality & Wastage",
    active: 35,
    stake: "₹ 14.20 Cr",
    risk: "HIGH",
  },
  {
    subject: "Service Salary & Pay Scale",
    active: 28,
    stake: "₹ 6.80 Cr",
    risk: "MEDIUM",
  },
  {
    subject: "Employee Increment Arrears",
    active: 24,
    stake: "₹ 4.10 Cr",
    risk: "MEDIUM",
  },
  {
    subject: "Retirement Benefits & Pension",
    active: 18,
    stake: "₹ 3.20 Cr",
    risk: "LOW",
  },
  {
    subject: "Staff Transfer Orders",
    active: 14,
    stake: "₹ 1.80 Cr",
    risk: "LOW",
  },
];

export const initialLegalCases: LegalCaseItem[] = [
  {
    id: "CAS-001",
    caseId: "CAS-MPTBC-2026-0941",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WP",
    caseNumber: "WP/14820/2026",
    filingYear: 2026,
    district: "Bhopal",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "G Tech Print Works Ltd.",
    respondent: "Managing Director, MP Textbook Corporation & Others",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma (High Court Jabalpur)",
      contact: "+91 98260 11223",
    },
    priorityFlag: "HIGH_PRIORITY",
    statusStage: "STAY_ORDER_ACTIVE",
    nextHearingDate: "2026-08-28",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 42.5,
    auditTrail: [
      {
        date: "2026-08-10",
        event: "Writ Petition Filed & Stay Order Granted",
        court: "Jabalpur High Court Bench 2",
      },
      {
        date: "2026-08-18",
        event: "Counter Affidavit Drafted by MP TBC Legal Cell",
        court: "Standing Counsel Office",
      },
    ],
  },
  {
    id: "CAS-002",
    caseId: "CAS-MPTBC-2026-0942",
    courtBench: "Bench Gwalior",
    caseType: "WA",
    caseNumber: "WA/8820/2026",
    filingYear: 2026,
    district: "Gwalior",
    caseSubject: "Paper Quality Dispute",
    petitioner: "Star Paper Mills India Ltd.",
    respondent: "General Manager (Paper), MP Textbook Corporation",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava (High Court Gwalior)",
      contact: "+91 94250 88776",
    },
    priorityFlag: "UPCOMING_HEARING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-08-30",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 85.0,
    auditTrail: [
      {
        date: "2026-07-15",
        event: "Writ Appeal Filed against Lab Penalty Order",
        court: "Gwalior Division Bench",
      },
      {
        date: "2026-08-05",
        event: "Rejoinder Filed by State Standing Counsel",
        court: "Gwalior High Court",
      },
    ],
  },
  {
    id: "CAS-003",
    caseId: "CAS-MPTBC-2026-0943",
    courtBench: "Bench Indore",
    caseType: "CONC",
    caseNumber: "CONC/4412/2025",
    filingYear: 2025,
    district: "Indore",
    caseSubject: "Employee Increment",
    petitioner: "Indore Depot Staff Welfare Association",
    respondent: "Managing Director & Secretary, MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Sunita Deshmukh (High Court Indore)",
      contact: "+91 98270 33445",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-09-05",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Release 7th Pay Commission 3rd increment arrears within 45 days of court order.",
      complianceDeadline: "2026-09-15",
    },
    financialStakeLakhs: 18.2,
    auditTrail: [
      {
        date: "2025-11-20",
        event: "Order with Direction (OwD) Passed by Single Bench",
        court: "Indore High Court Bench",
      },
      {
        date: "2026-08-01",
        event: "Compliance Report Sent to Finance & HRMS Cell",
        court: "MP TBC Head Office Bhopal",
      },
    ],
  },
  {
    id: "CAS-004",
    caseId: "CAS-MPTBC-2026-0944",
    courtBench: "Principal Seat Jabalpur",
    caseType: "SLP",
    caseNumber: "SLP/1092/2025",
    filingYear: 2025,
    district: "Bhopal",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "MP Textbook Corporation",
    respondent: "Central India Offset Printers Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Manoj Kumar Mishra (Supreme Court New Delhi)",
      contact: "+91 98110 55667",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-09-12",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 120.0,
    auditTrail: [
      {
        date: "2025-09-10",
        event: "SLP Filed in Supreme Court of India",
        court: "Supreme Court Bench 3",
      },
    ],
  },
  {
    id: "CAS-005",
    caseId: "CAS-MPTBC-2026-0945",
    courtBench: "Principal Seat Jabalpur",
    caseType: "ARB",
    caseNumber: "ARB/302/2026",
    filingYear: 2026,
    district: "Ujjain",
    caseSubject: "Retirement Benefits",
    petitioner: "Ramswaroop Sharma (Retd. Depot Superintendent)",
    respondent: "Managing Director, MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Virendra Singh (High Court Jabalpur)",
      contact: "+91 94065 22114",
    },
    priorityFlag: "HIGH_PRIORITY",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-08-29",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 12.4,
    auditTrail: [
      {
        date: "2026-06-10",
        event: "Arbitration Application Submitted",
        court: "High Court Arbitration Cell Jabalpur",
      },
    ],
  },
];
