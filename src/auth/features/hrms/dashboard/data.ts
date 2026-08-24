export interface HrmsContact {
  email: string;
  phone: string;
}

export interface HrmsAttendanceToday {
  status: "PRESENT" | "ABSENT" | "ON LEAVE" | "ON TOUR" | "LATE";
  checkIn?: string;
  method: string;
}

export interface HrmsServiceDetails {
  dateOfJoining: string;
  superannuationDate: string;
  aparStatus:
    | "Submitted & Verified"
    | "Pending Officer Review"
    | "Under Audit"
    | "Not Submitted";
  serviceBookDigital: boolean;
}

export interface HrmsFinancials {
  basicPayLevel: string;
  monthlyGross: number;
  ifmisId: string;
}

export interface HrmsEmployee {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  cadreType:
    | "Regular Class I"
    | "Regular Class II"
    | "Regular Class III"
    | "Regular Class IV"
    | "Samvida"
    | "Contractual"
    | "Outsourced";
  postingLocation: string;
  zone:
    | "Bhopal Division"
    | "Indore Division"
    | "Gwalior Division"
    | "Jabalpur Division"
    | "Sagar Division"
    | "Ujjain Division"
    | "Rewa Division"
    | "Head Office";
  contact: HrmsContact;
  attendanceToday: HrmsAttendanceToday;
  serviceDetails: HrmsServiceDetails;
  financials: HrmsFinancials;
  avatarUrl?: string;
}

export interface DepotDeploymentStat {
  division: string;
  depotCount: number;
  regularStaff: number;
  samvidaStaff: number;
  contractualStaff: number;
  outsourcedStaff: number;
  totalStaff: number;
  managerPresent: boolean;
  biometricCompliancePct: number;
}

