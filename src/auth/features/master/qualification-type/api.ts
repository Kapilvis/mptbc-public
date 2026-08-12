import { mockQualificationTypes } from "./data";

const qualificationTypes = [...mockQualificationTypes];

export async function getQualificationTypeById(
  qualificationTypeId: number,
): Promise<Master.QualificationTypeForm> {
  const item = qualificationTypes.find(
    (q) => q.qualificationTypeId === Number(qualificationTypeId),
  );
  if (!item) throw new Error("Qualification Type not found");
  return {
    name: item.name,
    localName: item.localName,
  };
}

export async function getQualificationTypes(): Promise<
  Master.QualificationTypeList[]
> {
  return [...qualificationTypes];
}

export async function createQualificationType(
  data: Master.QualificationTypeForm,
) {
  const newItem: Master.QualificationTypeList = {
    qualificationTypeId: Date.now(),
    ...data,
    isActive: true,
  };
  qualificationTypes.push(newItem);
  return newItem;
}

export async function updateQualificationType(
  qualificationTypeId: number,
  data: Master.QualificationTypeForm,
): Promise<Master.QualificationTypeForm | undefined> {
  const index = qualificationTypes.findIndex(
    (q) => q.qualificationTypeId === Number(qualificationTypeId),
  );
  if (index !== -1) {
    qualificationTypes[index] = { ...qualificationTypes[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchQualificationTypeStatus(
  qualificationTypeId: number,
): Promise<boolean> {
  const index = qualificationTypes.findIndex(
    (q) => q.qualificationTypeId === Number(qualificationTypeId),
  );
  if (index !== -1) {
    qualificationTypes[index].isActive = !qualificationTypes[index].isActive;
    return true;
  }
  return false;
}
