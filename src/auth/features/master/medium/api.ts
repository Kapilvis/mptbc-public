import { mockMediums } from "./data";

const mediums = [...mockMediums];

export async function getMediumById(
  mediumId: number,
): Promise<Master.MediumForm> {
  const item = mediums.find((m) => m.mediumId === Number(mediumId));
  if (!item) throw new Error("Medium not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getMediums(): Promise<Master.MediumItem[]> {
  return [...mediums];
}

export async function createMedium(data: Master.MediumForm) {
  const newItem: Master.MediumItem = {
    mediumId: Date.now(),
    ...data,
    isActive: true,
  };
  mediums.push(newItem);
  return newItem;
}

export async function updateMedium(
  mediumId: number,
  data: Master.MediumForm,
): Promise<boolean> {
  const index = mediums.findIndex((m) => m.mediumId === Number(mediumId));
  if (index !== -1) {
    mediums[index] = { ...mediums[index], ...data };
    return true;
  }
  return false;
}

export async function patchMediumStatus(mediumId: number): Promise<boolean> {
  const index = mediums.findIndex((m) => m.mediumId === Number(mediumId));
  if (index !== -1) {
    mediums[index].isActive = !mediums[index].isActive;
    return true;
  }
  return false;
}
