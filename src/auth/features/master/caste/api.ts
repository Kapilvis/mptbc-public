import { mockCastes } from "./data";

const castes = [...mockCastes];

export async function getCasteById(casteId: number): Promise<Master.CasteForm> {
  const item = castes.find((c) => c.casteId === Number(casteId));
  if (!item) throw new Error("Caste not found");
  return {
    name: item.name,
    localName: item.localName,
  };
}

export async function getCastes(): Promise<Master.CasteList[]> {
  return [...castes];
}

export async function createCaste(data: Master.CasteForm) {
  const newItem: Master.CasteList = {
    casteId: Date.now(),
    ...data,
    isActive: true,
  };
  castes.push(newItem);
  return newItem;
}

export async function updateCaste(
  casteId: number,
  data: Master.CasteForm,
): Promise<boolean> {
  const index = castes.findIndex((c) => c.casteId === Number(casteId));
  if (index !== -1) {
    castes[index] = { ...castes[index], ...data };
    return true;
  }
  return false;
}

export async function patchCasteStatus(casteId: number): Promise<boolean> {
  const index = castes.findIndex((c) => c.casteId === Number(casteId));
  if (index !== -1) {
    castes[index].isActive = !castes[index].isActive;
    return true;
  }
  return false;
}
