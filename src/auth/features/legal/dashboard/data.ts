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
  totalCasesCount: 28,
  highPriorityCount: 2,
  upcomingHearingsCount: 4,
  pendingCasesCount: 15,
  owdDisposedCount: 7,
  totalFinancialStakeCr: "₹ 1.85 Cr",
};

export const courtBenchDistributionData = [
  {
    bench: "Principal Seat Jabalpur",
    casesCount: 15,
    percentage: 54,
    color: "#006A38",
  },
  {
    bench: "High Court Bench Gwalior",
    casesCount: 8,
    percentage: 28,
    color: "#2563eb",
  },
  {
    bench: "High Court Bench Indore",
    casesCount: 5,
    percentage: 18,
    color: "#d97706",
  },
];

export const caseTypeDistributionData = [
  { type: "WP (Writ Petition)", count: 16, color: "#006A38" },
  { type: "CONC (Contempt Case)", count: 6, color: "#2563eb" },
  { type: "WA (Writ Appeal)", count: 3, color: "#d97706" },
  { type: "SLP (Supreme Court)", count: 2, color: "#7c3aed" },
  { type: "ARB (Arbitration)", count: 1, color: "#dc2626" },
];

export const yearWiseBreakdownData = [
  { year: "2026 (Current)", activeCount: 8, resolvedCount: 4 },
  { year: "2025", activeCount: 10, resolvedCount: 8 },
  { year: "2024", activeCount: 6, resolvedCount: 5 },
  { year: "2023", activeCount: 3, resolvedCount: 4 },
  { year: "2020 - 2022", activeCount: 1, resolvedCount: 3 },
];

export const subjectMatrixData = [
  {
    subject: "Printer LD & Penalty Dispute",
    active: 10,
    stake: "₹ 0.85 Cr",
    risk: "HIGH",
  },
  {
    subject: "Paper Quality & Wastage",
    active: 7,
    stake: "₹ 0.52 Cr",
    risk: "HIGH",
  },
  {
    subject: "Service Salary & Pay Scale",
    active: 5,
    stake: "₹ 0.28 Cr",
    risk: "MEDIUM",
  },
  {
    subject: "Employee Increment Arrears",
    active: 3,
    stake: "₹ 0.12 Cr",
    risk: "MEDIUM",
  },
  {
    subject: "Retirement Benefits & Pension",
    active: 2,
    stake: "₹ 0.05 Cr",
    risk: "LOW",
  },
  {
    subject: "Staff Transfer Orders",
    active: 1,
    stake: "₹ 0.03 Cr",
    risk: "LOW",
  },
];

