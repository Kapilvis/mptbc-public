import { initialPrinterRegistrationListData } from "../printer-registration/data";
import { mockTitles } from "../../master/title/data";
import { mockClasses } from "../../master/class/data";

export interface PrinterQualityInspectionItem {
  titleId: string;
  titleName: string;
  titleCode: string;
  className: string;
  totalBooks: number;
  screenPrintingScore: number; // Max: 1
  inkQualityScore: number; // Max: 7
  bindingScore: number; // Max: 2
  otherScore: string; // OTHERS (Text Remarks)
  totalScore: number; // Max: 10
  status: "Passed" | "Failed";
}

export interface PrinterQualityInspection {
  inspectionId: string;
  printerId: string;
  printerName: string;
  printerCode: string;
  inspectionDate: string; // ISO string format
  academicYear: string;
  items: PrinterQualityInspectionItem[];
  totalScore: number;
  maximumScore: number;
  percentage: number;
  grade: string;
  status: "Passed" | "Failed" | "Pending";
  remarks?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  isActive?: boolean;
}

// ─── Default Quality Criteria Master ──────────────────────────────────────────
export interface QualityCriteria {
  criteriaId: string;
  name: string;
  maxScore: number;
}

export const initialQualityCriteria: QualityCriteria[] = [
  {
    criteriaId: "screenPrinting",
    name: "Registration, colour scheme & Printing Quality",
    maxScore: 1,
  },
  {
    criteriaId: "inkQuality",
    name: "Registration, colour, Quality of Ink, Scum, Pin mark & imposition",
    maxScore: 7,
  },
  {
    criteriaId: "binding",
    name: "Stitching/Perfect Binding, scheme, Evenness of Ink, Cover Pasting & Trimming",
    maxScore: 2,
  },
];

// Helper to calculate summary details for a set of child items
export function calculateInspectionSummary(
  items: Partial<PrinterQualityInspectionItem>[],
) {
  let obtainedTotal = 0;
  let maxTotal = 0;

  items.forEach((item) => {
    const screenPrinting = Number(item.screenPrintingScore || 0);
    const inkQuality = Number(item.inkQualityScore || 0);
    const binding = Number(item.bindingScore || 0);

    obtainedTotal += screenPrinting + inkQuality + binding;
    maxTotal += 10; // Each textbook title is out of 10 marks
  });

  const percentage =
    maxTotal > 0 ? Number(((obtainedTotal / maxTotal) * 100).toFixed(2)) : 0;

  let grade = "Failed";
  if (percentage >= 90) grade = "Excellent";
  else if (percentage >= 80) grade = "Good";
  else if (percentage >= 60) grade = "Satisfactory";
  else if (percentage >= 40) grade = "Needs Improvement";

  const status: "Passed" | "Failed" = percentage >= 40 ? "Passed" : "Failed";

  return {
    totalScore: Number(obtainedTotal.toFixed(2)),
    maximumScore: maxTotal,
    percentage,
    grade,
    status,
  };
}

// Helper to resolve allotted textbook titles for a selected printer
export function getPrinterAllottedTitles(
  printerCode: string,
): PrinterQualityInspectionItem[] {
  // To simulate allotted titles, we choose a deterministic subset of mockTitles
  // based on the printer code. ABC Press gets odd indexes, others get even.
  const isOdd = printerCode === "PRN-001" || printerCode.length % 2 === 1;
  const filtered = mockTitles
    .filter((_, idx) => (idx % 2 === 1) === isOdd)
    .slice(0, 5);

  return filtered.map((t, idx) => ({
    titleId: String(t.titleId),
    titleName: t.name,
    titleCode: t.code || `TTL-00${t.titleId}`,
    className: t.className || `Class ${t.classId}`,
    totalBooks: 5000 + idx * 2500, // Simulated total allotment quantity
    screenPrintingScore: 0,
    inkQualityScore: 0,
    bindingScore: 0,
    otherScore: "",
    totalScore: 0,
    status: "Failed",
  }));
}

// Academic Years Master
export const academicYears = [
  { id: "2026-2027", text: "2026-2027" },
  { id: "2025-2026", text: "2025-2026" },
  { id: "2024-2025", text: "2024-2025" },
];

// Searchable master helpers
export const getPrintersDropdownData = () => {
  return initialPrinterRegistrationListData.map((p) => ({
    id: p.printerCode,
    text: p.printerName,
    code: p.printerCode,
  }));
};

