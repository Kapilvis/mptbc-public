declare namespace Transportation {
  interface TransporterRegistration {
    transporterId: number;
    registrationNo: string;
    transporterType: string;
    transporterName: string;
    firmName: string;
    panNumber: string;
    gstin: string;
    registrationDate: string;
    state: string;
    district: string;
    tehsil: string;
    pinCode: string;
    ownerName: string;
    fatherName: string;
    mobile: string;
    alternateMobile?: string;
    email: string;
    aadhaar: string;
    authorizedPerson: string;
    authorizedMobile: string;
    authorizedEmail: string;
    turnoverFY2223: number;
    turnoverFY2324: number;
    turnoverFY2425: number;
    caCertificate?: string;
    technicalStatus: "Pending" | "Qualified" | "NotQualified";
  }

  interface TransporterRegistrationForm {
    transporterId?: number;
    transporterType: string;
    transporterName: string;
    firmName: string;
    panNumber: string;
    gstin: string;
    registrationDate: string;
    stateId: number;
    districtId: number;
    tehsilId: number;
    pinCode: string;
    ownerName: string;
    fatherName: string;
    mobile: string;
    alternateMobile?: string;
    email: string;
    aadhaar: string;
    authorizedPerson: string;
    authorizedMobile: string;
    authorizedEmail: string;
    turnoverFY2223: number;
    turnoverFY2324: number;
    turnoverFY2425: number;
    caCertificate?: string;
  }

  interface Vehicle {
    vehicleId: number;
    registrationNo: string;
    category: string; // Cat-1 | Cat-2 | Cat-3
    capacity: number; // in Tons
    model: string;
    manufacturer: string;
    manufacturingYear: number;
    fuelType: string; // Diesel | CNG | Petrol
    chassisNo: string;
    engineNo: string;
    rcNo: string;
    rcExpiry: string;
    insuranceNo: string;
    insuranceExpiry: string;
    fitnessNo: string;
    fitnessExpiry: string;
    permitNo: string;
    permitExpiry: string;
    pucNo: string;
    pucExpiry: string;
    ownershipStatus: "Self-Owned" | "Leased";
    leasedAgreementDoc?: string;
    rcDoc?: string;
    insuranceDoc?: string;
    fitnessDoc?: string;
    permitDoc?: string;
    pucDoc?: string;
    transporterId: number; // linked transporter
  }

  interface VehicleForm {
    vehicleId?: number;
    registrationNo: string;
    category: string;
    capacity: number;
    model: string;
    manufacturer: string;
    manufacturingYear: number;
    fuelType: string;
    chassisNo: string;
    engineNo: string;
    rcNo: string;
    rcExpiry: string;
    insuranceNo: string;
    insuranceExpiry: string;
    fitnessNo: string;
    fitnessExpiry: string;
    permitNo: string;
    permitExpiry: string;
    pucNo: string;
    pucExpiry: string;
    ownershipStatus: "Self-Owned" | "Leased";
    leasedAgreementDoc?: string;
    rcDoc?: string;
    insuranceDoc?: string;
    fitnessDoc?: string;
    permitDoc?: string;
    pucDoc?: string;
    transporterId: number;
  }
}
