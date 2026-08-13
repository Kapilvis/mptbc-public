declare namespace HRMS {
  interface EmployeeRegistration {
    employeeId: number;
    employeeCode: string;
    salutation: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    fatherName: string;
    motherName?: string;
    profilePhoto?: string;

    nationality: string;
    mobileNumber: string;
    alternateMobile?: string;
    officialEmail?: string;
    personalEmail: string;
    aadhaarNumber: string;
    panNumber: string;
    category: string;
    religion: string;

    maritalStatus: string;
    bloodGroup: string;
    physicalDisability: string;
    criticalIllness: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;

    hasExistingEmployeeCode: string;
    employeeType: string;
    natureOfEmployment: string;
    organizationUnit: string;
    campusName: string;
    department: string;
    hrSection?: string;
    employeeClass?: string;
    designation: string;
    typeOfPost?: string;
    joiningDate: string;
    reportingManager?: string;
    workLocation?: string;
    employmentStatus: "Active" | "Inactive";

    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    district?: string;
    city?: string;
    pinCode?: string;

    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branchName?: string;

    emergencyRelation?: string;
    emergencyMobileNumber?: string;

    remarks?: string;
  }

  interface EmployeeRegistrationForm {
    employeeCode?: string;
    salutation?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    fatherName: string;
    profilePhoto?: string;

    mobileNumber: string;
    alternateMobile?: string;
    personalEmail: string;
    officialEmail?: string;
    aadhaarNumber: string;
    panNumber?: string;
    nationality?: string;
    category?: string;
    religion?: string;

    addressLine1: string;
    addressLine2?: string;
    stateId: number;
    districtId: number;
    cityId: number;
    pinCode: string;

    hasExistingEmployeeCode: string;
    employeeType: string;
    natureOfEmployment: string;
    organizationUnitId: number;
    campusName?: string;
    departmentId: number;
    designationId: number;
    joiningDate: string;
    employmentStatus: string;
    hrSection?: string;
    employeeClass?: string;
    typeOfPost?: string;
    reportingManager?: string;
    workLocation?: string;

    maritalStatus?: string;
    bloodGroup?: string;
    physicalDisability?: string;
    criticalIllness?: string;

    emergencyContactName: string;
    emergencyRelation: string;
    emergencyMobileNumber: string;

    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branchName?: string;

    remarks?: string;
  }
}
