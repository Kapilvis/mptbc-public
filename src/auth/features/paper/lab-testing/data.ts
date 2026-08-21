export interface LabParameterConfig {
  id: number;
  name: string;
  requiredSpecification: string;
  unit: string;
  target?: number;
  min?: number;
  max?: number;
  type: "tolerance" | "range" | "min" | "max";
}

export interface LabParameterResult {
  parameterId: number;
  parameterName: string;
  requiredSpecification: string;
  actualResult: number | string;
  deviation: string;
  status: "PASS" | "FAIL";
}

export interface PaperLabTestingRecord {
  id: string; // e.g. PAP-2026-00125
  sampleId: string;
  supplierVendor: string;
  paperType: string;
  gsm: string;
  batchLotNo: string;
  reelSheetSize: string;
  testedBy: string; // Tester Name (Person who entered/tested)
  testingAgency: string; // Testing Agency Name
  testReportNo: string;
  sentDate?: string;
  receivedDate?: string;
  testingDate?: string;
  overallResult: "SENT" | "PASS" | "FAIL";
  approvalStatus: string;
  parameters: LabParameterResult[];
  qualityScore?: number;
}

export const testingAgencies = [
  {
    id: "CPPRI",
    name: "Central Pulp & Paper Research Institute (CPPRI), Saharanpur",
  },
  {
    id: "IPPTA",
    name: "Institute of Pulp & Paper Technology (IPPTA), Bengaluru",
  },
  {
    id: "WPPRI",
    name: "West Pulp & Paper Research Institute (WPPRI), Kolkata",
  },
  {
    id: "TNPL",
    name: "Tamil Nadu Newsprint & Papers Ltd. Research Center (TNPL), Karur",
  },
  {
    id: "BIS",
    name: "Bureau of Indian Standards (BIS) Paper & Board Lab, New Delhi",
  },
  { id: "HPC", name: "Hindustan Paper Corporation Ltd. Quality Lab, Vellore" },
];

export const defaultPaperTypes = [
  "Book Printing Paper",
  "Cover Paper",
  "Maplitho Paper",
  "Kraft Paper",
  "Art Paper",
  "Newsprint Paper",
];

export const defaultGsmOptions = [
  "70 GSM",
  "75 GSM",
  "80 GSM",
  "120 GSM",
  "150 GSM",
  "200 GSM",
];

export const fixedLabParameters: LabParameterConfig[] = [
  {
    id: 1,
    name: "Grammage (GSM)",
    requiredSpecification: "80 ± 2",
    unit: "GSM",
    target: 80,
    min: 78,
    max: 82,
    type: "tolerance",
  },
  {
    id: 2,
    name: "Thickness / Caliper",
    requiredSpecification: "As per spec (95 - 105 µm)",
    unit: "µm",
    min: 95,
    max: 105,
    type: "range",
  },
  {
    id: 3,
    name: "Moisture Content",
    requiredSpecification: "4.0 - 7.0 %",
    unit: "%",
    min: 4.0,
    max: 7.0,
    type: "range",
  },
  {
    id: 4,
    name: "Brightness",
    requiredSpecification: "≥ 88 %",
    unit: "%",
    target: 88,
    min: 88,
    type: "min",
  },
  {
    id: 5,
    name: "Opacity",
    requiredSpecification: "≥ 90 %",
    unit: "%",
    target: 90,
    min: 90,
    type: "min",
  },
  {
    id: 6,
    name: "Tensile Strength (MD)",
    requiredSpecification: "≥ 3.20 kN/m",
    unit: "kN/m",
    target: 3.2,
    min: 3.2,
    type: "min",
  },
  {
    id: 7,
    name: "Tear Strength (MD)",
    requiredSpecification: "≥ 600 mN",
    unit: "mN",
    target: 600,
    min: 600,
    type: "min",
  },
  {
    id: 8,
    name: "Bursting Strength",
    requiredSpecification: "≥ 150 kPa",
    unit: "kPa",
    target: 150,
    min: 150,
    type: "min",
  },
  {
    id: 9,
    name: "Surface Roughness (Smoothness)",
    requiredSpecification: "1.0 - 2.5 µm",
    unit: "µm",
    min: 1.0,
    max: 2.5,
    type: "range",
  },
  {
    id: 10,
    name: "Cobb Test (Water Absorption)",
    requiredSpecification: "≤ 30 g/m²",
    unit: "g/m²",
    max: 30,
    type: "max",
  },
];

