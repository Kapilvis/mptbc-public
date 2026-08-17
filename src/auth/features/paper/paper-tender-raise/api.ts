import { mockPaperTenderData } from "./data";

let memoryPaperTender = { ...mockPaperTenderData };

export const getPaperTenderDetails = async (): Promise<PaperTender.Item> => {
  await new Promise((res) => setTimeout(res, 100));
  return { ...memoryPaperTender };
};

export const savePaperTenderDraft = async (
  payload: Partial<PaperTender.Item>,
): Promise<PaperTender.Item> => {
  await new Promise((res) => setTimeout(res, 150));
  memoryPaperTender = {
    ...memoryPaperTender,
    ...payload,
    status: "Draft",
  };
  return { ...memoryPaperTender };
};

export const publishPaperTender = async (
  payload: Partial<PaperTender.Item>,
): Promise<PaperTender.Item> => {
  await new Promise((res) => setTimeout(res, 200));
  memoryPaperTender = {
    ...memoryPaperTender,
    ...payload,
    status: "Published",
    publishedDate: new Date().toISOString().split("T")[0],
    createdBy: "MPTBC Paper Procurement Officer",
  };
  return { ...memoryPaperTender };
};
