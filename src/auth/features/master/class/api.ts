import { mockClasses } from "./data";

const classes = [...mockClasses];

export async function getClassById(classId: number): Promise<Master.ClassForm> {
  const item = classes.find((c) => c.classId === Number(classId));
  if (!item) throw new Error("Class not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getClasses(): Promise<Master.ClassItem[]> {
  return [...classes];
}

export async function createClass(data: Master.ClassForm) {
  const newItem: Master.ClassItem = {
    classId: Date.now(),
    ...data,
    isActive: true,
  };
  classes.push(newItem);
  return newItem;
}

export async function updateClass(
  classId: number,
  data: Master.ClassForm,
): Promise<boolean> {
  const index = classes.findIndex((c) => c.classId === Number(classId));
  if (index !== -1) {
    classes[index] = { ...classes[index], ...data };
    return true;
  }
  return false;
}

export async function patchClassStatus(classId: number): Promise<boolean> {
  const index = classes.findIndex((c) => c.classId === Number(classId));
  if (index !== -1) {
    classes[index].isActive = !classes[index].isActive;
    return true;
  }
  return false;
}
