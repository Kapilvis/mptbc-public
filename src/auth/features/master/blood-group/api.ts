import { mockBloodGroups } from "./data";

const bloodGroups = [...mockBloodGroups];

export async function getBloodGroupById(
  bloodGroupId: number,
): Promise<Master.BloodGroupItem> {
  const item = bloodGroups.find((b) => b.bloodGroupId === Number(bloodGroupId));
  if (!item) throw new Error("Blood Group not found");
  return item;
}

export async function getBloodGroups(): Promise<Master.BloodGroupItem[]> {
  return [...bloodGroups];
}

export async function patchBloodGroupStatus(
  bloodGroupId: number,
): Promise<boolean> {
  const index = bloodGroups.findIndex(
    (b) => b.bloodGroupId === Number(bloodGroupId),
  );
  if (index !== -1) {
    bloodGroups[index].isActive = !bloodGroups[index].isActive;
    return true;
  }
  return false;
}
