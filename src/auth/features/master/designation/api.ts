import { mockDesignations } from "./data";

const designations = [...mockDesignations];

export async function getDesignationById(
  designationId: number,
): Promise<Master.DesignationForm> {
  const item = designations.find(
    (d) => d.designationId === Number(designationId),
  );
  if (!item) throw new Error("Designation not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getDesignations(): Promise<Master.DesignationList[]> {
  return [...designations];
}

export async function createDesignation(data: Master.DesignationForm) {
  const newItem: Master.DesignationList = {
    designationId: Date.now(),
    ...data,
    isActive: true,
  };
  designations.push(newItem);
  return newItem;
}

export async function updateDesignation(
  designationId: number,
  data: Master.DesignationForm,
): Promise<Master.DesignationForm | undefined> {
  const index = designations.findIndex(
    (d) => d.designationId === Number(designationId),
  );
  if (index !== -1) {
    designations[index] = { ...designations[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchDesignationStatus(
  designationId: number,
): Promise<boolean> {
  const index = designations.findIndex(
    (d) => d.designationId === Number(designationId),
  );
  if (index !== -1) {
    designations[index].isActive = !designations[index].isActive;
    return true;
  }
  return false;
}
