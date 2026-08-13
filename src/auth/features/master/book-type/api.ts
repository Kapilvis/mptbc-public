import { mockBookTypes } from "./data";

const bookTypes = [...mockBookTypes];

export async function getBookTypeById(
  bookTypeId: number,
): Promise<Master.BookTypeForm> {
  const item = bookTypes.find((b) => b.bookTypeId === Number(bookTypeId));
  if (!item) throw new Error("Book Type not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
  };
}

export async function getBookTypes(): Promise<Master.BookTypeItem[]> {
  return [...bookTypes];
}

export async function createBookType(data: Master.BookTypeForm) {
  const newItem: Master.BookTypeItem = {
    bookTypeId: Date.now(),
    ...data,
    isActive: true,
  };
  bookTypes.push(newItem);
  return newItem;
}

export async function updateBookType(
  bookTypeId: number,
  data: Master.BookTypeForm,
): Promise<boolean> {
  const index = bookTypes.findIndex((b) => b.bookTypeId === Number(bookTypeId));
  if (index !== -1) {
    bookTypes[index] = { ...bookTypes[index], ...data };
    return true;
  }
  return false;
}

export async function patchBookTypeStatus(
  bookTypeId: number,
): Promise<boolean> {
  const index = bookTypes.findIndex((b) => b.bookTypeId === Number(bookTypeId));
  if (index !== -1) {
    bookTypes[index].isActive = !bookTypes[index].isActive;
    return true;
  }
  return false;
}
