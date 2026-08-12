import { mockSectors } from "./data";

const sectors = [...mockSectors];

export async function getSectorById(
  sectorId: number,
): Promise<Master.SectorForm> {
  const item = sectors.find((s) => s.sectorId === Number(sectorId));
  if (!item) throw new Error("Sector not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    lgdCode: item.lgdCode,
    divisionId: 1,
    districtId: 1,
    projectId: 1,
  };
}

export async function getSectors(): Promise<Master.SectorItem[]> {
  return [...sectors];
}

export async function getSectorsByProjectId(
  projectId: number,
): Promise<Master.SectorItem[]> {
  return sectors.filter((s) => !projectId || s.projectName?.length);
}

export async function createSector(data: Master.SectorForm) {
  const newItem: Master.SectorItem = {
    sectorId: Date.now(),
    ...data,
    divisionName: "Bhopal Division",
    districtName: "Bhopal",
    projectName: "Urban Project 1",
    isActive: true,
  };
  sectors.push(newItem);
  return newItem;
}

export async function updateSector(
  sectorId: number,
  data: Master.SectorForm,
): Promise<Master.SectorForm | undefined> {
  const index = sectors.findIndex((s) => s.sectorId === Number(sectorId));
  if (index !== -1) {
    sectors[index] = { ...sectors[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchSectorStatus(sectorId: number): Promise<boolean> {
  const index = sectors.findIndex((s) => s.sectorId === Number(sectorId));
  if (index !== -1) {
    sectors[index].isActive = !sectors[index].isActive;
    return true;
  }
  return false;
}
