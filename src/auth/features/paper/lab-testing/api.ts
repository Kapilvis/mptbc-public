import {
  initialLabTestingRecords,
  type PaperLabTestingRecord,
  generateSampleId,
} from "./data";

const records: PaperLabTestingRecord[] = [...initialLabTestingRecords];

export async function getPaperLabTestingList(): Promise<
  PaperLabTestingRecord[]
> {
  return JSON.parse(JSON.stringify(records));
}

export async function getPaperLabTestingById(
  id: string,
): Promise<PaperLabTestingRecord> {
  const item = records.find((r) => r.id === id || r.sampleId === id);
  if (!item) {
    throw new Error("Paper quality lab test record not found");
  }
  return JSON.parse(JSON.stringify(item));
}

export async function createPaperLabTesting(
  data: Partial<PaperLabTestingRecord>,
): Promise<PaperLabTestingRecord> {
  const generatedId = data.sampleId || generateSampleId(records.length);

  const overallResult = (data.parameters || []).every(
    (p) => p.status === "PASS",
  )
    ? "PASS"
    : "FAIL";

  const newRecord: PaperLabTestingRecord = {
    id: generatedId,
    sampleId: generatedId,
    supplierVendor: data.supplierVendor || "ABC Paper Mills",
    paperType: data.paperType || "Book Printing Paper",
    gsm: data.gsm || "80 GSM",
    batchLotNo: data.batchLotNo || "LOT-00000",
    reelSheetSize: data.reelSheetSize || "84 x 57.8 cm",
    testedBy: data.testedBy || "Lab Tester",
    testingAgency:
      data.testingAgency ||
      "Central Pulp & Paper Research Institute (CPPRI), Saharanpur",
    testReportNo:
      data.testReportNo ||
      `TBC/PQT/${new Date().getFullYear()}/${generatedId.split("-").pop()}`,
    sentDate:
      data.sentDate ||
      data.testingDate ||
      new Date().toISOString().split("T")[0],
    receivedDate: data.receivedDate,
    testingDate: data.testingDate || new Date().toISOString().split("T")[0],
    overallResult: data.overallResult || overallResult,
    approvalStatus:
      overallResult === "PASS" ? "Approved for Use" : "Rejected / Out of Spec",
    qualityScore: overallResult === "PASS" ? 90 : 65,
    parameters: data.parameters || [],
  };

  records.unshift(newRecord);
  return JSON.parse(JSON.stringify(newRecord));
}

export async function updatePaperLabTesting(
  id: string,
  data: Partial<PaperLabTestingRecord>,
): Promise<PaperLabTestingRecord> {
  const index = records.findIndex((r) => r.id === id || r.sampleId === id);
  if (index === -1) {
    throw new Error("Record not found to update");
  }

  const overallResult = (data.parameters || records[index].parameters).every(
    (p) => p.status === "PASS",
  )
    ? "PASS"
    : "FAIL";

  const updatedRecord: PaperLabTestingRecord = {
    ...records[index],
    ...data,
    id: records[index].id,
    sampleId: records[index].sampleId,
    overallResult,
    approvalStatus:
      overallResult === "PASS" ? "Approved for Use" : "Rejected / Out of Spec",
  };

  records[index] = updatedRecord;
  return JSON.parse(JSON.stringify(updatedRecord));
}

export async function deletePaperLabTesting(id: string): Promise<boolean> {
  const index = records.findIndex((r) => r.id === id || r.sampleId === id);
  if (index !== -1) {
    records.splice(index, 1);
    return true;
  }
  return false;
}
