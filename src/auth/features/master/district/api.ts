import { mockDistricts } from "./data";

const districts = [...mockDistricts];

export async function getDistrictById(
  districtId: number,
): Promise<Master.DistrictForm> {
  const item = districts.find((d) => d.districtId === Number(districtId));
  if (!item) throw new Error("District not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    lgdCode: item.lgdCode,
    divisionId: 1,
  };
}

export async function getDistricts(): Promise<Master.DistrictItem[]> {
  return [...districts];
}

export async function getDistrictsByDivisionId(
  divisionId: number,
): Promise<Master.DistrictItem[]> {
  return districts.filter((d) => !divisionId || d.divisionName?.length);
}

export async function createDistrict(data: Master.DistrictForm) {
  const newItem: Master.DistrictItem = {
    districtId: Date.now(),
    ...data,
    divisionName: "Bhopal Division",
    isActive: true,
  };
  districts.push(newItem);
  return newItem;
}

export async function updateDistrict(
  districtId: number,
  data: Master.DistrictForm,
): Promise<Master.DistrictForm | undefined> {
  const index = districts.findIndex((d) => d.districtId === Number(districtId));
  if (index !== -1) {
    districts[index] = { ...districts[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchDistrictStatus(
  districtId: number,
): Promise<boolean> {
  const index = districts.findIndex((d) => d.districtId === Number(districtId));
  if (index !== -1) {
    districts[index].isActive = !districts[index].isActive;
    return true;
  }
  return false;
}
