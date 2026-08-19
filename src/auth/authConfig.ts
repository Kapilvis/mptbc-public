import { USER_ROLES, type UserRole } from "./authTypes";

export interface StaticCredential {
  role: UserRole;
  roleName: string;
  userId: string;
  password: string;
}

export const staticCredentials: StaticCredential[] = [
  {
    role: USER_ROLES.TBC_HEAD_OFFICE,
    roleName: "TBC Department (Head Office)",
    userId: "TBC ADMIN",
    password: "DPI@1234",
  },
  {
    role: USER_ROLES.TRANSPORTER,
    roleName: "Transporter",
    userId: "TRANSPORTER ADMIN",
    password: "DPI@1234",
  },
  {
    role: USER_ROLES.DISTRICT_DEPOT,
    roleName: "District Depot",
    userId: "DEPOT ADMIN",
    password: "DPI@1234",
  },
  {
    role: USER_ROLES.CENTRAL_DEPOT,
    roleName: "Central Depot",
    userId: "CENTRAL DEPOT ADMIN",
    password: "DPI@1234",
  },
  {
    role: USER_ROLES.PRINTER,
    roleName: "Printer",
    userId: "PRINTER ADMIN",
    password: "DPI@1234",
  },
  {
    role: USER_ROLES.PAPER_VENDOR,
    roleName: "Paper Vendor",
    userId: "VENDOR ADMIN",
    password: "DPI@1234",
  },
  {
    role: USER_ROLES.DISTRIBUTION_SECTION,
    roleName: "Distribution Section",
    userId: "DISTRIBUTION ADMIN",
    password: "DPI@1234",
  },
];

export const ROLE_OPTIONS = [
  { value: USER_ROLES.TBC_HEAD_OFFICE, text: "Admin" },
  { value: USER_ROLES.TBC_HEAD_OFFICE, text: "TBC Department (Head Office)" },
  { value: USER_ROLES.TRANSPORTER, text: "Transporter" },
  { value: USER_ROLES.DISTRICT_DEPOT, text: "District Depot" },
  { value: USER_ROLES.CENTRAL_DEPOT, text: "Central Depot" },
  { value: USER_ROLES.PRINTER, text: "Printer" },
  { value: USER_ROLES.PAPER_VENDOR, text: "Paper Vendor" },
  { value: USER_ROLES.DISTRIBUTION_SECTION, text: "Distribution Section" },
];