export function computeParameterEvaluation(
  paramConfig: LabParameterConfig,
  actualVal?: number | string,
): { deviation: string; status: "PASS" | "FAIL" } {
  if (
    actualVal === undefined ||
    actualVal === null ||
    actualVal === "" ||
    isNaN(Number(actualVal))
  ) {
    return { deviation: "-", status: "FAIL" };
  }

  const val = Number(actualVal);

  switch (paramConfig.type) {
    case "tolerance": {
      const diff = val - (paramConfig.target || 80);
      const isPass =
        paramConfig.min !== undefined && paramConfig.max !== undefined
          ? val >= paramConfig.min && val <= paramConfig.max
          : Math.abs(diff) <= 2;
      const devStr = diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
      return { deviation: devStr, status: isPass ? "PASS" : "FAIL" };
    }

    case "range": {
      const min = paramConfig.min || 0;
      const max = paramConfig.max || 100;
      const isPass = val >= min && val <= max;
      if (isPass) {
        return { deviation: "Within Range", status: "PASS" };
      }
      const dev = val < min ? val - min : val - max;
      const devStr = dev > 0 ? `+${dev.toFixed(1)}` : `${dev.toFixed(1)}`;
      return { deviation: devStr, status: "FAIL" };
    }

    case "min": {
      const target = paramConfig.target || paramConfig.min || 0;
      const isPass = val >= target;
      const diff = val - target;
      let devStr = "";
      if (paramConfig.unit === "%") {
        devStr = diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
      } else if (paramConfig.unit === "kN/m") {
        devStr = diff >= 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
      } else {
        devStr = diff >= 0 ? `+${diff.toFixed(0)}` : `${diff.toFixed(0)}`;
      }
      return { deviation: devStr, status: isPass ? "PASS" : "FAIL" };
    }

    case "max": {
      const max = paramConfig.max || 30;
      const isPass = val <= max;
      return {
        deviation: isPass
          ? "Within Limit"
          : `Exceeds by ${(val - max).toFixed(1)}`,
        status: isPass ? "PASS" : "FAIL",
      };
    }

    default:
      return { deviation: "N/A", status: "PASS" };
  }
}

export function generateSampleId(existingCount: number = 0): string {
  const year = new Date().getFullYear();
  const nextSeq = String(125 - existingCount).padStart(5, "0");
  return `PAP-${year}-${nextSeq}`;
}

