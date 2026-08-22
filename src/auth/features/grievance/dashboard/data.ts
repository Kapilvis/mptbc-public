export interface ComplainantDetails {
  name: string;
  designation: string;
  district: string;
  block: string;
  contact: string;
}

export interface IssueDetails {
  subject: string;
  description: string;
  affectedTitle: string;
  shortageQty?: number;
}

export interface AssignedOfficer {
  officerId: string;
  officerName: string;
  role: string;
  slaDeadline: string;
}

export interface AuditTrailItem {
  timestamp: string;
  action: string;
  actor: string;
}

export interface GrievanceTicketItem {
  id: string;
  grievanceId: string;
  cmHelplineRefId: string;
  category:
    | "SCHOOL_SUPPLY_SHORTAGE"
    | "QUALITY_DEFECT"
    | "HRMS_STAFF_GRIEVANCE"
    | "VENDOR_DISPUTE_APPEAL"
    | "TRANSPORT_FREIGHT_CLAIM";
  categoryLabel: string;
  source:
    | "CM_HELPLINE_181"
    | "SAMADHAN_PORTAL"
    | "SCHOOL_PORTAL"
    | "DIRECT_FILING";
  sourceLabel: string;
  filingDate: string;
  complainantDetails: ComplainantDetails;
  issueDetails: IssueDetails;
  escalationLevel: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
  escalationLabel: string;
  assignedOfficer: AssignedOfficer;
  resolutionStatus: "RESOLVED" | "IN_PROGRESS" | "ESCALATED" | "HOLD";
}

export const initialGrievanceKpis = {
  totalGrievances: 142,
  resolvedCount: 88,
  pendingCount: 54,
  cmHelpline181Count: 48,
  cmHelplineSla: "92%",
  schoolShortagesCount: 18,
  vendorAppealsCount: 8,
  avgResolutionDays: "2.8 Days",
};

export const categoryBreakdownData = [
  { category: "School Supply Shortages", count: 42, color: "#006A38" },
  { category: "Textbook Quality & Defects", count: 35, color: "#2563eb" },
  { category: "HRMS Staff Payroll & Leave", count: 28, color: "#d97706" },
  { category: "Vendor Fine & LD Appeals", count: 22, color: "#dc2626" },
  { category: "Depot Transit Freight Claims", count: 15, color: "#7c3aed" },
];

export const levelResolutionData = [
  {
    level: "L1 Resolved (District)",
    count: 88,
    percentage: 62,
    color: "#006A38",
  },
  {
    level: "L2 In Progress (Depot Nodal)",
    count: 34,
    percentage: 24,
    color: "#2563eb",
  },
  {
    level: "L3 Escalated (Head Office)",
    count: 14,
    percentage: 10,
    color: "#d97706",
  },
  {
    level: "L4 Apex Hearing (MD Office)",
    count: 6,
    percentage: 4,
    color: "#dc2626",
  },
];

