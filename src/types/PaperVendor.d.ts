declare namespace PaperVendor {
  interface Item {
    vendorId: number;
    vendorName: string;
    paperMillName: string;
    address: string;
    contactNo: string;
    emailId: string;
    academicYear: string;
    approvedTon: number;
    suppliedTon: number;
    balanceTon: number;
    ratePerMt: number;
    totalRateAmount: number;
    securityDeposit: number;
    agreementDocUrl?: string;
    isActive: boolean;
    status: "Active" | "Inactive";
    createdDate?: string;
  }

  interface VendorForm {
    vendorName: string;
    paperMillName: string;
    address: string;
    contactNo: string;
    emailId: string;
    academicYear: string;
    approvedTon: number;
    suppliedTon?: number;
    ratePerMt: number;
    securityDeposit: number;
    agreementDocUrl?: string;
  }

  interface Filter {
    academicYear?: string;
    paperMillName?: string;
    search?: string;
  }
}
