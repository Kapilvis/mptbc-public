import { mockDesignationTypes } from "./data";

const designationTypes = [...mockDesignationTypes];

export async function getDesignationTypeById(
  designationTypeId: number,
): Promise<Master.DesignationTypeForm> {
  const item = designationTypes.find(
    (d) => d.designationTypeId === Number(designationTypeId),
  );
  if (!item) throw new Error("Designation Type not found");
  return {
    name: item.name,
    localName: item.localName,
  };
}

export async function getDesignationTypes(): Promise<
  Master.DesignationTypeList[]
> {
  return [...designationTypes];
}

export async function createDesignationType(data: Master.DesignationTypeForm) {
  const newItem: Master.DesignationTypeList = {
    designationTypeId: Date.now(),
    ...data,
    isActive: true,
  };
  designationTypes.push(newItem);
  return newItem;
}

export async function updateDesignationType(
  designationTypeId: number,
  data: Master.DesignationTypeForm,
): Promise<Master.DesignationTypeForm | undefined> {
  const index = designationTypes.findIndex(
    (d) => d.designationTypeId === Number(designationTypeId),
  );
  if (index !== -1) {
    designationTypes[index] = { ...designationTypes[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchDesignationTypeStatus(
  designationTypeId: number,
): Promise<boolean> {
  const index = designationTypes.findIndex(
    (d) => d.designationTypeId === Number(designationTypeId),
  );
  if (index !== -1) {
    designationTypes[index].isActive = !designationTypes[index].isActive;
    return true;
  }
  return false;
}