export const initialGrievanceTickets: GrievanceTicketItem[] = [
  {
    id: "GRV-001",
    grievanceId: "GRV-MPTBC-2026-9941",
    cmHelplineRefId: "CM181-MP-882104",
    category: "SCHOOL_SUPPLY_SHORTAGE",
    categoryLabel: "School Supply Shortage",
    source: "CM_HELPLINE_181",
    sourceLabel: "CM Helpline 181",
    filingDate: "2026-08-18",
    complainantDetails: {
      name: "Rajesh Kumar Meena",
      designation: "BRC Incharge",
      district: "Indore",
      block: "Sanwer",
      contact: "+91 98260 55432",
    },
    issueDetails: {
      subject: "Shortage of Class 8 Mathematics Textbooks at Sanwer BRC",
      description:
        "Approved allotment was 2,500 copies. Received only 1,800 copies from Indore District Depot.",
      affectedTitle: "Class 8 Mathematics (Hindi Medium)",
      shortageQty: 700,
    },
    escalationLevel: "LEVEL_2",
    escalationLabel: "Level 2 (Depot Nodal)",
    assignedOfficer: {
      officerId: "OFF-IND-202",
      officerName: "Ramesh Sharma",
      role: "District Depot Manager, Indore",
      slaDeadline: "2026-08-25",
    },
    resolutionStatus: "IN_PROGRESS",
  },
  {
    id: "GRV-002",
    grievanceId: "GRV-MPTBC-2026-9942",
    cmHelplineRefId: "CM181-MP-882105",
    category: "QUALITY_DEFECT",
    categoryLabel: "Quality & Printing Defect",
    source: "SAMADHAN_PORTAL",
    sourceLabel: "MP Samadhan Portal",
    filingDate: "2026-08-19",
    complainantDetails: {
      name: "Sunita Deshmukh",
      designation: "Headmistress, Govt HS School",
      district: "Bhopal",
      block: "Phanda",
      contact: "+91 94250 11223",
    },
    issueDetails: {
      subject: "Misprinted pages in Class 10 Science Textbooks",
      description:
        "Batch PO-2026-B02 contains inverted pages 45-60 across 120 copies delivered to Phanda block.",
      affectedTitle: "Class 10 Science (English Medium)",
      shortageQty: 120,
    },
    escalationLevel: "LEVEL_1",
    escalationLabel: "Level 1 (District)",
    assignedOfficer: {
      officerId: "OFF-BPL-104",
      officerName: "Alok Verma",
      role: "Quality Inspector, Head Office",
      slaDeadline: "2026-08-24",
    },
    resolutionStatus: "IN_PROGRESS",
  },
  {
    id: "GRV-003",
    grievanceId: "GRV-MPTBC-2026-9943",
    cmHelplineRefId: "DIRECT-TBC-1092",
    category: "VENDOR_DISPUTE_APPEAL",
    categoryLabel: "Vendor Fine & LD Appeal",
    source: "DIRECT_FILING",
    sourceLabel: "Direct Vendor Appeal",
    filingDate: "2026-08-15",
    complainantDetails: {
      name: "Suresh Gupta",
      designation: "Managing Director",
      district: "Ujjain",
      block: "Ujjain Urban",
      contact: "+91 98270 99887",
    },
    issueDetails: {
      subject: "Appeal against LD Penalty on PO-2026-B02 Delivery",
      description:
        "Late delivery was caused by unseasonal monsoon flooding at Depot #4 entrance. Request 50% LD waiver.",
      affectedTitle: "G Tech Print Works Contract PO-2026-B02",
    },
    escalationLevel: "LEVEL_3",
    escalationLabel: "Level 3 (Head Office)",
    assignedOfficer: {
      officerId: "OFF-HQ-008",
      officerName: "Virendra Singh",
      role: "General Manager (Operations)",
      slaDeadline: "2026-08-26",
    },
    resolutionStatus: "ESCALATED",
  },
  {
    id: "GRV-004",
    grievanceId: "GRV-MPTBC-2026-9944",
    cmHelplineRefId: "CM181-MP-882108",
    category: "HRMS_STAFF_GRIEVANCE",
    categoryLabel: "HRMS Payroll & Leave",
    source: "SCHOOL_PORTAL",
    sourceLabel: "HRMS Staff Portal",
    filingDate: "2026-08-12",
    complainantDetails: {
      name: "Pooja Trivedi",
      designation: "Assistant Grade-II",
      district: "Jabalpur",
      block: "Jabalpur City",
      contact: "+91 98930 44332",
    },
    issueDetails: {
      subject: "Delay in Earned Leave Arrears Credit for July 2026",
      description:
        "Medical leave encashment voucher approved by DDO was not synced in HRMS July payroll payout.",
      affectedTitle: "Employee ID: Emp-10492 Payroll Arrears",
    },
    escalationLevel: "LEVEL_1",
    escalationLabel: "Level 1 (District)",
    assignedOfficer: {
      officerId: "OFF-JBP-301",
      officerName: "Deepak Chouhan",
      role: "HR Accounts Officer, Jabalpur",
      slaDeadline: "2026-08-20",
    },
    resolutionStatus: "RESOLVED",
  },
  {
    id: "GRV-005",
    grievanceId: "GRV-MPTBC-2026-9945",
    cmHelplineRefId: "CM181-MP-882110",
    category: "TRANSPORT_FREIGHT_CLAIM",
    categoryLabel: "Transit Freight Claim",
    source: "CM_HELPLINE_181",
    sourceLabel: "CM Helpline 181",
    filingDate: "2026-08-10",
    complainantDetails: {
      name: "Mahesh Yadav",
      designation: "Transporter Lead",
      district: "Gwalior",
      block: "Morar",
      contact: "+91 94065 77665",
    },
    issueDetails: {
      subject: "Unloading Detention Charges Payment Appeal",
      description:
        "Truck detention for 48 hours at Gwalior Central Depot due to warehouse space crunch.",
      affectedTitle: "Truck No: MP-07-GA-8821 Freight Bill",
    },
    escalationLevel: "LEVEL_4",
    escalationLabel: "Level 4 (Apex Hearing)",
    assignedOfficer: {
      officerId: "OFF-[#006A38]",
      officerName: "Dr. K. S. Tomar",
      role: "Chief Nodal Officer & Secretary",
      slaDeadline: "2026-08-28",
    },
    resolutionStatus: "ESCALATED",
  },
];
