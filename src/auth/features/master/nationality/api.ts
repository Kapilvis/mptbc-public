import { mockNationalities } from "./data";

const nationalities = [...mockNationalities];

export async function getNationalityById(
  nationalityId: number,
): Promise<Master.NationalityForm> {
  const item = nationalities.find(
    (n) => n.nationalityId === Number(nationalityId),
  );
  if (!item) throw new Error("Nationality not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getNationalities(): Promise<Master.NationalityItem[]> {
  return [...nationalities];
}

export async function createNationality(data: Master.NationalityForm) {
  const newItem: Master.NationalityItem = {
    nationalityId: Date.now(),
    ...data,
    isActive: true,
  };
  nationalities.push(newItem);
  return newItem;
}

export async function updateNationality(
  nationalityId: number,
  data: Master.NationalityForm,
): Promise<boolean> {
  const index = nationalities.findIndex(
    (n) => n.nationalityId === Number(nationalityId),
  );
  if (index !== -1) {
    nationalities[index] = { ...nationalities[index], ...data };
    return true;
  }
  return false;
}

export async function patchNationalityStatus(
  nationalityId: number,
): Promise<boolean> {
  const index = nationalities.findIndex(
    (n) => n.nationalityId === Number(nationalityId),
  );
  if (index !== -1) {
    nationalities[index].isActive = !nationalities[index].isActive;
    return true;
  }
  return false;
}
