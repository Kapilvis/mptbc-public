import { mockQualifications } from "./data";

const qualifications = [...mockQualifications];

export async function getQualificationById(
  qualificationId: number,
): Promise<Master.QualificationForm> {
  const item = qualifications.find(
    (q) => q.qualificationId === Number(qualificationId),
  );
  if (!item) throw new Error("Qualification not found");
  return {
    name: item.name,
    localName: item.localName,
    qualificationTypeId: item.qualificationTypeId,
  };
}

export async function getQualifications(): Promise<Master.QualificationList[]> {
  return [...qualifications];
}

export async function getQualificationsByQualificationType(
  qualificationTypeId: number,
): Promise<Master.QualificationList[]> {
  return qualifications.filter(
    (q) => !qualificationTypeId || q.qualificationTypeName.length > 0,
  );
}

export async function createQualification(data: Master.QualificationForm) {
  const newItem: Master.QualificationList = {
    qualificationId: Date.now(),
    ...data,
    qualificationTypeName: "Undergraduate Degree",
    isActive: true,
  };
  qualifications.push(newItem);
  return newItem;
}

export async function updateQualification(
  qualificationId: number,
  data: Master.QualificationForm,
): Promise<Master.QualificationForm | undefined> {
  const index = qualifications.findIndex(
    (q) => q.qualificationId === Number(qualificationId),
  );
  if (index !== -1) {
    qualifications[index] = { ...qualifications[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchQualificationStatus(
  qualificationId: number,
): Promise<boolean> {
  const index = qualifications.findIndex(
    (q) => q.qualificationId === Number(qualificationId),
  );
  if (index !== -1) {
    qualifications[index].isActive = !qualifications[index].isActive;
    return true;
  }
  return false;
}
