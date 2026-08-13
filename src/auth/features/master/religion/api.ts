import { mockReligions } from "./data";

const religions = [...mockReligions];

export async function getReligionById(
  religionId: number,
): Promise<Master.ReligionForm> {
  const item = religions.find((r) => r.religionId === Number(religionId));
  if (!item) throw new Error("Religion not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getReligions(): Promise<Master.ReligionItem[]> {
  return [...religions];
}

export async function createReligion(data: Master.ReligionForm) {
  const newItem: Master.ReligionItem = {
    religionId: Date.now(),
    ...data,
    isActive: true,
  };
  religions.push(newItem);
  return newItem;
}

export async function updateReligion(
  religionId: number,
  data: Master.ReligionForm,
): Promise<boolean> {
  const index = religions.findIndex((r) => r.religionId === Number(religionId));
  if (index !== -1) {
    religions[index] = { ...religions[index], ...data };
    return true;
  }
  return false;
}

export async function patchReligionStatus(
  religionId: number,
): Promise<boolean> {
  const index = religions.findIndex((r) => r.religionId === Number(religionId));
  if (index !== -1) {
    religions[index].isActive = !religions[index].isActive;
    return true;
  }
  return false;
}
