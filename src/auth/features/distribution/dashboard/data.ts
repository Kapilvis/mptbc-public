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
    title: "Target ( Approve demand )",
    value: "3,90,000",
    subText: "Books",
    icon: "pi pi-file-edit",
    theme: "indigo",
    type: "net-demand",
  },
  {
    title: "Print and recived at depot",
    value: "2,48,385",
    subText: "Books",
    icon: "pi pi-check-circle",
    theme: "emerald",
    type: "approved-demand",
  },
  {
    title: "supply to block office",
    value: "2,03,924",
    subText: "Books",
    icon: "pi pi-truck",
    theme: "blue",
    type: "dispatch-rate",
  },
  {
    title: "Student distribution",
    value: "1,88,364",
    subText: "Books (As Recived Data from SED 3.0 through API)",
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
    tbcSentToBrc: 13260,
    tbcSentPercent: 52.0,
    brcReceived: 13150,
    brcReceivedSortSupply: 110,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.17,
    brcSentToSchool: 12700,
    brcSentToSchoolPercent: 96.58,
    schoolDistributeToStudent: 12200,
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
    tbcSentToBrc: 24336,
    tbcSentPercent: 52.0,
    brcReceived: 24100,
    brcReceivedSortSupply: 236,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.03,
    brcSentToSchool: 23300,
    brcSentToSchoolPercent: 96.68,
    schoolDistributeToStudent: 22500,
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
    tbcSentToBrc: 25016,
    tbcSentPercent: 53.0,
    brcReceived: 24800,
    brcReceivedSortSupply: 216,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.14,
    brcSentToSchool: 23900,
    brcSentToSchoolPercent: 96.37,
    schoolDistributeToStudent: 23100,
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
    tbcSentToBrc: 19240,
    tbcSentPercent: 52.0,
    brcReceived: 19000,
    brcReceivedSortSupply: 240,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 98.75,
    brcSentToSchool: 18400,
    brcSentToSchoolPercent: 96.84,
    schoolDistributeToStudent: 17700,
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
    tbcSentToBrc: 16589,
    tbcSentPercent: 53.0,
    brcReceived: 16450,
    brcReceivedSortSupply: 139,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.16,
    brcSentToSchool: 15900,
    brcSentToSchoolPercent: 96.66,
    schoolDistributeToStudent: 15300,
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
    tbcSentToBrc: 16744,
    tbcSentPercent: 52.0,
    brcReceived: 16600,
    brcReceivedSortSupply: 144,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.14,
    brcSentToSchool: 16000,
    brcSentToSchoolPercent: 96.39,
    schoolDistributeToStudent: 15400,
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
    tbcSentToBrc: 22204,
    tbcSentPercent: 52.0,
    brcReceived: 22000,
    brcReceivedSortSupply: 204,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.08,
    brcSentToSchool: 21200,
    brcSentToSchoolPercent: 96.36,
    schoolDistributeToStudent: 20400,
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
    tbcSentToBrc: 17702,
    tbcSentPercent: 53.0,
    brcReceived: 17500,
    brcReceivedSortSupply: 202,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 98.86,
    brcSentToSchool: 16900,
    brcSentToSchoolPercent: 96.57,
    schoolDistributeToStudent: 16300,
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
    tbcSentToBrc: 28080,
    tbcSentPercent: 52.0,
    brcReceived: 27800,
    brcReceivedSortSupply: 280,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.0,
    brcSentToSchool: 26900,
    brcSentToSchoolPercent: 96.76,
    schoolDistributeToStudent: 26000,
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
    tbcSentToBrc: 20753,
    tbcSentPercent: 52.01,
    brcReceived: 20600,
    brcReceivedSortSupply: 153,
    brcReceivedDamaged: 0,
    brcReceivedPercent: 99.26,
    brcSentToSchool: 19800,
    brcSentToSchoolPercent: 96.12,
    schoolDistributeToStudent: 19464,
  },
];
