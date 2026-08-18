export const mockEmployees: HRMS.EmployeeRegistration[] = [
  {
    employeeId: 1,
    employeeCode: "EMP001",
    salutation: "Mr.",
    firstName: "Rahul",
    lastName: "Sharma",
    fullName: "Rahul Sharma",
    gender: "Male",
    dateOfBirth: "1995-05-12",
    fatherName: "Mahesh Sharma",
    motherName: "Sunita Sharma",

    nationality: "Indian",
    mobileNumber: "9876543210",
    personalEmail: "rahul.sharma@example.com",
    aadhaarNumber: "123456789012",
    panNumber: "ABCDE1234F",
    category: "General",
    religion: "Hindu",

    maritalStatus: "Single",
    bloodGroup: "B+",
    physicalDisability: "No",
    criticalIllness: "No",

    hasExistingEmployeeCode: "No",
    employeeType: "Regular",
    natureOfEmployment: "Permanent",
    organizationUnit: "Head Office",
    campusName: "Main Campus",
    department: "Human Resource",
    hrSection: "Administration",
    employeeClass: "Class II",
    designation: "HR Executive",
    typeOfPost: "Regular",

    joiningDate: "2026-08-01",
    employmentStatus: "Active",
  },
];

export const salutations = [
  { text: "Mr.", id: "Mr." },
  { text: "Mrs.", id: "Mrs." },
  { text: "Ms.", id: "Ms." },
  { text: "Dr.", id: "Dr." },
];

export const genders = [
  { text: "Male", id: "Male" },
  { text: "Female", id: "Female" },
  { text: "Other", id: "Other" },
];

export const nationalities = [
  { text: "Indian", id: "Indian" },
  { text: "Other", id: "Other" },
];

export const categories = [
  { text: "General", id: "General" },
  { text: "OBC", id: "OBC" },
  { text: "SC", id: "SC" },
  { text: "ST", id: "ST" },
];

export const religions = [
  { text: "Hindu", id: "Hindu" },
  { text: "Muslim", id: "Muslim" },
  { text: "Christian", id: "Christian" },
  { text: "Sikh", id: "Sikh" },
  { text: "Buddhist", id: "Buddhist" },
  { text: "Jain", id: "Jain" },
  { text: "Other", id: "Other" },
];

export const maritalStatuses = [
  { text: "Single", id: "Single" },
  { text: "Married", id: "Married" },
  { text: "Divorced", id: "Divorced" },
  { text: "Widowed", id: "Widowed" },
];

export const bloodGroups = [
  { text: "A+", id: "A+" },
  { text: "A-", id: "A-" },
  { text: "B+", id: "B+" },
  { text: "B-", id: "B-" },
  { text: "AB+", id: "AB+" },
  { text: "AB-", id: "AB-" },
  { text: "O+", id: "O+" },
  { text: "O-", id: "O-" },
];

export const yesNoOptions = [
  { text: "No", id: "No" },
  { text: "Yes", id: "Yes" },
];

export const employeeTypes = [
  { text: "Permanent", id: "Permanent" },
  { text: "Contract", id: "Contract" },
  { text: "Guest", id: "Guest" },
  { text: "Outsource", id: "Outsource" },
];

export const natureOfEmploymentOptions = [
  { text: "Teaching", id: "Teaching" },
  { text: "Non-Teaching", id: "Non-Teaching" },
  { text: "Admin", id: "Admin" },
];

export const organizationUnits = [
  { text: "MPTBC HQ", id: 1 },
  { text: "Regional Office", id: 2 },
  { text: "Campus", id: 3 },
];

export const campusNames = [
  { text: "Main Campus", id: "Main Campus" },
  { text: "South Campus", id: "South Campus" },
];

export const departments = [
  { text: "Human Resource", id: 10 },
  { text: "Finance", id: 11 },
  { text: "Information Technology", id: 12 },
  { text: "Administration", id: 13 },
  { text: "Academic", id: 14 },
];

export const hrSections = [
  { text: "Administration", id: "Administration" },
  { text: "Accounts", id: "Accounts" },
  { text: "Technical", id: "Technical" },
];

export const employeeClasses = [
  { text: "Class I", id: "Class I" },
  { text: "Class II", id: "Class II" },
  { text: "Class III", id: "Class III" },
  { text: "Class IV", id: "Class IV" },
];

export const designations = [
  { text: "Director", id: 100 },
  { text: "Manager", id: 101 },
  { text: "HR Executive", id: 102 },
  { text: "Assistant", id: 103 },
  { text: "Peon", id: 104 },
];

export const postTypes = [
  { text: "Regular", id: "Regular" },
  { text: "Deputation", id: "Deputation" },
];

export const employmentStatuses = [
  { text: "Active", id: "Active" },
  { text: "Inactive", id: "Inactive" },
  { text: "On Leave", id: "On Leave" },
  { text: "Retired", id: "Retired" },
];

// Dependent Dropdowns lookups
export const states = [{ text: "Madhya Pradesh", id: 1 }];

export const districts = [
  { text: "Bhopal", id: 10, stateId: 1 },
  { text: "Indore", id: 11, stateId: 1 },
  { text: "Lucknow", id: 20, stateId: 2 },
  { text: "Kanpur", id: 21, stateId: 2 },
];

export const cities = [
  { text: "Bhopal City", id: 100, districtId: 10 },
  { text: "Kolar", id: 101, districtId: 10 },
  { text: "Indore City", id: 110, districtId: 11 },
  { text: "Mhow", id: 111, districtId: 11 },
  { text: "Lucknow City", id: 200, districtId: 20 },
  { text: "Kanpur City", id: 210, districtId: 21 },
];