export const initialLabTestingRecords: PaperLabTestingRecord[] = [
  {
    id: "PAP-2026-00125",
    sampleId: "PAP-2026-00125",
    supplierVendor: "Bharat Paper Mills",
    paperType: "Book Printing Paper",
    gsm: "80 GSM",
    batchLotNo: "LOT-45821",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "R. K. Singh",
    testingAgency:
      "Central Pulp & Paper Research Institute (CPPRI), Saharanpur",
    testReportNo: "TBC/PQT/2026/00125",
    sentDate: "2026-08-18",
    receivedDate: "2026-08-20",
    testingDate: "2026-08-20",
    overallResult: "PASS",
    approvalStatus: "Approved for Use",
    qualityScore: 92,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.4,
        deviation: "+0.4",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 96,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.8,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 89.2,
        deviation: "+1.2%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 91.5,
        deviation: "+1.5%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.42,
        deviation: "+0.22",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 620,
        deviation: "+20",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 165,
        deviation: "+15",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 1.8,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 28,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00124",
    sampleId: "PAP-2026-00124",
    supplierVendor: "Bharat Paper Mills",
    paperType: "Book Printing Paper",
    gsm: "75 GSM",
    batchLotNo: "LOT-45810",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Anil Verma",
    testingAgency: "Institute of Pulp & Paper Technology (IPPTA), Bengaluru",
    testReportNo: "TBC/PQT/2026/00124",
    sentDate: "2026-08-19",
    testingDate: "2026-08-19",
    overallResult: "SENT",
    approvalStatus: "Sent for Lab Testing",
    qualityScore: 89,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.1,
        deviation: "+0.1",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 98,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 6.1,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 88.8,
        deviation: "+0.8%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 90.4,
        deviation: "+0.4%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.3,
        deviation: "+0.10",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 610,
        deviation: "+10",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 158,
        deviation: "+8",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 2.1,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 26,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00123",
    sampleId: "PAP-2026-00123",
    supplierVendor: "Shree Ganesh Paper",
    paperType: "Book Printing Paper",
    gsm: "70 GSM",
    batchLotNo: "LOT-45798",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "S. N. Tiwari",
    testingAgency: "West Pulp & Paper Research Institute (WPPRI), Kolkata",
    testReportNo: "TBC/PQT/2026/00123",
    sentDate: "2026-08-15",
    receivedDate: "2026-08-18",
    testingDate: "2026-08-18",
    overallResult: "FAIL",
    approvalStatus: "Rejected / Out of Spec",
    qualityScore: 65,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 75.5,
        deviation: "-4.5",
        status: "FAIL",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 90,
        deviation: "-5.0",
        status: "FAIL",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.2,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 86.0,
        deviation: "-2.0%",
        status: "FAIL",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 89.0,
        deviation: "-1.0%",
        status: "FAIL",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.1,
        deviation: "-0.10",
        status: "FAIL",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 580,
        deviation: "-20",
        status: "FAIL",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 142,
        deviation: "-8",
        status: "FAIL",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 2.8,
        deviation: "+0.3",
        status: "FAIL",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 34,
        deviation: "Exceeds by 4.0",
        status: "FAIL",
      },
    ],
  },
  {
    id: "PAP-2026-00122",
    sampleId: "PAP-2026-00122",
    supplierVendor: "Shree Ganesh Paper",
    paperType: "Cover Paper",
    gsm: "120 GSM",
    batchLotNo: "LOT-45785",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Pooja Sharma",
    testingAgency:
      "Tamil Nadu Newsprint & Papers Ltd. Research Center (TNPL), Karur",
    testReportNo: "TBC/PQT/2026/00122",
    sentDate: "2026-08-14",
    receivedDate: "2026-08-17",
    testingDate: "2026-08-17",
    overallResult: "PASS",
    approvalStatus: "Approved for Use",
    qualityScore: 91,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.2,
        deviation: "+0.2",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 100,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.5,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 89.5,
        deviation: "+1.5%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 92.0,
        deviation: "+2.0%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.5,
        deviation: "+0.30",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 640,
        deviation: "+40",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 170,
        deviation: "+20",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 1.6,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 25,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00121",
    sampleId: "PAP-2026-00121",
    supplierVendor: "Narmada Paper Mills",
    paperType: "Book Printing Paper",
    gsm: "80 GSM",
    batchLotNo: "LOT-45770",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Vikram Desai",
    testingAgency:
      "Bureau of Indian Standards (BIS) Paper & Board Lab, New Delhi",
    testReportNo: "TBC/PQT/2026/00121",
    sentDate: "2026-08-13",
    receivedDate: "2026-08-16",
    testingDate: "2026-08-16",
    overallResult: "FAIL",
    approvalStatus: "Rejected / Out of Spec",
    qualityScore: 70,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 76.0,
        deviation: "-4.0",
        status: "FAIL",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 92,
        deviation: "-3.0",
        status: "FAIL",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 4.5,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 87.0,
        deviation: "-1.0%",
        status: "FAIL",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 90.0,
        deviation: "+0.0%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.15,
        deviation: "-0.05",
        status: "FAIL",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 610,
        deviation: "+10",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 145,
        deviation: "-5",
        status: "FAIL",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 2.0,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 29,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00120",
    sampleId: "PAP-2026-00120",
    supplierVendor: "Shivam Paper Works",
    paperType: "Book Printing Paper",
    gsm: "75 GSM",
    batchLotNo: "LOT-45760",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Meena Yadav",
    testingAgency: "Hindustan Paper Corporation Ltd. Quality Lab, Vellore",
    testReportNo: "TBC/PQT/2026/00120",
    sentDate: "2026-08-12",
    receivedDate: "2026-08-15",
    testingDate: "2026-08-15",
    overallResult: "PASS",
    approvalStatus: "Approved for Use",
    qualityScore: 88,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.0,
        deviation: "0.0",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 97,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.0,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 88.5,
        deviation: "+0.5%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 91.0,
        deviation: "+1.0%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.35,
        deviation: "+0.15",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 615,
        deviation: "+15",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 160,
        deviation: "+10",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 1.9,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 27,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00119",
    sampleId: "PAP-2026-00119",
    supplierVendor: "Maa Paper Industries",
    paperType: "Book Printing Paper",
    gsm: "70 GSM",
    batchLotNo: "LOT-45755",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "D. K. Mishra",
    testingAgency:
      "Central Pulp & Paper Research Institute (CPPRI), Saharanpur",
    testReportNo: "TBC/PQT/2026/00119",
    testingDate: "2026-08-14",
    overallResult: "PASS",
    approvalStatus: "Approved for Use",
    qualityScore: 90,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.3,
        deviation: "+0.3",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 99,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.6,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 89.0,
        deviation: "+1.0%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 91.2,
        deviation: "+1.2%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.4,
        deviation: "+0.20",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 625,
        deviation: "+25",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 162,
        deviation: "+12",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 1.7,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 28,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00118",
    sampleId: "PAP-2026-00118",
    supplierVendor: "Bharat Paper Mills",
    paperType: "Cover Paper",
    gsm: "120 GSM",
    batchLotNo: "LOT-45745",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Neha Kulkarni",
    testingAgency: "Institute of Pulp & Paper Technology (IPPTA), Bengaluru",
    testReportNo: "TBC/PQT/2026/00118",
    testingDate: "2026-08-13",
    overallResult: "PASS",
    approvalStatus: "Approved for Use",
    qualityScore: 93,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.5,
        deviation: "+0.5",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 102,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.9,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 90.0,
        deviation: "+2.0%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 92.5,
        deviation: "+2.5%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.55,
        deviation: "+0.35",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 650,
        deviation: "+50",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 175,
        deviation: "+25",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 1.5,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 24,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
  {
    id: "PAP-2026-00117",
    sampleId: "PAP-2026-00117",
    supplierVendor: "Galaxy Paper Ltd.",
    paperType: "Book Printing Paper",
    gsm: "80 GSM",
    batchLotNo: "LOT-45735",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Amit Joshi",
    testingAgency: "West Pulp & Paper Research Institute (WPPRI), Kolkata",
    testReportNo: "TBC/PQT/2026/00117",
    testingDate: "2026-08-12",
    overallResult: "FAIL",
    approvalStatus: "Rejected / Out of Spec",
    qualityScore: 68,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 77.0,
        deviation: "-3.0",
        status: "FAIL",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 93,
        deviation: "-2.0",
        status: "FAIL",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 4.2,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 86.5,
        deviation: "-1.5%",
        status: "FAIL",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 88.5,
        deviation: "-1.5%",
        status: "FAIL",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.1,
        deviation: "-0.10",
        status: "FAIL",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 590,
        deviation: "-10",
        status: "FAIL",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 148,
        deviation: "-2",
        status: "FAIL",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 2.6,
        deviation: "+0.1",
        status: "FAIL",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 32,
        deviation: "Exceeds by 2.0",
        status: "FAIL",
      },
    ],
  },
  {
    id: "PAP-2026-00116",
    sampleId: "PAP-2026-00116",
    supplierVendor: "Shakti Paper Mills",
    paperType: "Book Printing Paper",
    gsm: "75 GSM",
    batchLotNo: "LOT-45725",
    reelSheetSize: "84 x 57.8 cm",
    testedBy: "Kavita Rao",
    testingAgency:
      "Bureau of Indian Standards (BIS) Paper & Board Lab, New Delhi",
    testReportNo: "TBC/PQT/2026/00116",
    testingDate: "2026-08-11",
    overallResult: "PASS",
    approvalStatus: "Approved for Use",
    qualityScore: 89,
    parameters: [
      {
        parameterId: 1,
        parameterName: "Grammage (GSM)",
        requiredSpecification: "80 ± 2",
        actualResult: 80.2,
        deviation: "+0.2",
        status: "PASS",
      },
      {
        parameterId: 2,
        parameterName: "Thickness / Caliper",
        requiredSpecification: "As per spec (95 - 105 µm)",
        actualResult: 98,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 3,
        parameterName: "Moisture Content",
        requiredSpecification: "4.0 - 7.0 %",
        actualResult: 5.7,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 4,
        parameterName: "Brightness",
        requiredSpecification: "≥ 88 %",
        actualResult: 89.1,
        deviation: "+1.1%",
        status: "PASS",
      },
      {
        parameterId: 5,
        parameterName: "Opacity",
        requiredSpecification: "≥ 90 %",
        actualResult: 91.0,
        deviation: "+1.0%",
        status: "PASS",
      },
      {
        parameterId: 6,
        parameterName: "Tensile Strength (MD)",
        requiredSpecification: "≥ 3.20 kN/m",
        actualResult: 3.38,
        deviation: "+0.18",
        status: "PASS",
      },
      {
        parameterId: 7,
        parameterName: "Tear Strength (MD)",
        requiredSpecification: "≥ 600 mN",
        actualResult: 618,
        deviation: "+18",
        status: "PASS",
      },
      {
        parameterId: 8,
        parameterName: "Bursting Strength",
        requiredSpecification: "≥ 150 kPa",
        actualResult: 160,
        deviation: "+10",
        status: "PASS",
      },
      {
        parameterId: 9,
        parameterName: "Surface Roughness (Smoothness)",
        requiredSpecification: "1.0 - 2.5 µm",
        actualResult: 1.8,
        deviation: "Within Range",
        status: "PASS",
      },
      {
        parameterId: 10,
        parameterName: "Cobb Test (Water Absorption)",
        requiredSpecification: "≤ 30 g/m²",
        actualResult: 28,
        deviation: "Within Limit",
        status: "PASS",
      },
    ],
  },
];
