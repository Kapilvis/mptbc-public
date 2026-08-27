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
  percentBadge?: string;
  percentBadgeTheme?: string;
  icon: string;
  theme: "indigo" | "blue" | "amber" | "emerald";
  type:
    | "net-demand"
    | "approved-demand"
    | "dispatch-rate"
    | "brc-rate"
    | "student-progress"
    | "opening-stock"
    | "work-order-demand";
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
    title: "Target ( Approve demand )",
    value: "3,90,000",
    subText: "Books",
    percentBadgeTheme:
      "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    icon: "pi pi-file-edit",
    theme: "indigo",
    type: "net-demand",
  },
  {
    title: "Opening Stock in Depots",
    value: "30,500",
    subText: "Books",
    percentBadge: "7.8% OF TARGET",
    percentBadgeTheme:
      "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    icon: "pi pi-box",
    theme: "blue",
    type: "opening-stock",
  },
  {
    title: "Demand For Work Order",
    value: "3,59,500",
    subText: "Books (Target - Opening)",
    percentBadge: "92.2% OF TARGET",
    percentBadgeTheme:
      "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    icon: "pi pi-shopping-bag",
    theme: "amber",
    type: "work-order-demand",
  },
  {
    title: "Print and recived at depot",
    value: "1,80,500",
    subText: "Books",
    percentBadge: "46.3% PRINTED",
    percentBadgeTheme:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    icon: "pi pi-check-circle",
    theme: "emerald",
    type: "approved-demand",
  },
  {
    title: "supply to block office",
    value: "1,50,000",
    subText: "Books",
    percentBadge: "38.5% SUPPLIED",
    percentBadgeTheme:
      "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    icon: "pi pi-truck",
    theme: "blue",
    type: "dispatch-rate",
  },
  {
    title: "Student distribution",
    value: "1,35,000",
    subText: "Books (Data from SED 3.0 API)",
    percentBadge: "34.6% DISTRIBUTED",
    percentBadgeTheme:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
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
    blockDemandToTbc: 25500,
    tbcSentToBrc: 9808,
    tbcSentPercent: 38.5,
    brcReceived: 9750,
    brcReceivedSortSupply: 58,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.4,
    brcSentToSchool: 9400,
    brcSentToSchoolPercent: 96.4,
    schoolDistributeToStudent: 9000,
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
    blockDemandToTbc: 46800,
    tbcSentToBrc: 18000,
    tbcSentPercent: 38.5,
    brcReceived: 17850,
    brcReceivedSortSupply: 150,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.1,
    brcSentToSchool: 17200,
    brcSentToSchoolPercent: 96.3,
    schoolDistributeToStudent: 16500,
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
    blockDemandToTbc: 47200,
    tbcSentToBrc: 18154,
    tbcSentPercent: 38.5,
    brcReceived: 18000,
    brcReceivedSortSupply: 154,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.1,
    brcSentToSchool: 17350,
    brcSentToSchoolPercent: 96.4,
    schoolDistributeToStudent: 16600,
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
    blockDemandToTbc: 37000,
    tbcSentToBrc: 14231,
    tbcSentPercent: 38.5,
    brcReceived: 14100,
    brcReceivedSortSupply: 131,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.0,
    brcSentToSchool: 13600,
    brcSentToSchoolPercent: 96.4,
    schoolDistributeToStudent: 13000,
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
    blockDemandToTbc: 31300,
    tbcSentToBrc: 12038,
    tbcSentPercent: 38.5,
    brcReceived: 11950,
    brcReceivedSortSupply: 88,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.2,
    brcSentToSchool: 11500,
    brcSentToSchoolPercent: 96.2,
    schoolDistributeToStudent: 11000,
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
    blockDemandToTbc: 32200,
    tbcSentToBrc: 12385,
    tbcSentPercent: 38.5,
    brcReceived: 12300,
    brcReceivedSortSupply: 85,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.3,
    brcSentToSchool: 11850,
    brcSentToSchoolPercent: 96.3,
    schoolDistributeToStudent: 11300,
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
    blockDemandToTbc: 42700,
    tbcSentToBrc: 16423,
    tbcSentPercent: 38.5,
    brcReceived: 16300,
    brcReceivedSortSupply: 123,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.2,
    brcSentToSchool: 15700,
    brcSentToSchoolPercent: 96.3,
    schoolDistributeToStudent: 15000,
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
    blockDemandToTbc: 33400,
    tbcSentToBrc: 12846,
    tbcSentPercent: 38.5,
    brcReceived: 12750,
    brcReceivedSortSupply: 96,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.2,
    brcSentToSchool: 12300,
    brcSentToSchoolPercent: 96.4,
    schoolDistributeToStudent: 11800,
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
    blockDemandToTbc: 54000,
    tbcSentToBrc: 20769,
    tbcSentPercent: 38.5,
    brcReceived: 20600,
    brcReceivedSortSupply: 169,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.1,
    brcSentToSchool: 19850,
    brcSentToSchoolPercent: 96.3,
    schoolDistributeToStudent: 19000,
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
    blockDemandToTbc: 39900,
    tbcSentToBrc: 15346,
    tbcSentPercent: 38.5,
    brcReceived: 15200,
    brcReceivedSortSupply: 146,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.0,
    brcSentToSchool: 14600,
    brcSentToSchoolPercent: 96.0,
    schoolDistributeToStudent: 13900,
  },
];