export const initialLegalCases: LegalCaseItem[] = [
  // ─── HIGH PRIORITY (2 CASES) ───────────────────────────────────────────────
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

  // ─── UPCOMING HEARINGS (4 CASES) ──────────────────────────────────────────
  {
    id: "CAS-003",
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
    ],
  },
  {
    id: "CAS-004",
    caseId: "CAS-MPTBC-2026-0946",
    courtBench: "Bench Indore",
    caseType: "WP",
    caseNumber: "WP/9921/2026",
    filingYear: 2026,
    district: "Indore",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Malwa Printers & Publishers Indore",
    respondent: "MP TBC Regional Officer Indore",
    advocateDetails: {
      standingCounsel: "Adv. Sunita Deshmukh (High Court Indore)",
      contact: "+91 98270 33445",
    },
    priorityFlag: "UPCOMING_HEARING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-09-02",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 24.0,
    auditTrail: [
      {
        date: "2026-08-01",
        event: "Notice Issued by Indore High Court",
        court: "Indore Bench 1",
      },
    ],
  },
  {
    id: "CAS-005",
    caseId: "CAS-MPTBC-2026-0947",
    courtBench: "Principal Seat Jabalpur",
    caseType: "CONC",
    caseNumber: "CONC/1120/2026",
    filingYear: 2026,
    district: "Jabalpur",
    caseSubject: "Service Salary Matter",
    petitioner: "Jabalpur Depot Staff Association",
    respondent: "GM HRMS, MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma (High Court Jabalpur)",
      contact: "+91 98260 11223",
    },
    priorityFlag: "UPCOMING_HEARING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-09-04",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 14.5,
    auditTrail: [
      {
        date: "2026-07-20",
        event: "Contempt Petition Served to GM HRMS",
        court: "Jabalpur Bench 3",
      },
    ],
  },
  {
    id: "CAS-006",
    caseId: "CAS-MPTBC-2026-0948",
    courtBench: "Bench Gwalior",
    caseType: "WP",
    caseNumber: "WP/4410/2026",
    filingYear: 2026,
    district: "Morena",
    caseSubject: "Transfer Matter",
    petitioner: "S. K. Verma (Assistant Storekeeper)",
    respondent: "MP Textbook Corporation Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava (High Court Gwalior)",
      contact: "+91 94250 88776",
    },
    priorityFlag: "UPCOMING_HEARING",
    statusStage: "STAY_ORDER_ACTIVE",
    nextHearingDate: "2026-09-06",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 3.0,
    auditTrail: [
      {
        date: "2026-08-12",
        event: "Interim Stay Order Granted on Transfer",
        court: "Gwalior Bench 2",
      },
    ],
  },

  // ─── PENDING CASES (15 CASES) ─────────────────────────────────────────────
  {
    id: "CAS-007",
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
    id: "CAS-008",
    caseId: "CAS-MPTBC-2026-0949",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WP",
    caseNumber: "WP/11840/2025",
    filingYear: 2025,
    district: "Sagar",
    caseSubject: "Paper Quality Dispute",
    petitioner: "Orient Paper Mills Ltd.",
    respondent: "Managing Director, MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "PENDING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-09-15",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 52.0,
    auditTrail: [
      {
        date: "2025-10-01",
        event: "Paper Deduction Challenged",
        court: "Jabalpur Single Bench",
      },
    ],
  },
  {
    id: "CAS-009",
    caseId: "CAS-MPTBC-2026-0950",
    courtBench: "Bench Gwalior",
    caseType: "WP",
    caseNumber: "WP/7740/2025",
    filingYear: 2025,
    district: "Bhind",
    caseSubject: "Employee Increment",
    petitioner: "Bhind Depot Staff Union",
    respondent: "MP TBC Head Office",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-09-18",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 12.0,
    auditTrail: [
      {
        date: "2025-08-15",
        event: "Increment Petition Admitted",
        court: "Gwalior High Court",
      },
    ],
  },
  {
    id: "CAS-010",
    caseId: "CAS-MPTBC-2026-0951",
    courtBench: "Bench Indore",
    caseType: "WP",
    caseNumber: "WP/3340/2025",
    filingYear: 2025,
    district: "Ujjain",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Ujjain Graphic Offset Ltd.",
    respondent: "GM Production MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Sunita Deshmukh",
      contact: "+91 98270 33445",
    },
    priorityFlag: "PENDING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-09-20",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 18.5,
    auditTrail: [
      {
        date: "2025-06-12",
        event: "Penalty Recovery Stayed",
        court: "Indore Single Bench",
      },
    ],
  },
  {
    id: "CAS-011",
    caseId: "CAS-MPTBC-2026-0952",
    courtBench: "Bench Gwalior",
    caseType: "CONC",
    caseNumber: "CONC/881/2025",
    filingYear: 2025,
    district: "Guna",
    caseSubject: "Retirement Benefits",
    petitioner: "Prahlad Singh (Retd. Clerk)",
    respondent: "Finance Officer MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-09-22",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 5.0,
    auditTrail: [
      {
        date: "2025-07-22",
        event: "Contempt Notice Issued",
        court: "Gwalior Bench",
      },
    ],
  },
  {
    id: "CAS-012",
    caseId: "CAS-MPTBC-2026-0953",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WP",
    caseNumber: "WP/20140/2024",
    filingYear: 2024,
    district: "Rewa",
    caseSubject: "Service Salary Matter",
    petitioner: "Rewa Depot Cadre Association",
    respondent: "MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "PENDING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-09-25",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 28.0,
    auditTrail: [
      {
        date: "2024-11-10",
        event: "Salary Revision Case Pending",
        court: "Jabalpur High Court",
      },
    ],
  },
  {
    id: "CAS-013",
    caseId: "CAS-MPTBC-2026-0954",
    courtBench: "Bench Indore",
    caseType: "WA",
    caseNumber: "WA/1204/2024",
    filingYear: 2024,
    district: "Khandwa",
    caseSubject: "Paper Quality Dispute",
    petitioner: "Central Paper Trading Co.",
    respondent: "General Manager Paper MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Sunita Deshmukh",
      contact: "+91 98270 33445",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-09-28",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 14.0,
    auditTrail: [
      {
        date: "2024-09-18",
        event: "Writ Appeal Listed",
        court: "Indore Division Bench",
      },
    ],
  },
  {
    id: "CAS-014",
    caseId: "CAS-MPTBC-2026-0955",
    courtBench: "Bench Gwalior",
    caseType: "WP",
    caseNumber: "WP/18920/2024",
    filingYear: 2024,
    district: "Shivpuri",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Shivpuri Print Care",
    respondent: "MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "PENDING",
    statusStage: "STAY_ORDER_ACTIVE",
    nextHearingDate: "2026-10-02",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 9.5,
    auditTrail: [
      {
        date: "2024-10-05",
        event: "LD Deduction Stayed",
        court: "Gwalior Single Bench",
      },
    ],
  },
  {
    id: "CAS-015",
    caseId: "CAS-MPTBC-2026-0956",
    courtBench: "Principal Seat Jabalpur",
    caseType: "CONC",
    caseNumber: "CONC/402/2024",
    filingYear: 2024,
    district: "Chhindwara",
    caseSubject: "Employee Increment",
    petitioner: "M. L. Gupta (Accountant)",
    respondent: "Secretary MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "PENDING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-10-05",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 4.1,
    auditTrail: [
      {
        date: "2024-04-12",
        event: "Increment Compliance Sought",
        court: "Jabalpur High Court",
      },
    ],
  },
  {
    id: "CAS-016",
    caseId: "CAS-MPTBC-2026-0957",
    courtBench: "Bench Indore",
    caseType: "SLP",
    caseNumber: "SLP/882/2024",
    filingYear: 2024,
    district: "Dewas",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Dewas Offset Press",
    respondent: "Managing Director MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Manoj Kumar Mishra",
      contact: "+91 98110 55667",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-10-08",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 35.0,
    auditTrail: [
      {
        date: "2024-08-20",
        event: "SLP Pending Admission",
        court: "Supreme Court New Delhi",
      },
    ],
  },
  {
    id: "CAS-017",
    caseId: "CAS-MPTBC-2026-0958",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WP",
    caseNumber: "WP/9041/2023",
    filingYear: 2023,
    district: "Damoh",
    caseSubject: "Paper Quality Dispute",
    petitioner: "Shree Krishna Paper Supply",
    respondent: "GM Logistics MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "PENDING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-10-12",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 8.2,
    auditTrail: [
      {
        date: "2023-05-14",
        event: "Wastage Claim Listed",
        court: "Jabalpur High Court",
      },
    ],
  },
  {
    id: "CAS-018",
    caseId: "CAS-MPTBC-2026-0959",
    courtBench: "Bench Gwalior",
    caseType: "CONC",
    caseNumber: "CONC/190/2023",
    filingYear: 2023,
    district: "Datia",
    caseSubject: "Transfer Matter",
    petitioner: "Rakesh Kumar (Driver)",
    respondent: "MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-10-15",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 1.8,
    auditTrail: [
      {
        date: "2023-09-02",
        event: "Contempt Notice Received",
        court: "Gwalior High Court",
      },
    ],
  },
  {
    id: "CAS-019",
    caseId: "CAS-MPTBC-2026-0960",
    courtBench: "Bench Indore",
    caseType: "WP",
    caseNumber: "WP/14402/2023",
    filingYear: 2023,
    district: "Ratlam",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Ratlam Printers Pvt Ltd",
    respondent: "MP TBC Regional Office Indore",
    advocateDetails: {
      standingCounsel: "Adv. Sunita Deshmukh",
      contact: "+91 98270 33445",
    },
    priorityFlag: "PENDING",
    statusStage: "STAY_ORDER_ACTIVE",
    nextHearingDate: "2026-10-18",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 11.0,
    auditTrail: [
      {
        date: "2023-11-20",
        event: "Rejoinder Filed",
        court: "Indore High Court",
      },
    ],
  },
  {
    id: "CAS-020",
    caseId: "CAS-MPTBC-2026-0961",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WP",
    caseNumber: "WP/28901/2022",
    filingYear: 2022,
    district: "Bhopal",
    caseSubject: "Retirement Benefits",
    petitioner: "B. P. Saxena (Retd. Superintendent)",
    respondent: "MD MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "PENDING",
    statusStage: "COUNTER_AFFIDAVIT_FILED",
    nextHearingDate: "2026-10-22",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 3.2,
    auditTrail: [
      {
        date: "2022-12-10",
        event: "Pension Calculation Submitted",
        court: "Jabalpur High Court",
      },
    ],
  },
  {
    id: "CAS-021",
    caseId: "CAS-MPTBC-2026-0962",
    courtBench: "Bench Gwalior",
    caseType: "CONC",
    caseNumber: "CONC/771/2022",
    filingYear: 2022,
    district: "Gwalior",
    caseSubject: "Service Salary Matter",
    petitioner: "Gwalior Depot Helpers Union",
    respondent: "MP TBC Head Office",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "PENDING",
    statusStage: "PENDING_HEARING",
    nextHearingDate: "2026-10-25",
    owdCompliance: {
      isOwd: false,
      directionSummary: null,
      complianceDeadline: null,
    },
    financialStakeLakhs: 6.8,
    auditTrail: [
      {
        date: "2022-07-15",
        event: "Reply Filed by State",
        court: "Gwalior High Court",
      },
    ],
  },

  // ─── OwD DISPOSED (7 CASES) ───────────────────────────────────────────────
  {
    id: "CAS-022",
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
      standingCounsel: "Adv. Sunita Deshmukh",
      contact: "+91 98270 33445",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-09-05",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Release 7th Pay Commission 3rd increment arrears within 45 days.",
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
    id: "CAS-023",
    caseId: "CAS-MPTBC-2026-0963",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WP",
    caseNumber: "WP/11020/2025",
    filingYear: 2025,
    district: "Jabalpur",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Jabalpur Printing Press Pvt Ltd",
    respondent: "MD MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-08-15",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Re-examine LD penalty calculation as per tender clause 14B.",
      complianceDeadline: "2026-08-30",
    },
    financialStakeLakhs: 15.0,
    auditTrail: [
      {
        date: "2025-10-10",
        event: "OwD Order Complied & Closed",
        court: "Jabalpur High Court",
      },
    ],
  },
  {
    id: "CAS-024",
    caseId: "CAS-MPTBC-2026-0964",
    courtBench: "Bench Gwalior",
    caseType: "WP",
    caseNumber: "WP/8901/2025",
    filingYear: 2025,
    district: "Gwalior",
    caseSubject: "Retirement Benefits",
    petitioner: "K. L. Sharma (Retd. Depot Manager)",
    respondent: "MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-08-10",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Disburse gratuity & leave encashment arrears with 6% interest.",
      complianceDeadline: "2026-08-25",
    },
    financialStakeLakhs: 14.8,
    auditTrail: [
      {
        date: "2025-12-05",
        event: "Gratuity Disbursed to Petitioner Bank A/c",
        court: "Gwalior Bench",
      },
    ],
  },
  {
    id: "CAS-025",
    caseId: "CAS-MPTBC-2026-0965",
    courtBench: "Principal Seat Jabalpur",
    caseType: "WA",
    caseNumber: "WA/3310/2024",
    filingYear: 2024,
    district: "Satna",
    caseSubject: "Paper Quality Dispute",
    petitioner: "Vindhya Paper Mills Ltd",
    respondent: "GM Paper MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-07-20",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Accept Central Paper Lab re-test report and release 90% payment.",
      complianceDeadline: "2026-08-10",
    },
    financialStakeLakhs: 48.0,
    auditTrail: [
      {
        date: "2024-09-15",
        event: "Lab Re-test Payment Processed by Finance",
        court: "MP TBC Bhopal",
      },
    ],
  },
  {
    id: "CAS-026",
    caseId: "CAS-MPTBC-2026-0966",
    courtBench: "Bench Indore",
    caseType: "WP",
    caseNumber: "WP/6641/2024",
    filingYear: 2024,
    district: "Khargone",
    caseSubject: "Transfer Matter",
    petitioner: "Anil Kumar Joshi (Inspector)",
    respondent: "MP TBC Bhopal",
    advocateDetails: {
      standingCounsel: "Adv. Sunita Deshmukh",
      contact: "+91 98270 33445",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-06-30",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Decide representation regarding medical ground transfer within 30 days.",
      complianceDeadline: "2026-07-30",
    },
    financialStakeLakhs: 1.5,
    auditTrail: [
      {
        date: "2024-07-02",
        event: "Transfer Modified to Indore Depot",
        court: "MP TBC HRMS Cell",
      },
    ],
  },
  {
    id: "CAS-027",
    caseId: "CAS-MPTBC-2026-0967",
    courtBench: "Principal Seat Jabalpur",
    caseType: "CONC",
    caseNumber: "CONC/1190/2024",
    filingYear: 2024,
    district: "Bhopal",
    caseSubject: "Employee Increment",
    petitioner: "Bhopal HQ Staff Association",
    respondent: "MD MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Rameshwar Dayal Sharma",
      contact: "+91 98260 11223",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-05-18",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Implement 7th Pay scale matrix for Level 5 to 9 staff.",
      complianceDeadline: "2026-06-15",
    },
    financialStakeLakhs: 22.0,
    auditTrail: [
      {
        date: "2024-06-01",
        event: "Pay Scale Orders Disbursed via Treasury",
        court: "Bhopal Treasury",
      },
    ],
  },
  {
    id: "CAS-028",
    caseId: "CAS-MPTBC-2026-0968",
    courtBench: "Bench Gwalior",
    caseType: "WP",
    caseNumber: "WP/4012/2023",
    filingYear: 2023,
    district: "Gwalior",
    caseSubject: "Printer LD & Penalty Dispute",
    petitioner: "Gwalior Offset Printers",
    respondent: "GM Production MP TBC",
    advocateDetails: {
      standingCounsel: "Adv. Alok Kumar Shrivastava",
      contact: "+91 94250 88776",
    },
    priorityFlag: "OWD_DISPOSED",
    statusStage: "ORDER_PASSED",
    nextHearingDate: "2026-04-10",
    owdCompliance: {
      isOwd: true,
      directionSummary:
        "Waive 50% LD penalty due to unseasonal rain paper delivery delay.",
      complianceDeadline: "2026-05-10",
    },
    financialStakeLakhs: 16.5,
    auditTrail: [
      {
        date: "2023-06-12",
        event: "Penalty Waiver Passed by Board of Directors",
        court: "MP TBC Bhopal",
      },
    ],
  },
];
