export interface KpiStatItem {
  label: string;
  value: string;
}

export interface KpiMetric {
  title: string;
  value: string;
  stats?: KpiStatItem[];
  secondaryTitle?: string;
  secondaryValue?: string;
  subText: string;
  trend?: string;
  badgeText?: string;
  icon: string;
  theme: "indigo" | "blue" | "amber" | "emerald";
  type:
    | "net-demand"
    | "approved-demand"
    | "dispatch-rate"
    | "brc-rate"
    | "student-progress";
}

export interface TitleWiseDistributionItem {
  id: number;
  academicYear: string;
  bookTypeName: string;
  mediumName: string;
  districtName: string;
  blockName: string;
  titleName: string;
  classId: number;
  blockDemandToTbc: number;
  tbcSentToBrc: number;
  tbcSentPercent: number;
  brcReceived: number;
  brcReceivedSortSupply: number;
  brcReceivedDamaged: number;
  brcReceivedPercent: number;
  brcSentToSchool: number;
  brcSentToSchoolPercent: number;
  schoolDistributeToStudent: number;
}

export const mockKpiMetrics: KpiMetric[] = [
  {
    title: "Total Demand",
    value: "4,50,000",
    subText: "",
    icon: "pi pi-file-edit",
    theme: "indigo",
    type: "net-demand",
  },
  {
    title: "Approved Demand",
    value: "3,90,000",
    subText: "",
    icon: "pi pi-check-circle",
    theme: "emerald",
    type: "approved-demand",
  },
  {
    title: "TBC Dispatch",
    value: "2,48,385",
    subText: "",
    icon: "pi pi-truck",
    theme: "blue",
    type: "dispatch-rate",
  },
  {
    title: "Block Received",
    value: "2,03,924",
    subText: "",
    icon: "pi pi-box",
    theme: "amber",
    type: "brc-rate",
  },
  {
    title: "Student Distribution",
    value: "1,20,000",
    subText: "",
    icon: "pi pi-users",
    theme: "emerald",
    type: "student-progress",
  },
];

