export const printerCategories = [
  { text: "Category A (High capacity offset)", id: "Category A" },
  { text: "Category B (Medium capacity offset)", id: "Category B" },
  { text: "Category C (Low capacity/digital)", id: "Category C" },
];

export const machineTypes = [
  { text: "Web Offset Machine", id: "Web Offset" },
  { text: "Sheet Fed Offset Machine", id: "Sheet Fed Offset" },
  { text: "Binding & Folding Unit", id: "Binding/Folding" },
  { text: "Cutting Machine", id: "Cutting" },
];

export const colorConfigurations = [
  { text: "Single Color", id: "Single Color" },
  { text: "Double Color", id: "Double Color" },
  { text: "Multi Color (4+ Colors)", id: "Multi Color" },
];

export const cpcAutomaticOptions = [
  { text: "Yes (Automatic / CPC)", id: "Yes" },
  { text: "No (Manual)", id: "No" },
];

export const machineConditions = [
  { text: "Excellent / New", id: "Excellent" },
  { text: "Good (Working)", id: "Good" },
  { text: "Fair (Needs Maintenance)", id: "Fair" },
];

export const shiftTypes = [
  { text: "Single Shift (8 Hours)", id: "Single" },
  { text: "Double Shift (16 Hours)", id: "Double" },
  { text: "Triple Shift (24 Hours)", id: "Triple" },
];

export const states = [
  { text: "Madhya Pradesh", id: 1 },
  { text: "Uttar Pradesh", id: 2 },
  { text: "Maharashtra", id: 3 },
  { text: "Rajasthan", id: 4 },
];

export const districts = [
  { text: "Bhopal", id: 10, stateId: 1 },
  { text: "Indore", id: 11, stateId: 1 },
  { text: "Gwalior", id: 12, stateId: 1 },
  { text: "Jabalpur", id: 13, stateId: 1 },
  { text: "Ujjain", id: 14, stateId: 1 },
  { text: "Lucknow", id: 20, stateId: 2 },
  { text: "Noida", id: 21, stateId: 2 },
  { text: "Ghaziabad", id: 22, stateId: 2 },
  { text: "Mumbai", id: 30, stateId: 3 },
  { text: "Pune", id: 31, stateId: 3 },
  { text: "Jaipur", id: 40, stateId: 4 },
  { text: "Udaipur", id: 41, stateId: 4 },
];

export const cities = [
  { text: "Bhopal Old City", id: 100, districtId: 10 },
  { text: "Bhopal New City", id: 101, districtId: 10 },
  { text: "Kolar Town", id: 102, districtId: 10 },
  { text: "Indore Metro Area", id: 110, districtId: 11 },
  { text: "Mhow Cantonment", id: 111, districtId: 11 },
  { text: "Gwalior Fort Area", id: 120, districtId: 12 },
  { text: "Morar Suburb", id: 121, districtId: 12 },
  { text: "Jabalpur Cantonment", id: 130, districtId: 13 },
  { text: "Adhartal Industrial Area", id: 131, districtId: 13 },
  { text: "Ujjain City Area", id: 140, districtId: 14 },
  { text: "Mahakal Temple Zone", id: 141, districtId: 14 },
  { text: "Hazratganj", id: 200, districtId: 20 },
  { text: "Alambagh", id: 201, districtId: 20 },
  { text: "Sector 62 Industrial Area", id: 210, districtId: 21 },
  { text: "Sahibabad Industrial Area", id: 220, districtId: 22 },
  { text: "Andheri East", id: 300, districtId: 30 },
  { text: "Hinjewadi IT Phase 1", id: 310, districtId: 31 },
  { text: "Sitapura Industrial Area", id: 400, districtId: 40 },
  { text: "Mewar Industrial Zone", id: 410, districtId: 41 },
];

export const filterCategories = [
  { text: "Category A", id: "Category A" },
  { text: "Category B", id: "Category B" },
  { text: "Category C", id: "Category C" },
];

export const filterDistricts = [
  { text: "Bhopal", id: "Bhopal" },
  { text: "Indore", id: "Indore" },
  { text: "Gwalior", id: "Gwalior" },
  { text: "Jabalpur", id: "Jabalpur" },
  { text: "Ujjain", id: "Ujjain" },
];

export const filterStatuses = [
  { text: "Draft", id: "Draft" },
  { text: "Pending", id: "Pending" },
  { text: "Verified", id: "Verified" },
  { text: "Approved", id: "Approved" },
  { text: "Rejected", id: "Rejected" },
];

