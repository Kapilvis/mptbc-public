import { mockOfficeTypes } from "./data";

const officeTypes = [...mockOfficeTypes];

export async function getOfficeTypeById(
  officeTypeId: number,
): Promise<Master.OfficeTypeForm> {
  const item = officeTypes.find((o) => o.officeTypeId === Number(officeTypeId));
  if (!item) throw new Error("Office Type not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    officeLevelId: item.officeLevel.officeLevelId,
  };
}

export async function getOfficeTypes(): Promise<Master.OfficeTypeList[]> {
  return [...officeTypes];
}

export async function getOfficeTypesByOfficeLevel(
  officeLevelId: number,
): Promise<Master.OfficeTypeList[]> {
  return officeTypes.filter(
    (o) => !officeLevelId || o.officeLevelName.length > 0,
  );
}

export async function createOfficeType(data: Master.OfficeTypeForm) {
  const newItem: Master.OfficeTypeList = {
    officeTypeId: Date.now(),
    ...data,
    officeLevelName: "State Level HQ",
    officeLevel: {
      officeLevelId: data.officeLevelId,
      name: "State Level HQ",
      code: "OL-HQ",
      isActive: true,
    },
    isActive: true,
  };
  officeTypes.push(newItem);
  return newItem;
}

export async function updateOfficeType(
  officeTypeId: number,
  data: Master.OfficeTypeForm,
): Promise<Master.OfficeTypeForm | undefined> {
  const index = officeTypes.findIndex(
    (o) => o.officeTypeId === Number(officeTypeId),
  );
  if (index !== -1) {
    officeTypes[index] = { ...officeTypes[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchOfficeTypeStatus(
  officeTypeId: number,
): Promise<boolean> {
  const index = officeTypes.findIndex(
    (o) => o.officeTypeId === Number(officeTypeId),
  );
  if (index !== -1) {
    officeTypes[index].isActive = !officeTypes[index].isActive;
    return true;
  }
  return false;
}
