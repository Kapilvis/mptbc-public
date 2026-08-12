import { mockDivisions } from "./data";

const divisions = [...mockDivisions];

export async function getDivisionById(
  divisionId: number,
): Promise<Master.DivisionForm> {
  const item = divisions.find((d) => d.divisionId === Number(divisionId));
  if (!item) throw new Error("Division not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    lgdCode: item.lgdCode,
  };
}

export async function getDivisions(): Promise<Master.DivisionItem[]> {
  return [...divisions];
}

export async function createDivision(data: Master.DivisionForm) {
  const newItem: Master.DivisionItem = {
    divisionId: Date.now(),
    ...data,
    isActive: true,
  };
  divisions.push(newItem);
  return newItem;
}

export async function updateDivision(
  divisionId: number,
  data: Master.DivisionForm,
): Promise<Master.DivisionForm | undefined> {
  const index = divisions.findIndex((d) => d.divisionId === Number(divisionId));
  if (index !== -1) {
    divisions[index] = { ...divisions[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchDivisionStatus(
  divisionId: number,
): Promise<boolean> {
  const index = divisions.findIndex((d) => d.divisionId === Number(divisionId));
  if (index !== -1) {
    divisions[index].isActive = !divisions[index].isActive;
    return true;
  }
  return false;
}
