import { mockQualificationSubjects } from "./data";

const qualificationSubjects = [...mockQualificationSubjects];

export async function getQualificationSubjectById(
  qualificationSubjectId: number,
): Promise<Master.QualificationSubjectForm> {
  const item = qualificationSubjects.find(
    (q) => q.qualificationSubjectId === Number(qualificationSubjectId),
  );
  if (!item) throw new Error("Qualification Subject not found");
  return {
    name: item.name,
    localName: item.localName,
    qualificationId: item.qualificationId,
  };
}

export async function getQualificationSubjects(): Promise<
  Master.QualificationSubjectList[]
> {
  return [...qualificationSubjects];
}

export async function getQualificationSubjectsByQualification(
  qualificationId: number,
): Promise<Master.QualificationSubjectList[]> {
  return qualificationSubjects.filter(
    (q) => !qualificationId || q.qualificationName.length > 0,
  );
}

export async function createQualificationSubject(
  data: Master.QualificationSubjectForm,
) {
  const newItem: Master.QualificationSubjectList = {
    qualificationSubjectId: Date.now(),
    ...data,
    qualificationName: "Bachelor of Technology (B.Tech)",
    isActive: true,
  };
  qualificationSubjects.push(newItem);
  return newItem;
}

export async function updateQualificationSubject(
  qualificationSubjectId: number,
  data: Master.QualificationSubjectForm,
): Promise<Master.QualificationSubjectForm | undefined> {
  const index = qualificationSubjects.findIndex(
    (q) => q.qualificationSubjectId === Number(qualificationSubjectId),
  );
  if (index !== -1) {
    qualificationSubjects[index] = { ...qualificationSubjects[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchQualificationSubjectStatus(
  qualificationSubjectId: number,
): Promise<boolean> {
  const index = qualificationSubjects.findIndex(
    (q) => q.qualificationSubjectId === Number(qualificationSubjectId),
  );
  if (index !== -1) {
    qualificationSubjects[index].isActive =
      !qualificationSubjects[index].isActive;
    return true;
  }
  return false;
}
