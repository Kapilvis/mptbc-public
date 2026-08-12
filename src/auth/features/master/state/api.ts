import { mockStates } from "./data";

const states = [...mockStates];

export async function getStateById(stateId: number): Promise<Master.StateForm> {
  const item = states.find((s) => s.stateId === Number(stateId));
  if (!item) throw new Error("State not found");
  return {
    name: item.name,
    localName: item.localName,
    code: item.code,
    lgdCode: item.lgdCode,
  };
}

export async function getStates(): Promise<Master.StateItem[]> {
  return [...states];
}

export async function createState(data: Master.StateForm) {
  const newItem: Master.StateItem = {
    stateId: Date.now(),
    ...data,
    isActive: true,
  };
  states.push(newItem);
  return newItem;
}

export async function updateState(
  stateId: number,
  data: Master.StateForm,
): Promise<Master.StateForm | undefined> {
  const index = states.findIndex((s) => s.stateId === Number(stateId));
  if (index !== -1) {
    states[index] = { ...states[index], ...data };
    return data;
  }
  return undefined;
}

export async function patchStateStatus(stateId: number): Promise<boolean> {
  const index = states.findIndex((s) => s.stateId === Number(stateId));
  if (index !== -1) {
    states[index].isActive = !states[index].isActive;
    return true;
  }
  return false;
}
