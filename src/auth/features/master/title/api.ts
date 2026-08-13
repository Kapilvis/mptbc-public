import { mockBookTypes } from "../book-type/data";
import { mockClasses } from "../class/data";
import { mockGsms } from "../gsm/data";
import { mockMediums } from "../medium/data";
import { mockTitles } from "./data";

const titles = [...mockTitles];

function enrichTitleItem(item: Master.TitleItem): Master.TitleItem {
  const cls = mockClasses.find((c) => c.classId === item.classId);
  const bt = mockBookTypes.find((b) => b.bookTypeId === item.bookTypeId);
  const med = mockMediums.find((m) => m.mediumId === item.mediumId);
  const innerGsm = mockGsms.find((g) => g.gsmId === item.innerGsmId);
  const coverGsm = mockGsms.find((g) => g.gsmId === item.coverGsmId);
  const specialGsm = mockGsms.find((g) => g.gsmId === item.specialGsmId);

  return {
    ...item,
    className: cls?.name ?? item.className,
    bookTypeName: bt?.name ?? item.bookTypeName,
    mediumName: med?.name ?? item.mediumName,
    innerGsmName: innerGsm?.name ?? item.innerGsmName,
    coverGsmName: coverGsm?.name ?? item.coverGsmName,
    specialGsmName: specialGsm?.name ?? item.specialGsmName,
  };
}

export async function getTitleById(titleId: number): Promise<Master.TitleForm> {
  const item = titles.find((t) => t.titleId === Number(titleId));
  if (!item) throw new Error("Title not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    classId: item.classId,
    bookTypeId: item.bookTypeId,
    mediumId: item.mediumId,
    innerPages: item.innerPages,
    innerGsmId: item.innerGsmId,
    coverPages: item.coverPages,
    coverGsmId: item.coverGsmId,
    specialPages: item.specialPages,
    specialGsmId: item.specialGsmId,
    totalPages: item.totalPages,
    weight: item.weight,
    length: item.length,
    width: item.width,
    paperArea: item.paperArea,
  };
}

export async function getTitles(): Promise<Master.TitleItem[]> {
  return titles.map(enrichTitleItem);
}

export async function createTitle(data: Master.TitleForm) {
  const newItem: Master.TitleItem = {
    titleId: Date.now(),
    ...data,
    isActive: true,
  };
  titles.push(newItem);
  return enrichTitleItem(newItem);
}

export async function updateTitle(
  titleId: number,
  data: Master.TitleForm,
): Promise<boolean> {
  const index = titles.findIndex((t) => t.titleId === Number(titleId));
  if (index !== -1) {
    titles[index] = { ...titles[index], ...data };
    return true;
  }
  return false;
}

export async function patchTitleStatus(titleId: number): Promise<boolean> {
  const index = titles.findIndex((t) => t.titleId === Number(titleId));
  if (index !== -1) {
    titles[index].isActive = !titles[index].isActive;
    return true;
  }
  return false;
}
