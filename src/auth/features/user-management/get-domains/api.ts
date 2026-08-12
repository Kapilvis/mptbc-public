import { mockDomains } from "./data";

export async function getDomainDetails(): Promise<UserManagement.DomainItem[]> {
  return [...mockDomains];
}
