declare namespace Printer {
  interface MachineDetail {
    id?: string;
    machineType: "sheetfed" | "web";
    size?: string;
    cutoff?: string;
    yearOfManufacture: number;
    ageOfMachine: number;
    colorConfiguration: "single" | "double" | "multi";
    sidCapacity120Days: number;
    cpcAutomatic?: "cpc" | "automatic" | "manual";
    calculatedCapacity1Color?: number;
    calculatedCapacity2Color?: number;
    calculatedCapacity4Color?: number;
    remark?: string;
  }

  interface RegistrationForm {
    printerName: string;
    firmRegistrationNo: string;
    printerType: string;
    gstinNo: string;
    panNo: string;
    ownerName: string;
    licenseCertificateUrl: string;

    authPersonName: string;
    designation: string;
    mobileNo: string;
    email: string;

    // Office Address
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    stateId: number;
    districtId: number;
    cityId: number;
    pinCode: string;

    machines: MachineDetail[];
  }

  interface Registration {
    printerId: number;
    printerName: string;
    firmRegistrationNo: string;
    printerType: string;
    gstinNo?: string;
    panNo?: string;
    ownerName: string;
    licenseCertificateUrl?: string;

    addressLine1: string;
    addressLine2?: string;
    state: string;
    district: string;
    city: string;
    pinCode: string;
    landmark?: string;

    authPersonName: string;
    designation: string;
    mobileNo: string;
    email: string;

    machines: MachineDetail[];
    isActive: boolean;
  }

  interface ListItem {
    printerCode: string;
    printerName: string;
    firmRegistrationNo: string;
    category: string;
    district: string;
    authorizedPerson: string;
    mobile: string;
    approvedCapacity: number;
    totalMachines: number;
    status: "Draft" | "Pending" | "Verified" | "Approved" | "Rejected";
    createdDate: string;
  }

  interface PrinterItem {
    printerId: number;
    printerName: string;
    depotName: string;
    classId: number;
    districtId: number;
    depotId: number;
    isActive: boolean;
  }
}
