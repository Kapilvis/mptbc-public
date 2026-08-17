import type { WcdUserProfile } from "../types/Auth";

export const USER_ROLES = {
  TBC_HEAD_OFFICE: "TBC_HEAD_OFFICE",
  DISTRICT_DEPOT: "DISTRICT_DEPOT",
  PRINTER: "PRINTER",
  PAPER_VENDOR: "PAPER_VENDOR",
  DISTRIBUTION_SECTION: "DISTRIBUTION_SECTION",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface StoredAuthData {
  isAuthenticated: boolean;
  userId: string;
  role: UserRole;
  roleName: string;
}

export interface CustomUser {
  profile: WcdUserProfile;
  role: string;
}
