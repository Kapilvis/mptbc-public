import { USER_ROLES } from "./authTypes";

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [USER_ROLES.TBC_HEAD_OFFICE]: [
    "dashboard",
    "profile",
    "master",
    "user-management",
    "hrms",
    "printer-section",
    "depot-section",
    "distribution-section",
    "paper-section",
    "reports",
  ],

  [USER_ROLES.DISTRICT_DEPOT]: [
    "dashboard",
    "profile",
    "master",
    "printer-section",
    "assigned-demand",
    "hrms",
    "distribution-section",
    "transport",
    "district-depot-section",
    "depot-transport",
  ],

  [USER_ROLES.PRINTER]: [
    "dashboard",
    "profile",
    "master",
    "printer-section",
    "tender",
    "paper-receiving",
    "supply-section",
    "depot-section",
    "payment",
  ],

  [USER_ROLES.PAPER_VENDOR]: [
    "dashboard",
    "profile",
    "master",
    "paper-supply",
    "paper-orders",
    "paper-receiving",
    "payment",
    "reports",
  ],

  [USER_ROLES.DISTRIBUTION_SECTION]: [
    "dashboard",
    "profile",
    "master",
    "demand",
    "allocation",
    "distribution",
    "dispatch",
    "distribution-tracking",
    "reports",
  ],
};
