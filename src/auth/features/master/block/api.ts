import { mockDistricts } from "../district/data";
import { mockDivisions } from "../division/data";
import { initialBlockList } from "./data";

const memoryBlocks: Master.BlockItem[] = [...initialBlockList];

function enrichBlockItem(item: Master.BlockItem): Master.BlockItem {
  const dist = mockDistricts.find(
    (d) => d.districtId === Number(item.districtId),
  );
  const div = mockDivisions.find(
    (d) => d.divisionId === Number(item.divisionId),
  );

  return {
    ...item,
    divisionName:
      div?.name ||
      item.divisionName ||
      (dist?.divisionName ? dist.divisionName : "—"),
    districtName: dist?.name || item.districtName || "—",
  };
}

export async function getBlocks(): Promise<Master.BlockItem[]> {
  return Promise.resolve(memoryBlocks.map(enrichBlockItem));
}

export async function getActiveBlocks(): Promise<Master.BlockItem[]> {
  return Promise.resolve(
    memoryBlocks.filter((b) => b.isActive).map(enrichBlockItem),
  );
}

export async function getActiveBlocksByDistrict(
  districtId: number,
): Promise<Master.BlockItem[]> {
  if (!districtId) return Promise.resolve([]);
  return Promise.resolve(
    memoryBlocks
      .filter((b) => b.isActive && b.districtId === Number(districtId))
      .map(enrichBlockItem),
  );
}

export async function getBlockById(
  id: number,
): Promise<Master.BlockItem | undefined> {
  const item = memoryBlocks.find((b) => b.blockId === Number(id));
  return Promise.resolve(item ? enrichBlockItem(item) : undefined);
}

export async function createBlock(
  form: Master.BlockForm,
): Promise<Master.BlockItem> {
  const dist = mockDistricts.find(
    (d) => d.districtId === Number(form.districtId),
  );
  const div = mockDivisions.find(
    (d) => d.divisionId === Number(form.divisionId),
  );

  const newBlock: Master.BlockItem = {
    blockId: memoryBlocks.length
      ? Math.max(...memoryBlocks.map((b) => b.blockId)) + 1
      : 1,
    name: form.name,
    localName: form.localName,
    code: form.code,
    districtId: Number(form.districtId),
    divisionId: form.divisionId ? Number(form.divisionId) : undefined,
    districtName: dist?.name || "—",
    divisionName: div?.name || (dist?.divisionName ? dist.divisionName : "—"),
    isActive: true,
  };
  memoryBlocks.push(newBlock);
  return Promise.resolve(enrichBlockItem(newBlock));
}

export async function updateBlock(
  id: number,
  form: Master.BlockForm,
): Promise<Master.BlockItem | undefined> {
  const index = memoryBlocks.findIndex((b) => b.blockId === Number(id));
  if (index === -1) return Promise.resolve(undefined);

  const dist = mockDistricts.find(
    (d) => d.districtId === Number(form.districtId),
  );
  const div = mockDivisions.find(
    (d) => d.divisionId === Number(form.divisionId),
  );

  memoryBlocks[index] = {
    ...memoryBlocks[index],
    name: form.name,
    localName: form.localName,
    code: form.code,
    districtId: Number(form.districtId),
    divisionId: form.divisionId ? Number(form.divisionId) : undefined,
    districtName: dist?.name || memoryBlocks[index].districtName || "—",
    divisionName:
      div?.name ||
      (dist?.divisionName
        ? dist.divisionName
        : memoryBlocks[index].divisionName || "—"),
  };
  return Promise.resolve(enrichBlockItem(memoryBlocks[index]));
}

export async function patchBlockStatus(
  id: number,
  isActive: boolean,
): Promise<Master.BlockItem | undefined> {
  const index = memoryBlocks.findIndex((b) => b.blockId === Number(id));
  if (index === -1) return Promise.resolve(undefined);

  memoryBlocks[index] = {
    ...memoryBlocks[index],
    isActive,
  };
  return Promise.resolve(enrichBlockItem(memoryBlocks[index]));
}
