import { mockVehicles } from "./data";

const vehicles = [...mockVehicles];

export async function getVehicles(): Promise<Transportation.Vehicle[]> {
  return [...vehicles];
}

export async function getVehicleById(
  vehicleId: number,
): Promise<Transportation.Vehicle> {
  const item = vehicles.find((v) => v.vehicleId === Number(vehicleId));
  if (!item) throw new Error("Vehicle not found");
  return { ...item };
}

export async function createVehicle(
  data: Omit<Transportation.Vehicle, "vehicleId">,
) {
  const nextId =
    vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.vehicleId)) + 1 : 1;

  const newItem: Transportation.Vehicle = {
    ...data,
    vehicleId: nextId,
    capacity: Number(data.capacity),
    manufacturingYear: Number(data.manufacturingYear),
  };

  vehicles.push(newItem);
  return newItem;
}

export async function updateVehicle(
  vehicleId: number,
  data: Transportation.Vehicle,
): Promise<Transportation.Vehicle | undefined> {
  const index = vehicles.findIndex((v) => v.vehicleId === Number(vehicleId));
  if (index !== -1) {
    const updatedItem = {
      ...vehicles[index],
      ...data,
      capacity: Number(data.capacity),
      manufacturingYear: Number(data.manufacturingYear),
    };
    vehicles[index] = updatedItem;
    return updatedItem;
  }
  return undefined;
}

export async function deleteVehicle(vehicleId: number): Promise<boolean> {
  const index = vehicles.findIndex((v) => v.vehicleId === Number(vehicleId));
  if (index !== -1) {
    vehicles.splice(index, 1);
    return true;
  }
  return false;
}