export const initialPrinterRegistrationListData: Printer.ListItem[] = [
  {
    printerCode: "PRN-000124",
    printerName: "Shree Offset Press",
    firmRegistrationNo: "REG-2024-0019",
    category: "Category A",
    district: "Bhopal",
    authorizedPerson: "Rajesh Sharma",
    mobile: "9876543210",
    approvedCapacity: 500000,
    totalMachines: 4,
    status: "Approved",
    createdDate: "2026-08-14",
  },
  {
    printerCode: "PRN-000125",
    printerName: "Aditya Web Printers Ltd",
    firmRegistrationNo: "REG-2023-0182",
    category: "Category A",
    district: "Indore",
    authorizedPerson: "Praveen Tiwari",
    mobile: "9425012345",
    approvedCapacity: 1200000,
    totalMachines: 6,
    status: "Pending",
    createdDate: "2026-08-10",
  },
  {
    printerCode: "PRN-000126",
    printerName: "Capital Book Printers",
    firmRegistrationNo: "REG-2025-0044",
    category: "Category C",
    district: "Bhopal",
    authorizedPerson: "Sanjay Gupta",
    mobile: "8877665544",
    approvedCapacity: 150000,
    totalMachines: 2,
    status: "Draft",
    createdDate: "2026-08-13",
  },
  {
    printerCode: "PRN-000127",
    printerName: "Vindhyachal Publishing House",
    firmRegistrationNo: "REG-2022-0922",
    category: "Category B",
    district: "Jabalpur",
    authorizedPerson: "Anil Soni",
    mobile: "9111223344",
    approvedCapacity: 450000,
    totalMachines: 3,
    status: "Verified",
    createdDate: "2026-08-01",
  },
  {
    printerCode: "PRN-000128",
    printerName: "Gwalior Text Offset Printers",
    firmRegistrationNo: "REG-2024-0311",
    category: "Category A",
    district: "Gwalior",
    authorizedPerson: "Vikram Singh",
    mobile: "9300123456",
    approvedCapacity: 950000,
    totalMachines: 5,
    status: "Approved",
    createdDate: "2026-07-28",
  },
  {
    printerCode: "PRN-000129",
    printerName: "Malwa Printing & Binding Unit",
    firmRegistrationNo: "REG-2021-0810",
    category: "Category B",
    district: "Ujjain",
    authorizedPerson: "Ramesh Chandra",
    mobile: "9827011223",
    approvedCapacity: 300000,
    totalMachines: 3,
    status: "Rejected",
    createdDate: "2026-08-02",
  },
  {
    printerCode: "PRN-000130",
    printerName: "National Offset & Packagers",
    firmRegistrationNo: "REG-2024-0556",
    category: "Category A",
    district: "Indore",
    authorizedPerson: "Amit Verma",
    mobile: "7000112233",
    approvedCapacity: 600000,
    totalMachines: 4,
    status: "Approved",
    createdDate: "2026-08-05",
  },
  {
    printerCode: "PRN-000131",
    printerName: "Royal Digital Press",
    firmRegistrationNo: "REG-2026-0004",
    category: "Category C",
    district: "Bhopal",
    authorizedPerson: "Pankaj Jain",
    mobile: "9555667788",
    approvedCapacity: 80000,
    totalMachines: 1,
    status: "Draft",
    createdDate: "2026-08-12",
  },
  {
    printerCode: "PRN-000132",
    printerName: "Mata Mandir Printing Solutions",
    firmRegistrationNo: "REG-2025-0102",
    category: "Category B",
    district: "Gwalior",
    authorizedPerson: "Deepak Tomar",
    mobile: "9424077889",
    approvedCapacity: 350000,
    totalMachines: 2,
    status: "Pending",
    createdDate: "2026-08-07",
  },
  {
    printerCode: "PRN-000133",
    printerName: "Narmada Printing Press",
    firmRegistrationNo: "REG-2023-0491",
    category: "Category A",
    district: "Jabalpur",
    authorizedPerson: "Vijay Yadav",
    mobile: "9893044556",
    approvedCapacity: 1100000,
    totalMachines: 5,
    status: "Verified",
    createdDate: "2026-08-09",
  },
];

export const getPrinterMockDetails = (
  printerCode?: string,
  listItem?: Printer.ListItem,
): Printer.Registration => {
  const printer =
    listItem ||
    initialPrinterRegistrationListData.find(
      (p) => p.printerCode === printerCode,
    );

  return {
    printerId: 101,
    printerName: printer?.printerName || "Mock Press Name",
    firmRegistrationNo: printer?.firmRegistrationNo || "REG-2024-0001",
    printerType: printer?.category || "Category A",
    gstinNo: "23AAAAA1111A1Z1",
    panNo: "AAAAA1111A",
    ownerName: (printer?.authorizedPerson || "Mock Owner Name") + " (Owner)",
    licenseCertificateUrl: "mock_certificate.pdf",
    addressLine1: "123, Offset Printing Zone",
    addressLine2: "Phase-II, Industrial Area",
    state: "Madhya Pradesh",
    district: printer?.district || "Bhopal",
    city: (printer?.district || "Bhopal") + " City",
    pinCode: "462001",
    landmark: "Near Power Grid Station",
    authPersonName: printer?.authorizedPerson || "Mock Representative",
    designation: "Managing Director",
    mobileNo: printer?.mobile || "9999999999",
    email:
      (printer?.authorizedPerson || "Mock Representative")
        .toLowerCase()
        .replace(/ /g, "") + "@pressdomain.com",
    machines: [
      {
        id: "m-1",
        machineType: "sheetfed" as const,
        size: "20x30 inch",
        yearOfManufacture: 2018,
        ageOfMachine: 8,
        colorConfiguration: "multi" as const,
        sidCapacity120Days: 250000,
        cpcAutomatic: "automatic" as const,
        calculatedCapacity1Color: 150000,
        calculatedCapacity2Color: 120000,
        calculatedCapacity4Color: 100000,
        remark: "Running in double shifts",
      },
      {
        id: "m-2",
        machineType: "web" as const,
        cutoff: "630mm",
        yearOfManufacture: 2020,
        ageOfMachine: 6,
        colorConfiguration: "double" as const,
        sidCapacity120Days: 500000,
        calculatedCapacity1Color: 300000,
        calculatedCapacity2Color: 250000,
        calculatedCapacity4Color: 200000,
        remark: "In excellent condition",
      },
    ].slice(
      0,
      printer && printer.totalMachines > 0 ? printer.totalMachines : 1,
    ),
    isActive: true,
  };
};
