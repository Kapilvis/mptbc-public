declare namespace DepotRegistration {
  interface Registration {
    depotRegistrationId: number;
    dptName: string;
    depotId: number;
    subDepotId?: number;
    districtId: number;
    type: "Central" | "Regional" | "District" | "SubDepot";
    address: string;
    pin: string;
    incharge: string;
    mobile: string;
    email?: string;
    capacity?: number;
    godowns?: number;
    isActive: boolean;
    createdOn?: string;
    modifiedOn?: string;

    // View-only joined names for rendering
    depotName?: string;
    subDepotName?: string;
    districtName?: string;
  }

  interface RegistrationForm {
    dptName: string;
    depotId: number;
    subDepotId?: number;
    districtId: number;
    type: "Central" | "Regional" | "District" | "SubDepot";
    address: string;
    pin: string;
    incharge: string;
    mobile: string;
    email?: string;
    capacity?: number;
    godowns?: number;
    isActive: boolean;
  }
}