export const getTitlesDropdownData = () => {
  return mockTitles.map((t) => ({
    id: String(t.titleId),
    text: `${t.name} (Class ${t.classId})`,
    code: t.code,
    classId: t.classId,
    className: t.className,
    mediumName: t.mediumName,
  }));
};

export const getClassesDropdownData = () => {
  return mockClasses.map((c) => ({
    id: String(c.classId),
    text: c.name,
  }));
};

// ─── Mock Quality Inspection History ──────────────────────────────────────────
export const initialInspections: PrinterQualityInspection[] = [
  {
    inspectionId: "INSP-001",
    printerId: "PRN-001",
    printerName: "ABC Printing Press",
    printerCode: "PRN-001",
    inspectionDate: "2026-08-10",
    academicYear: "2026-2027",
    remarks:
      "Overall batch alignment and binding wire centers are highly satisfactory.",
    totalScore: 42.7,
    maximumScore: 50,
    percentage: 85.4,
    grade: "Good",
    status: "Passed",
    createdDate: "2026-08-10",
    createdBy: "System Admin",
    items: [
      {
        titleId: "2",
        titleName: "आनंदमय गणित -1(2)",
        titleCode: "TTL-002",
        className: "Class 1",
        totalBooks: 5000,
        screenPrintingScore: 0.9,
        inkQualityScore: 6.2,
        bindingScore: 1.8,
        otherScore: "Neat printing",
        totalScore: 8.9,
        status: "Passed",
      },
      {
        titleId: "4",
        titleName: "भाषा भारती-2 (4)",
        titleCode: "TTL-004",
        className: "Class 2",
        totalBooks: 7500,
        screenPrintingScore: 0.8,
        inkQualityScore: 5.8,
        bindingScore: 1.7,
        otherScore: "Excellent alignment",
        totalScore: 8.3,
        status: "Passed",
      },
      {
        titleId: "6",
        titleName: "इंग्लिश रीडर -2 (6)",
        titleCode: "TTL-006",
        className: "Class 2",
        totalBooks: 10000,
        screenPrintingScore: 1.0,
        inkQualityScore: 6.5,
        bindingScore: 1.9,
        otherScore: "Good glue trim",
        totalScore: 9.4,
        status: "Passed",
      },
      {
        titleId: "8",
        titleName: "गणित मेला -3 (8)",
        titleCode: "TTL-008",
        className: "Class 3",
        totalBooks: 12500,
        screenPrintingScore: 0.7,
        inkQualityScore: 5.2,
        bindingScore: 1.5,
        otherScore: "No deviations",
        totalScore: 7.4,
        status: "Passed",
      },
      {
        titleId: "10",
        titleName: "इंग्लिश रीडर -3 (10)",
        titleCode: "TTL-010",
        className: "Class 3",
        totalBooks: 15000,
        screenPrintingScore: 0.9,
        inkQualityScore: 6.0,
        bindingScore: 1.8,
        otherScore: "Well packaged",
        totalScore: 8.7,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-002",
    printerId: "PRN-000124",
    printerName: "Shree Offset Press",
    printerCode: "PRN-000124",
    inspectionDate: "2026-08-12",
    academicYear: "2026-2027",
    remarks: "Defects identified in spine wire loops and ink tone consistency.",
    totalScore: 11.2,
    maximumScore: 20,
    percentage: 56.0,
    grade: "Needs Improvement",
    status: "Passed",
    createdDate: "2026-08-12",
    createdBy: "System Admin",
    items: [
      {
        titleId: "2",
        titleName: "आनंदमय गणित -1(2)",
        titleCode: "TTL-002",
        className: "Class 1",
        totalBooks: 5000,
        screenPrintingScore: 0.4,
        inkQualityScore: 3.5,
        bindingScore: 1.2,
        otherScore: "Smudged pages",
        totalScore: 5.1,
        status: "Passed",
      },
      {
        titleId: "4",
        titleName: "भाषा भारती-2 (4)",
        titleCode: "TTL-004",
        className: "Class 2",
        totalBooks: 7500,
        screenPrintingScore: 0.6,
        inkQualityScore: 4.1,
        bindingScore: 1.4,
        otherScore: "Trimming uneven",
        totalScore: 6.1,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-003",
    printerId: "PRN-000213",
    printerName: "Aditya Web Printers Ltd",
    printerCode: "PRN-000213",
    inspectionDate: "2026-08-14",
    academicYear: "2026-2027",
    remarks: "Perfect binding alignment on cover is clean. Even ink delivery.",
    totalScore: 34.5,
    maximumScore: 40,
    percentage: 86.25,
    grade: "Good",
    status: "Passed",
    createdDate: "2026-08-14",
    createdBy: "System Admin",
    items: [
      {
        titleId: "1",
        titleName: "भाषा भारती - 1  (1)",
        titleCode: "TTL-001",
        className: "Class 1",
        totalBooks: 12000,
        screenPrintingScore: 0.85,
        inkQualityScore: 6.1,
        bindingScore: 1.8,
        otherScore: "Good binding",
        totalScore: 8.75,
        status: "Passed",
      },
      {
        titleId: "3",
        titleName: "भाषा भारती-2 (3)",
        titleCode: "TTL-003",
        className: "Class 2",
        totalBooks: 15000,
        screenPrintingScore: 0.9,
        inkQualityScore: 5.9,
        bindingScore: 1.75,
        otherScore: "Text clear",
        totalScore: 8.55,
        status: "Passed",
      },
      {
        titleId: "5",
        titleName: "भाषा भारती-3 (5)",
        titleCode: "TTL-005",
        className: "Class 3",
        totalBooks: 9500,
        screenPrintingScore: 0.95,
        inkQualityScore: 6.2,
        bindingScore: 1.85,
        otherScore: "Clean cut margin",
        totalScore: 9.0,
        status: "Passed",
      },
      {
        titleId: "7",
        titleName: "गणित मेला -3 (7)",
        titleCode: "TTL-007",
        className: "Class 3",
        totalBooks: 11000,
        screenPrintingScore: 0.8,
        inkQualityScore: 5.6,
        bindingScore: 1.8,
        otherScore: "Slight fold crease",
        totalScore: 8.2,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-004",
    printerId: "PRN-000185",
    printerName: "Dev Offset Printers",
    printerCode: "PRN-000185",
    inspectionDate: "2026-08-15",
    academicYear: "2026-2027",
    remarks:
      "Perfect binding wire loops meet MPTBC specification requirements.",
    totalScore: 27.2,
    maximumScore: 30,
    percentage: 90.67,
    grade: "Excellent",
    status: "Passed",
    createdDate: "2026-08-15",
    createdBy: "System Admin",
    items: [
      {
        titleId: "2",
        titleName: "आनंदमय गणित -1(2)",
        titleCode: "TTL-002",
        className: "Class 1",
        totalBooks: 14000,
        screenPrintingScore: 0.95,
        inkQualityScore: 6.4,
        bindingScore: 1.9,
        otherScore: "Excellent glue trim",
        totalScore: 9.25,
        status: "Passed",
      },
      {
        titleId: "4",
        titleName: "भाषा भारती-2 (4)",
        titleCode: "TTL-004",
        className: "Class 2",
        totalBooks: 11000,
        screenPrintingScore: 0.9,
        inkQualityScore: 6.1,
        bindingScore: 1.8,
        otherScore: "Bright colors",
        totalScore: 8.8,
        status: "Passed",
      },
      {
        titleId: "6",
        titleName: "इंग्लिश रीडर -2 (6)",
        titleCode: "TTL-006",
        className: "Class 2",
        totalBooks: 13000,
        screenPrintingScore: 0.95,
        inkQualityScore: 6.3,
        bindingScore: 1.9,
        otherScore: "Solid stitching",
        totalScore: 9.15,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-005",
    printerId: "PRN-000142",
    printerName: "Narmada Offset Works",
    printerCode: "PRN-000142",
    inspectionDate: "2026-08-16",
    academicYear: "2026-2027",
    remarks: "Top-notch binding and printing layout alignment.",
    totalScore: 18.9,
    maximumScore: 20,
    percentage: 94.5,
    grade: "Excellent",
    status: "Passed",
    createdDate: "2026-08-16",
    createdBy: "System Admin",
    items: [
      {
        titleId: "8",
        titleName: "गणित मेला -3 (8)",
        titleCode: "TTL-008",
        className: "Class 3",
        totalBooks: 8500,
        screenPrintingScore: 0.95,
        inkQualityScore: 6.6,
        bindingScore: 1.9,
        otherScore: "Premium registration",
        totalScore: 9.45,
        status: "Passed",
      },
      {
        titleId: "10",
        titleName: "इंग्लिश रीडर -3 (10)",
        titleCode: "TTL-010",
        className: "Class 3",
        totalBooks: 9500,
        screenPrintingScore: 0.95,
        inkQualityScore: 6.6,
        bindingScore: 1.9,
        otherScore: "Very neat",
        totalScore: 9.45,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-006",
    printerId: "PRN-001",
    printerName: "ABC Printing Press",
    printerCode: "PRN-001",
    inspectionDate: "2026-08-17",
    academicYear: "2026-2027",
    remarks: "Good quality, minor margin scuffing on class 2 textbooks.",
    totalScore: 25.4,
    maximumScore: 30,
    percentage: 84.67,
    grade: "Good",
    status: "Passed",
    createdDate: "2026-08-17",
    createdBy: "System Admin",
    items: [
      {
        titleId: "2",
        titleName: "आनंदमय गणित -1(2)",
        titleCode: "TTL-002",
        className: "Class 1",
        totalBooks: 6000,
        screenPrintingScore: 0.9,
        inkQualityScore: 6.0,
        bindingScore: 1.8,
        otherScore: "Clean margin",
        totalScore: 8.7,
        status: "Passed",
      },
      {
        titleId: "4",
        titleName: "भाषा भारती-2 (4)",
        titleCode: "TTL-004",
        className: "Class 2",
        totalBooks: 8000,
        screenPrintingScore: 0.8,
        inkQualityScore: 5.7,
        bindingScore: 1.7,
        otherScore: "Fold crease noted",
        totalScore: 8.2,
        status: "Passed",
      },
      {
        titleId: "6",
        titleName: "इंग्लिश रीडर -2 (6)",
        titleCode: "TTL-006",
        className: "Class 2",
        totalBooks: 12000,
        screenPrintingScore: 0.9,
        inkQualityScore: 6.0,
        bindingScore: 1.6,
        otherScore: "Even gluing",
        totalScore: 8.5,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-007",
    printerId: "PRN-000124",
    printerName: "Shree Offset Press",
    printerCode: "PRN-000124",
    inspectionDate: "2026-08-18",
    academicYear: "2026-2027",
    remarks: "Acceptable quality, some wire loop spacing inconsistencies.",
    totalScore: 28.5,
    maximumScore: 40,
    percentage: 71.25,
    grade: "Satisfactory",
    status: "Passed",
    createdDate: "2026-08-18",
    createdBy: "System Admin",
    items: [
      {
        titleId: "1",
        titleName: "भाषा भारती - 1  (1)",
        titleCode: "TTL-001",
        className: "Class 1",
        totalBooks: 9000,
        screenPrintingScore: 0.75,
        inkQualityScore: 5.0,
        bindingScore: 1.5,
        otherScore: "Average",
        totalScore: 7.25,
        status: "Passed",
      },
      {
        titleId: "3",
        titleName: "भाषा भारती-2 (3)",
        titleCode: "TTL-003",
        className: "Class 2",
        totalBooks: 10000,
        screenPrintingScore: 0.8,
        inkQualityScore: 5.2,
        bindingScore: 1.6,
        otherScore: "Slight ink spot",
        totalScore: 7.6,
        status: "Passed",
      },
      {
        titleId: "5",
        titleName: "भाषा भारती-3 (5)",
        titleCode: "TTL-005",
        className: "Class 3",
        totalBooks: 11000,
        screenPrintingScore: 0.7,
        inkQualityScore: 4.8,
        bindingScore: 1.4,
        otherScore: "Binding is loose",
        totalScore: 6.9,
        status: "Passed",
      },
      {
        titleId: "7",
        titleName: "गणित मेला -3 (7)",
        titleCode: "TTL-007",
        className: "Class 3",
        totalBooks: 13000,
        screenPrintingScore: 0.7,
        inkQualityScore: 4.6,
        bindingScore: 1.45,
        otherScore: "Good trim size",
        totalScore: 6.75,
        status: "Passed",
      },
    ],
  },
  {
    inspectionId: "INSP-008",
    printerId: "PRN-000213",
    printerName: "Aditya Web Printers Ltd",
    printerCode: "PRN-000213",
    inspectionDate: "2026-08-19",
    academicYear: "2026-2027",
    remarks: "Defects in stitching wire gauge quality. Rejected parameter.",
    totalScore: 14.8,
    maximumScore: 30,
    percentage: 49.33,
    grade: "Needs Improvement",
    status: "Passed",
    createdDate: "2026-08-19",
    createdBy: "System Admin",
    items: [
      {
        titleId: "2",
        titleName: "आनंदमय गणित -1(2)",
        titleCode: "TTL-002",
        className: "Class 1",
        totalBooks: 15000,
        screenPrintingScore: 0.5,
        inkQualityScore: 3.8,
        bindingScore: 1.0,
        otherScore: "Poor trim cut",
        totalScore: 5.3,
        status: "Passed",
      },
      {
        titleId: "4",
        titleName: "भाषा भारती-2 (4)",
        titleCode: "TTL-004",
        className: "Class 2",
        totalBooks: 12000,
        screenPrintingScore: 0.6,
        inkQualityScore: 4.0,
        bindingScore: 1.1,
        otherScore: "Stitching weak",
        totalScore: 5.7,
        status: "Passed",
      },
      {
        titleId: "6",
        titleName: "इंग्लिश रीडर -2 (6)",
        titleCode: "TTL-006",
        className: "Class 2",
        totalBooks: 14000,
        screenPrintingScore: 0.4,
        inkQualityScore: 2.8,
        bindingScore: 0.6,
        otherScore: "Cover misaligned",
        totalScore: 3.8,
        status: "Failed",
      },
    ],
  },
  {
    inspectionId: "INSP-009",
    printerId: "PRN-000185",
    printerName: "Dev Offset Printers",
    printerCode: "PRN-000185",
    inspectionDate: "2026-08-20",
    academicYear: "2026-2027",
    remarks: "Unacceptable smudging across several pages. Total fail.",
    totalScore: 7.5,
    maximumScore: 20,
    percentage: 37.5,
    grade: "Failed",
    status: "Failed",
    createdDate: "2026-08-20",
    createdBy: "System Admin",
    items: [
      {
        titleId: "8",
        titleName: "गणित मेला -3 (8)",
        titleCode: "TTL-008",
        className: "Class 3",
        totalBooks: 6000,
        screenPrintingScore: 0.3,
        inkQualityScore: 2.5,
        bindingScore: 0.8,
        otherScore: "Smudged text",
        totalScore: 3.6,
        status: "Failed",
      },
      {
        titleId: "10",
        titleName: "इंग्लिश रीडर -3 (10)",
        titleCode: "TTL-010",
        className: "Class 3",
        totalBooks: 7000,
        screenPrintingScore: 0.3,
        inkQualityScore: 2.7,
        bindingScore: 0.9,
        otherScore: "Back cover torn",
        totalScore: 3.9,
        status: "Failed",
      },
    ],
  },
  {
    inspectionId: "INSP-010",
    printerId: "PRN-000142",
    printerName: "Narmada Offset Works",
    printerCode: "PRN-000142",
    inspectionDate: "2026-08-21",
    academicYear: "2026-2027",
    remarks: "Good print layout, binding trimming is smooth.",
    totalScore: 22.8,
    maximumScore: 30,
    percentage: 76.0,
    grade: "Satisfactory",
    status: "Passed",
    createdDate: "2026-08-21",
    createdBy: "System Admin",
    items: [
      {
        titleId: "1",
        titleName: "भाषा भारती - 1  (1)",
        titleCode: "TTL-001",
        className: "Class 1",
        totalBooks: 10000,
        screenPrintingScore: 0.8,
        inkQualityScore: 5.5,
        bindingScore: 1.6,
        otherScore: "Nice print",
        totalScore: 7.9,
        status: "Passed",
      },
      {
        titleId: "3",
        titleName: "भाषा भारती-2 (3)",
        titleCode: "TTL-003",
        className: "Class 2",
        totalBooks: 11000,
        screenPrintingScore: 0.75,
        inkQualityScore: 5.2,
        bindingScore: 1.5,
        otherScore: "Slight scuffs",
        totalScore: 7.45,
        status: "Passed",
      },
      {
        titleId: "5",
        titleName: "भाषा भारती-3 (5)",
        titleCode: "TTL-005",
        className: "Class 3",
        totalBooks: 12000,
        screenPrintingScore: 0.75,
        inkQualityScore: 5.2,
        bindingScore: 1.5,
        otherScore: "Slight scuffs",
        totalScore: 7.45,
        status: "Passed",
      },
    ],
  },
];
