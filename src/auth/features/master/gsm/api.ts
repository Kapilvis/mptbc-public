import { mockGsms } from "./data";

const gsms = [...mockGsms];

const mapGsmItem = (item: Master.GsmItem): Master.GsmItem => ({
  ...item,
  name: `${item.gsm} GSM (Reel: ${item.reelWidth}, Cutoff: ${item.cutoff})`,
});

export async function getGsmById(gsmId: number): Promise<Master.GsmForm> {
  const item = gsms.find((g) => g.gsmId === Number(gsmId));
  if (!item) throw new Error("GSM specification not found");
  return {
    gsm: item.gsm,
    reelWidth: item.reelWidth,
    cutoff: item.cutoff,
    sheetSize: item.sheetSize,
    area: item.area,
    sheetWeightInGM: item.sheetWeightInGM,
    reamWeightInMT: item.reamWeightInMT,
  };
}

export async function getGsms(): Promise<Master.GsmItem[]> {
  return gsms.map(mapGsmItem);
}

export async function createGsm(data: Master.GsmForm) {
  const newItem = {
    gsmId: Date.now(),
    ...data,
    isActive: true,
  };
  gsms.push(newItem);
  return mapGsmItem(newItem);
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
