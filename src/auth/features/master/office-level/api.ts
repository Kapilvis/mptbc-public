import { mockOfficeLevels } from "./data";

const officeLevels = [...mockOfficeLevels];

export async function getOfficeLevelById(
  officeLevelId: number,
): Promise<Master.OfficeLevelForm> {
  const item = officeLevels.find(
    (o) => o.officeLevelId === Number(officeLevelId),
  );
  if (!item) throw new Error("Office Level not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getOfficeLevels(): Promise<Master.OfficeLevelList[]> {
  return [...officeLevels];
}

export async function createOfficeLevel(data: Master.OfficeLevelForm) {
  const newItem: Master.OfficeLevelList = {
    officeLevelId: Date.now(),
    ...data,
    isActive: true,
  };
  officeLevels.push(newItem);
  return newItem;
}

export async function updateOfficeLevel(
  officeLevelId: number,
  data: Master.OfficeLevelForm,
): Promise<Master.OfficeLevelForm | undefined> {
  const index = officeLevels.findIndex(
    (o) => o.officeLevelId === Number(officeLevelId),
  );
  if (index !== -1) {
    officeLevels[index] = { ...officeLevels[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchOfficeLevelStatus(
  officeLevelId: number,
): Promise<boolean> {
  const index = officeLevels.findIndex(
    (o) => o.officeLevelId === Number(officeLevelId),
  );
  if (index !== -1) {
    officeLevels[index].isActive = !officeLevels[index].isActive;
    return true;
  }
  return false;
}
