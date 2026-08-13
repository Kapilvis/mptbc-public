import { mockGsms } from "./data";

const gsms = [...mockGsms];

export async function getGsmById(gsmId: number): Promise<Master.GsmForm> {
  const item = gsms.find((g) => g.gsmId === Number(gsmId));
  if (!item) throw new Error("GSM specification not found");
  return {
    name: item.name,
    localName: item.localName,
    gsmValue: item.gsmValue,
    usage: item.usage,
    code: item.code,
  };
}

export async function getGsms(): Promise<Master.GsmItem[]> {
  return [...gsms];
}

export async function createGsm(data: Master.GsmForm) {
  const newItem: Master.GsmItem = {
    gsmId: Date.now(),
    ...data,
    isActive: true,
  };
  gsms.push(newItem);
  return newItem;
}

export async function updateGsm(
  gsmId: number,
  data: Master.GsmForm,
): Promise<boolean> {
  const index = gsms.findIndex((g) => g.gsmId === Number(gsmId));
  if (index !== -1) {
    gsms[index] = { ...gsms[index], ...data };
    return true;
  }
  return false;
}

export async function patchGsmStatus(gsmId: number): Promise<boolean> {
  const index = gsms.findIndex((g) => g.gsmId === Number(gsmId));
  if (index !== -1) {
    gsms[index].isActive = !gsms[index].isActive;
    return true;
  }
  return false;
}
