import { mockProjects } from "./data";

const projects = [...mockProjects];

export async function getProjectById(
  projectId: number,
): Promise<Master.ProjectForm> {
  const item = projects.find((p) => p.projectId === Number(projectId));
  if (!item) throw new Error("Project not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    lgdCode: item.lgdCode,
    divisionId: 1,
    districtId: 1,
  };
}

export async function getProjects(): Promise<Master.ProjectItem[]> {
  return [...projects];
}

export async function getProjectsByDistrictId(
  districtId: number,
): Promise<Master.ProjectItem[]> {
  return projects.filter((p) => !districtId || p.districtName?.length);
}

export async function createProject(data: Master.ProjectForm) {
  const newItem: Master.ProjectItem = {
    projectId: Date.now(),
    ...data,
    divisionName: "Bhopal Division",
    districtName: "Bhopal",
    isActive: true,
  };
  projects.push(newItem);
  return newItem;
}

export async function updateProject(
  projectId: number,
  data: Master.ProjectForm,
): Promise<Master.ProjectForm | undefined> {
  const index = projects.findIndex((p) => p.projectId === Number(projectId));
  if (index !== -1) {
    projects[index] = { ...projects[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchProjectStatus(projectId: number): Promise<boolean> {
  const index = projects.findIndex((p) => p.projectId === Number(projectId));
  if (index !== -1) {
    projects[index].isActive = !projects[index].isActive;
    return true;
  }
  return false;
}