export const mockTitleWiseDistributionData: TitleWiseDistributionItem[] = [
  // Class 1 to 8 Sheet Rows (5 Rows)
  {
    id: 1,
    academicYear: "2026-2027",
    bookTypeName: "एटग्रेड",
    mediumName: "हिंदी माध्यम",
    districtName: "Agar Malwa",
    blockName: "Agar",
    titleName: "एटग्रेड अभ्यास पुस्तिका (गणित)",
    classId: 8,
    blockDemandToTbc: 1468,
    tbcSentToBrc: 1468,
    tbcSentPercent: 100,
    brcReceived: 1468,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 262,
    brcSentToSchoolPercent: 17.85,
    schoolDistributeToStudent: 38,
  },
  {
    id: 2,
    academicYear: "2026-2027",
    bookTypeName: "एटग्रेड",
    mediumName: "हिंदी माध्यम",
    districtName: "Panna",
    blockName: "Ajaigarh",
    titleName: "एटग्रेड अभ्यास पुस्तिका (गणित)",
    classId: 8,
    blockDemandToTbc: 2688,
    tbcSentToBrc: 2688,
    tbcSentPercent: 100,
    brcReceived: 2088,
    brcReceivedSortSupply: 28,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 1669,
    brcSentToSchoolPercent: 62.74,
    schoolDistributeToStudent: 0,
  },
  {
    id: 3,
    academicYear: "2026-2027",
    bookTypeName: "एटग्रेड",
    mediumName: "हिंदी माध्यम",
    districtName: "Alirajpur",
    blockName: "Alirajpur",
    titleName: "एटग्रेड अभ्यास पुस्तिका (गणित)",
    classId: 8,
    blockDemandToTbc: 2712,
    tbcSentToBrc: 2712,
    tbcSentPercent: 100,
    brcReceived: 2712,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 2641,
    brcSentToSchoolPercent: 97.38,
    schoolDistributeToStudent: 1186,
  },
  {
    id: 4,
    academicYear: "2026-2027",
    bookTypeName: "एटग्रेड",
    mediumName: "हिंदी माध्यम",
    districtName: "Ratlam",
    blockName: "Alot",
    titleName: "एटग्रेड अभ्यास पुस्तिका (गणित)",
    classId: 8,
    blockDemandToTbc: 2127,
    tbcSentToBrc: 2127,
    tbcSentPercent: 100,
    brcReceived: 2127,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 2127,
    brcSentToSchoolPercent: 100,
    schoolDistributeToStudent: 205,
  },
  {
    id: 5,
    academicYear: "2026-2027",
    bookTypeName: "एटग्रेड",
    mediumName: "हिंदी माध्यम",
    districtName: "Betul",
    blockName: "Amla",
    titleName: "एटग्रेड अभ्यास पुस्तिका(गणित)",
    classId: 8,
    blockDemandToTbc: 1794,
    tbcSentToBrc: 1794,
    tbcSentPercent: 100,
    brcReceived: 1794,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 1794,
    brcSentToSchoolPercent: 100,
    schoolDistributeToStudent: 443,
  },

  // Class 9 to 12 Sheet Rows (5 Rows)
  {
    id: 6,
    academicYear: "2026-2027",
    bookTypeName: "पाठ्यपुस्तक",
    mediumName: "अंग्रेजी माध्यम",
    districtName: "Agar Malwa",
    blockName: "Agar",
    titleName: "अकाउंटेन्सी (पार्ट-1)-12",
    classId: 12,
    blockDemandToTbc: 1850,
    tbcSentToBrc: 1850,
    tbcSentPercent: 100,
    brcReceived: 1850,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 1420,
    brcSentToSchoolPercent: 76.75,
    schoolDistributeToStudent: 980,
  },
  {
    id: 7,
    academicYear: "2026-2027",
    bookTypeName: "पाठ्यपुस्तक",
    mediumName: "अंग्रेजी माध्यम",
    districtName: "Panna",
    blockName: "Ajaigarh",
    titleName: "अकाउंटेन्सी (पार्ट-1)-12",
    classId: 12,
    blockDemandToTbc: 2450,
    tbcSentToBrc: 2450,
    tbcSentPercent: 100,
    brcReceived: 2450,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 2100,
    brcSentToSchoolPercent: 85.71,
    schoolDistributeToStudent: 1650,
  },
  {
    id: 8,
    academicYear: "2026-2027",
    bookTypeName: "पाठ्यपुस्तक",
    mediumName: "अंग्रेजी माध्यम",
    districtName: "Alirajpur",
    blockName: "Alirajpur",
    titleName: "अकाउंटेन्सी (पार्ट-1)-12",
    classId: 12,
    blockDemandToTbc: 1920,
    tbcSentToBrc: 1920,
    tbcSentPercent: 100,
    brcReceived: 1920,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 1750,
    brcSentToSchoolPercent: 91.14,
    schoolDistributeToStudent: 1420,
  },
  {
    id: 9,
    academicYear: "2026-2027",
    bookTypeName: "पाठ्यपुस्तक",
    mediumName: "अंग्रेजी माध्यम",
    districtName: "Ratlam",
    blockName: "Alot",
    titleName: "अकाउंटेन्सी (पार्ट-1)-12",
    classId: 12,
    blockDemandToTbc: 3100,
    tbcSentToBrc: 3100,
    tbcSentPercent: 100,
    brcReceived: 3100,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 2950,
    brcSentToSchoolPercent: 95.16,
    schoolDistributeToStudent: 2300,
  },
  {
    id: 10,
    academicYear: "2026-2027",
    bookTypeName: "पाठ्यपुस्तक",
    mediumName: "अंग्रेजी माध्यम",
    districtName: "Maihar",
    blockName: "Amarpatan",
    titleName: "अकाउंटेन्सी (पार्ट-1)-12",
    classId: 12,
    blockDemandToTbc: 2280,
    tbcSentToBrc: 2280,
    tbcSentPercent: 100,
    brcReceived: 2280,
    brcReceivedSortSupply: 0,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 100,
    brcSentToSchool: 2010,
    brcSentToSchoolPercent: 88.15,
    schoolDistributeToStudent: 1780,
  },
];