export interface PendingHrAction {
  id: string;
  type: "LEAVE" | "TRANSFER" | "APAR_REVIEW" | "PAYROLL_REVISE";
  employeeId: string;
  employeeName: string;
  designation: string;
  location: string;
  requestDetails: string;
  appliedDate: string;
  urgency: "HIGH" | "MEDIUM" | "NORMAL";
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface RetirementPipelineItem {
  employeeId: string;
  employeeName: string;
  designation: string;
  postingLocation: string;
  cadreType: string;
  superannuationDate: string;
  daysRemaining: number;
  pensionNo: string;
}

export interface HrmsKpiMetrics {
  totalWorkforce: number;
  regularCount: number;
  samvidaCount: number;
  contractualCount: number;
  outsourcedCount: number;
  attendancePct: number;
  presentCount: number;
  onLeaveCount: number;
  totalBiometricUsers: number;
  monthlyPayrollBudget: string; // e.g. "₹ 20.00 Lakhs"
  disbursedPayroll?: string; // e.g. "₹ 19.65 Lakhs"
  ifmisDisbursedPct: number;
  pendingHrActionsCount: number;
  retirementsThisFy: number;
}

// ─── INITIAL MOCK DATASETS ──────────────────────────────────────────────────

export const initialHrmsKpiMetrics: HrmsKpiMetrics = {
  totalWorkforce: 85,
  regularCount: 30,
  samvidaCount: 20,
  contractualCount: 15,
  outsourcedCount: 20,
  attendancePct: 91.8,
  presentCount: 78,
  onLeaveCount: 7,
  totalBiometricUsers: 85,
  monthlyPayrollBudget: "₹ 20.00 Lakhs",
  disbursedPayroll: "₹ 19.65 Lakhs",
  ifmisDisbursedPct: 98.3,
  pendingHrActionsCount: 6,
  retirementsThisFy: 2,
};

export const initialEmployees: HrmsEmployee[] = [
  {
    employeeId: "MPTBC-HR-2026-0842",
    fullName: "Ramesh Kumar Sharma",
    designation: "District Depot Manager",
    department: "District Depot Section",
    cadreType: "Regular Class II",
    postingLocation: "Indore District Depot",
    zone: "Indore Division",
    contact: {
      email: "r.sharma@mptbc.mp.gov.in",
      phone: "+91 98260 12345",
    },
    attendanceToday: {
      status: "PRESENT",
      checkIn: "09:42 AM",
      method: "Biometric - Indore Depot Gate",
    },
    serviceDetails: {
      dateOfJoining: "2012-08-15",
      superannuationDate: "2032-05-31",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Level 11 (Pay Matrix 56100-177500)",
      monthlyGross: 84500,
      ifmisId: "MP10842991",
    },
  },
  {
    employeeId: "MPTBC-HR-2026-0105",
    fullName: "Sunita Verma",
    designation: "General Manager (HR & Admin)",
    department: "Head Office Apex",
    cadreType: "Regular Class I",
    postingLocation: "Head Office Bhopal",
    zone: "Head Office",
    contact: {
      email: "s.verma@mptbc.mp.gov.in",
      phone: "+91 94250 88712",
    },
    attendanceToday: {
      status: "PRESENT",
      checkIn: "09:15 AM",
      method: "Biometric - HQ Main Gate",
    },
    serviceDetails: {
      dateOfJoining: "2005-04-10",
      superannuationDate: "2029-11-30",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Level 14 (Pay Matrix 144200-218200)",
      monthlyGross: 168000,
      ifmisId: "MP10051105",
    },
  },
  {
    employeeId: "MPTBC-HR-2026-0419",
    fullName: "Vikramaditya Singh",
    designation: "Central Warehouse Superintendent",
    department: "Paper Section & Logistics",
    cadreType: "Regular Class II",
    postingLocation: "Central Paper Warehouse Mandideep",
    zone: "Bhopal Division",
    contact: {
      email: "v.singh@mptbc.mp.gov.in",
      phone: "+91 97520 44310",
    },
    attendanceToday: {
      status: "PRESENT",
      checkIn: "09:30 AM",
      method: "Biometric - Mandideep Gate 1",
    },
    serviceDetails: {
      dateOfJoining: "2015-11-01",
      superannuationDate: "2036-07-31",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Level 10 (Pay Matrix 42700-135100)",
      monthlyGross: 72000,
      ifmisId: "MP10150419",
    },
  },
  {
    employeeId: "MPTBC-HR-2026-0912",
    fullName: "Pooja Sharma",
    designation: "Chief Paper Quality Inspector",
    department: "Quality Inspection Wing",
    cadreType: "Regular Class II",
    postingLocation: "Printing Press Wing Bhopal",
    zone: "Bhopal Division",
    contact: {
      email: "p.sharma@mptbc.mp.gov.in",
      phone: "+91 98930 77123",
    },
    attendanceToday: {
      status: "PRESENT",
      checkIn: "09:50 AM",
      method: "Biometric - Quality Lab HQ",
    },
    serviceDetails: {
      dateOfJoining: "2018-02-14",
      superannuationDate: "2040-09-30",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Level 10 (Pay Matrix 42700-135100)",
      monthlyGross: 68500,
      ifmisId: "MP10180912",
    },
  },
  {
    employeeId: "MPTBC-HR-2026-1104",
    fullName: "Rajeshwar Prasad Tiwari",
    designation: "District Depot Officer",
    department: "District Depot Section",
    cadreType: "Regular Class III",
    postingLocation: "Jabalpur District Depot",
    zone: "Jabalpur Division",
    contact: {
      email: "rp.tiwari@mptbc.mp.gov.in",
      phone: "+91 94067 11200",
    },
    attendanceToday: {
      status: "ON LEAVE",
      method: "Approved Casual Leave",
    },
    serviceDetails: {
      dateOfJoining: "1998-06-20",
      superannuationDate: "2026-12-31",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Level 8 (Pay Matrix 32800-103600)",
      monthlyGross: 59000,
      ifmisId: "MP10981104",
    },
  },
  {
    employeeId: "MPTBC-HR-2026-1350",
    fullName: "Anil Kumar Gupta",
    designation: "Assistant Depot Storekeeper",
    department: "Distribution & Stocking",
    cadreType: "Contractual",
    postingLocation: "Gwalior District Depot",
    zone: "Gwalior Division",
    contact: {
      email: "a.gupta@mptbc.mp.gov.in",
      phone: "+91 93011 88440",
    },
    attendanceToday: {
      status: "PRESENT",
      checkIn: "09:55 AM",
      method: "Biometric - Gwalior Depot",
    },
    serviceDetails: {
      dateOfJoining: "2021-09-01",
      superannuationDate: "2045-03-31",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Contractual Fixed Consolidated",
      monthlyGross: 32000,
      ifmisId: "MP10211350",
    },
  },
  {
    employeeId: "MPTBC-HR-2026-1402",
    fullName: "Kavita Rao",
    designation: "Senior Accountant & Payroll Incharge",
    department: "Finance & Accounts",
    cadreType: "Regular Class II",
    postingLocation: "Head Office Bhopal",
    zone: "Head Office",
    contact: {
      email: "k.rao@mptbc.mp.gov.in",
      phone: "+91 98272 33411",
    },
    attendanceToday: {
      status: "PRESENT",
      checkIn: "09:20 AM",
      method: "Biometric - Finance Section",
    },
    serviceDetails: {
      dateOfJoining: "2010-03-15",
      superannuationDate: "2034-08-31",
      aparStatus: "Submitted & Verified",
      serviceBookDigital: true,
    },
    financials: {
      basicPayLevel: "Level 11 (Pay Matrix 56100-177500)",
      monthlyGross: 81000,
      ifmisId: "MP10101402",
    },
  },
];

export const depotDeploymentStats: DepotDeploymentStat[] = [
  {
    division: "BHOPAL Depot",
    depotCount: 5,
    regularStaff: 6,
    samvidaStaff: 4,
    contractualStaff: 3,
    outsourcedStaff: 4,
    totalStaff: 17,
    managerPresent: true,
    biometricCompliancePct: 95.0,
  },
  {
    division: "INDORE Depot",
    depotCount: 5,
    regularStaff: 5,
    samvidaStaff: 3,
    contractualStaff: 3,
    outsourcedStaff: 3,
    totalStaff: 14,
    managerPresent: true,
    biometricCompliancePct: 93.5,
  },
  {
    division: "GWALIOR Depot",
    depotCount: 8,
    regularStaff: 4,
    samvidaStaff: 3,
    contractualStaff: 2,
    outsourcedStaff: 3,
    totalStaff: 12,
    managerPresent: true,
    biometricCompliancePct: 92.0,
  },
  {
    division: "JABALPUR Depot",
    depotCount: 8,
    regularStaff: 4,
    samvidaStaff: 3,
    contractualStaff: 2,
    outsourcedStaff: 3,
    totalStaff: 12,
    managerPresent: true,
    biometricCompliancePct: 91.5,
  },
  {
    division: "UJJAIN Depot",
    depotCount: 6,
    regularStaff: 3,
    samvidaStaff: 2,
    contractualStaff: 2,
    outsourcedStaff: 2,
    totalStaff: 9,
    managerPresent: true,
    biometricCompliancePct: 91.0,
  },
  {
    division: "SAGAR Depot",
    depotCount: 5,
    regularStaff: 2,
    samvidaStaff: 2,
    contractualStaff: 1,
    outsourcedStaff: 2,
    totalStaff: 7,
    managerPresent: true,
    biometricCompliancePct: 92.5,
  },
  {
    division: "REWA Depot",
    depotCount: 7,
    regularStaff: 2,
    samvidaStaff: 1,
    contractualStaff: 1,
    outsourcedStaff: 1,
    totalStaff: 5,
    managerPresent: true,
    biometricCompliancePct: 90.0,
  },
  {
    division: "KHANDWA Depot",
    depotCount: 4,
    regularStaff: 2,
    samvidaStaff: 1,
    contractualStaff: 1,
    outsourcedStaff: 1,
    totalStaff: 5,
    managerPresent: true,
    biometricCompliancePct: 93.0,
  },
  {
    division: "HEAD OFFICE & MANDIDEEP",
    depotCount: 8,
    regularStaff: 2,
    samvidaStaff: 1,
    contractualStaff: 0,
    outsourcedStaff: 1,
    totalStaff: 4,
    managerPresent: true,
    biometricCompliancePct: 96.5,
  },
];

export const initialPendingHrActions: PendingHrAction[] = [
  {
    id: "ACT-2026-081",
    type: "LEAVE",
    employeeId: "MPTBC-HR-2026-1104",
    employeeName: "Rajeshwar Prasad Tiwari",
    designation: "District Depot Officer",
    location: "Jabalpur District Depot",
    requestDetails:
      "Earned Leave (12 Days) for medical treatment in AIIMS Bhopal",
    appliedDate: "2026-08-20",
    urgency: "HIGH",
    status: "PENDING",
  },
  {
    id: "ACT-2026-082",
    type: "TRANSFER",
    employeeId: "MPTBC-HR-2026-0842",
    employeeName: "Ramesh Kumar Sharma",
    designation: "District Depot Manager",
    location: "Indore District Depot",
    requestDetails:
      "Mutual Transfer Request to Bhopal HQ due to family reasons",
    appliedDate: "2026-08-18",
    urgency: "NORMAL",
    status: "PENDING",
  },
  {
    id: "ACT-2026-083",
    type: "APAR_REVIEW",
    employeeId: "MPTBC-HR-2026-0419",
    employeeName: "Vikramaditya Singh",
    designation: "Central Warehouse Superintendent",
    location: "Central Paper Warehouse Mandideep",
    requestDetails:
      "Annual APAR Verification & Rating (2025-26 - Score: 9.4/10)",
    appliedDate: "2026-08-15",
    urgency: "NORMAL",
    status: "PENDING",
  },
  {
    id: "ACT-2026-084",
    type: "PAYROLL_REVISE",
    employeeId: "MPTBC-HR-2026-1350",
    employeeName: "Anil Kumar Gupta",
    designation: "Assistant Depot Storekeeper",
    location: "Gwalior District Depot",
    requestDetails: "DA Revision Arrears IFMIS Mapping & Increment Approval",
    appliedDate: "2026-08-19",
    urgency: "MEDIUM",
    status: "PENDING",
  },
];

export const initialRetirementPipeline: RetirementPipelineItem[] = [
  {
    employeeId: "MPTBC-HR-2026-1104",
    employeeName: "Rajeshwar Prasad Tiwari",
    designation: "District Depot Officer",
    postingLocation: "Jabalpur District Depot",
    cadreType: "Regular Class III",
    superannuationDate: "2026-12-31",
    daysRemaining: 131,
    pensionNo: "MP-PENS-2026-9901",
  },
  {
    employeeId: "MPTBC-HR-2026-0044",
    employeeName: "Mahesh Chandra Saxena",
    designation: "Senior Quality Inspector",
    postingLocation: "Mandideep Central Warehouse",
    cadreType: "Regular Class II",
    superannuationDate: "2026-10-31",
    daysRemaining: 70,
    pensionNo: "MP-PENS-2026-8812",
  },
  {
    employeeId: "MPTBC-HR-2026-0188",
    employeeName: "Bhagwandas Malviya",
    designation: "Head Clerk Accounts",
    postingLocation: "Ujjain District Depot",
    cadreType: "Regular Class III",
    superannuationDate: "2027-01-31",
    daysRemaining: 162,
    pensionNo: "MP-PENS-2026-7734",
  },
  {
    employeeId: "MPTBC-HR-2026-0210",
    employeeName: "Sharad Kumar Mishra",
    designation: "District Depot Manager",
    postingLocation: "Sagar District Depot",
    cadreType: "Regular Class II",
    superannuationDate: "2027-03-31",
    daysRemaining: 221,
    pensionNo: "MP-PENS-2027-1109",
  },
];

// ─── ADDITIONAL MOCK DATASETS FOR GEMINI MOCKUP PARITY ──────────────────────

export interface BiometricCheckInLog {
  empId: string;
  name: string;
  locationDevice: string;
  checkInTime: string;
  verificationMode: string;
  status: "PRESENT" | "ON FIELD DUTY" | "LATE ARRIVAL";
}

export const initialBiometricCheckInLogs: BiometricCheckInLog[] = [
  {
    empId: "MPTBC-HR-101",
    name: "Ramesh Kumar Sharma",
    locationDevice: "Indore District Depot Gate",
    checkInTime: "09:42 AM",
    verificationMode: "Biometric Thumbprint",
    status: "PRESENT",
  },
  {
    empId: "MPTBC-HR-103",
    name: "Sunil Verma",
    locationDevice: "Gwalior Press Inspection Cell",
    checkInTime: "09:18 AM",
    verificationMode: "Mobile GPS Geo-fence",
    status: "ON FIELD DUTY",
  },
  {
    empId: "MPTBC-HR-105",
    name: "Aarti Chouhan",
    locationDevice: "Jabalpur District Depot",
    checkInTime: "09:50 AM",
    verificationMode: "Biometric Face Scanner",
    status: "PRESENT",
  },
  {
    empId: "MPTBC-HR-109",
    name: "Suresh Chandra Saxena",
    locationDevice: "Ujjain District Depot",
    checkInTime: "10:24 AM",
    verificationMode: "Biometric Thumbprint",
    status: "LATE ARRIVAL",
  },
];

export interface PayMatrixLevelBreakdown {
  levelGroup: string;
  cadreCovered: string;
  payScaleRange: string;
  headcount: string;
  basicPay: string;
  allowances: string;
  totalExpenditure: string;
}

export const initialPayMatrixBreakdown: PayMatrixLevelBreakdown[] = [
  {
    levelGroup: "Level 13 to 15",
    cadreCovered: "Managing Director, GMs, Senior Officers",
    payScaleRange: "₹ 1,23,100 - ₹ 2,18,200",
    headcount: "4 Staff",
    basicPay: "₹ 5,20,000",
    allowances: "₹ 2,60,000",
    totalExpenditure: "₹ 7,80,000",
  },
  {
    levelGroup: "Level 10 to 12",
    cadreCovered: "Depot Managers, Senior Accounts Officers",
    payScaleRange: "₹ 56,100 - ₹ 1,77,500",
    headcount: "10 Staff",
    basicPay: "₹ 3,60,000",
    allowances: "₹ 1,80,000",
    totalExpenditure: "₹ 5,40,000",
  },
  {
    levelGroup: "Level 5 to 9",
    cadreCovered: "Assistant Depot Managers, Store Keepers",
    payScaleRange: "₹ 25,300 - ₹ 91,300",
    headcount: "16 Staff",
    basicPay: "₹ 3,00,000",
    allowances: "₹ 1,40,000",
    totalExpenditure: "₹ 4,40,000",
  },
  {
    levelGroup: "Samvida Cadre",
    cadreCovered: "Samvida Depot Personnel & Technical Inspectors",
    payScaleRange: "Fixed Scale (Pay Band 2)",
    headcount: "20 Staff",
    basicPay: "₹ 3,20,000",
    allowances: "₹ 1,40,000",
    totalExpenditure: "₹ 4,60,000",
  },
  {
    levelGroup: "Contractual Staff",
    cadreCovered: "IT Officers, Data Entry Operators",
    payScaleRange: "Consolidated Contract Scale",
    headcount: "15 Staff",
    basicPay: "₹ 1,80,000",
    allowances: "--",
    totalExpenditure: "₹ 1,80,000",
  },
  {
    levelGroup: "Outsourced Support",
    cadreCovered: "Warehouse Helpers, Drivers & Security",
    payScaleRange: "Min Wage / Agency Rate",
    headcount: "20 Staff",
    basicPay: "₹ 1,60,000",
    allowances: "--",
    totalExpenditure: "₹ 1,60,000",
  },
];

export interface DivisionStaffingSummary {
  divisionName: string;
  staffedPct: number;
  activeCount: number;
  sanctionedCount: number;
  depotsList: string;
}

export const initialDivisionStaffingSummaries: DivisionStaffingSummary[] = [
  {
    divisionName: "Bhopal Division",
    staffedPct: 92,
    activeCount: 22,
    sanctionedCount: 24,
    depotsList: "Bhopal, Sehore, Raisen, Rajgarh, Vidisha",
  },
  {
    divisionName: "Indore Division",
    staffedPct: 95,
    activeCount: 20,
    sanctionedCount: 21,
    depotsList: "Indore, Dhar, Jhabua, Khargone, Khandwa",
  },
  {
    divisionName: "Gwalior Division",
    staffedPct: 91,
    activeCount: 20,
    sanctionedCount: 22,
    depotsList: "Gwalior, Bhind, Morena, Datia, Shivpuri",
  },
  {
    divisionName: "Jabalpur Division",
    staffedPct: 92,
    activeCount: 23,
    sanctionedCount: 25,
    depotsList: "Jabalpur, Katni, Chhindwara, Seoni, Mandla",
  },
];

export interface EmployeeGrievanceTicket {
  ticketId: string;
  employeeName: string;
  location: string;
  category: string;
  filingDate: string;
  status: "IN PROGRESS" | "RESOLVED" | "UNDER REVIEW";
}

export const initialEmployeeGrievances: EmployeeGrievanceTicket[] = [
  {
    ticketId: "GRV-2026-881",
    employeeName: "Rajeshwar Tiwari",
    location: "Ujjain Depot",
    category: "Service Book Increment Anomaly",
    filingDate: "12 Aug 2026",
    status: "IN PROGRESS",
  },
  {
    ticketId: "GRV-2026-874",
    employeeName: "Deepak Agrawal",
    location: "Bhopal HQ Apex",
    category: "Traveling Allowance Claim Sync",
    filingDate: "08 Aug 2026",
    status: "RESOLVED",
  },
];
