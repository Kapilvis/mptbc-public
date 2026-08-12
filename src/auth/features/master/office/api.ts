import { mockOffices } from "./data";

const offices = [...mockOffices];

export async function getOfficeById(
  officeId: number,
): Promise<Master.OfficeForm> {
  const item = offices.find((o) => o.officeId === Number(officeId));
  if (!item) throw new Error("Office not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    officeLevelId: item.officeLevelId,
    officeTypeId: 1,
  };
}

export async function getOffices(): Promise<Master.OfficeItem[]> {
  return [...offices];
}

export async function createOffice(data: Master.OfficeForm) {
  const newItem: Master.OfficeItem = {
    officeId: Date.now(),
    ...data,
    officeLevelName: "State Level HQ",
    officeTypeName: "Headquarters",
    isActive: true,
  };
  offices.push(newItem);
  return newItem;
}

export async function updateOffice(
  officeId: number,
  data: Master.OfficeForm,
): Promise<Master.OfficeForm | undefined> {
  const index = offices.findIndex((o) => o.officeId === Number(officeId));
  if (index !== -1) {
    offices[index] = { ...offices[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchOfficeStatus(officeId: number): Promise<boolean> {
  const index = offices.findIndex((o) => o.officeId === Number(officeId));
  if (index !== -1) {
    offices[index].isActive = !offices[index].isActive;
    return true;
  }
  return false;
}
