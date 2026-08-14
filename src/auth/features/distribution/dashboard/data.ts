export interface KpiMetric {
  title: string;
  value: string;
  subText: string;
  trend?: string;
  badgeText?: string;
  icon: string;
  theme: "indigo" | "blue" | "amber" | "emerald";
  type: "net-demand" | "dispatch-rate" | "brc-rate" | "student-progress";
}

export interface DistrictMatrixItem {
  id: number;
  districtName: string;
  grossDemand: number;
  sentToBrc: number;
  brcRecvPercent: number;
  shortDamaged: number;
  sentToSchool: number;
  studentDistPercent: number;
}

export const mockKpiMetrics: KpiMetric[] = [
  {
    title: "Total Net Demand",
    value: "2,90,850",
    subText: "Units Required",
    trend: "+4.2% vs last year",
    icon: "pi pi-file-edit",
    theme: "indigo",
    type: "net-demand",
  },
  {
    title: "TBC Dispatch Rate",
    value: "85.4%",
    subText: "Total Units Dispatched",
    badgeText: "2,48,385 Dispatched",
    icon: "pi pi-truck",
    theme: "blue",
    type: "dispatch-rate",
  },
  {
    title: "BRC Receipt Rate",
    value: "82.1%",
    subText: "BRC received",
    badgeText: "0.2% Short/Damaged",
    icon: "pi pi-box",
    theme: "amber",
    type: "brc-rate",
  },
  {
    title: "Student Distribution Progress",
    value: "48.2%",
    subText: "Total Distributed",
    badgeText: "38 School Count",
    icon: "pi pi-check-circle",
    theme: "emerald",
    type: "student-progress",
  },
];

export const mockDistrictMatrixData: DistrictMatrixItem[] = [
  {
    id: 1,
    districtName: "Agar Malwa",
    grossDemand: 290850,
    sentToBrc: 777,
    brcRecvPercent: 80.2,
    shortDamaged: 0,
    sentToSchool: 262,
    studentDistPercent: 66.2,
  },
  {
    id: 2,
    districtName: "Alirajpur",
    grossDemand: 177550,
    sentToBrc: 278,
    brcRecvPercent: 85.4,
    shortDamaged: 0,
    sentToSchool: 138,
    studentDistPercent: 83.3,
  },
  {
    id: 3,
    districtName: "Anuppur",
    grossDemand: 181000,
    sentToBrc: 181,
    brcRecvPercent: 82.2,
    shortDamaged: 0,
    sentToSchool: 716,
    studentDistPercent: 42.2,
  },
  {
    id: 4,
    districtName: "Betul",
    grossDemand: 290850,
    sentToBrc: 1794,
    brcRecvPercent: 10.8,
    shortDamaged: 0,
    sentToSchool: 1794,
    studentDistPercent: 66.2,
  },
  {
    id: 5,
    districtName: "Bhind",
    grossDemand: 107950,
    sentToBrc: 179,
    brcRecvPercent: 93.2,
    shortDamaged: 0,
    sentToSchool: 192,
    studentDistPercent: 97.7,
  },
  {
    id: 6,
    districtName: "Morena",
    grossDemand: 214880,
    sentToBrc: 431,
    brcRecvPercent: 83.4,
    shortDamaged: 0,
    sentToSchool: 367,
    studentDistPercent: 98.2,
  },
  {
    id: 7,
    districtName: "Panna",
    grossDemand: 290850,
    sentToBrc: 226,
    brcRecvPercent: 80.2,
    shortDamaged: 0,
    sentToSchool: 100,
    studentDistPercent: 99.5,
  },
  {
    id: 8,
    districtName: "Ratlam",
    grossDemand: 290850,
    sentToBrc: 252,
    brcRecvPercent: 80.2,
    shortDamaged: 0,
    sentToSchool: 42,
    studentDistPercent: 51.76,
  },
  {
    id: 9,
    districtName: "Sehore",
    grossDemand: 223250,
    sentToBrc: 2591,
    brcRecvPercent: 92.5,
    shortDamaged: 0,
    sentToSchool: 2391,
    studentDistPercent: 88.4,
  },
  {
    id: 10,
    districtName: "Dhar",
    grossDemand: 219100,
    sentToBrc: 2191,
    brcRecvPercent: 89.0,
    shortDamaged: 0,
    sentToSchool: 1960,
    studentDistPercent: 79.3,
  },
];
