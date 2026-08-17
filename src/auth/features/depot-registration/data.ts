import { getDepots } from "auth/features/master/depot/data";
import { getSubDepots } from "auth/features/master/sub-depot/data";
import { mockDistricts } from "auth/features/master/district/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const defaultDepotRegistrations: DepotRegistration.Registration[] = [
  {
    depotRegistrationId: 101,
    dptName: "Bhopal Central Warehouse",
    depotId: 4, // BHOPAL
    districtId: 1, // Bhopal
    type: "Central",
    address: "Arera Hills, Near MP Textbook Corporation HQ, Bhopal",
    pin: "462011",
    incharge: "S. K. Verma",
    mobile: "9876543210",
    email: "bhopal.dpt@mptbc.mp.gov.in",
    capacity: 2500000,
    godowns: 12,
    isActive: true,
    createdOn: "2026-08-10T10:00:00Z",
  },
  {
    depotRegistrationId: 102,
    dptName: "Indore Regional Storage Depot",
    depotId: 1, // INDORE
    districtId: 2, // Indore
    type: "Regional",
    address: "Dewas Naka, Industrial Area, Sector A, Indore",
    pin: "452010",
    incharge: "Rajesh Soni",
    mobile: "9425098765",
    email: "indore.dpt@mptbc.mp.gov.in",
    capacity: 1800000,
    godowns: 8,
    isActive: true,
    createdOn: "2026-08-11T11:30:00Z",
  },
  {
    depotRegistrationId: 103,
    dptName: "Sehore District Book Depot",
    depotId: 4, // BHOPAL (Parent Depot)
    districtId: 3, // Sehore
    type: "District",
    address: "Station Road, Near Government Boys School, Sehore",
    pin: "466001",
    incharge: "Nitin Sharma",
    mobile: "8877665544",
    email: "sehore.dpt@mptbc.mp.gov.in",
    capacity: 500000,
    godowns: 3,
    isActive: true,
    createdOn: "2026-08-12T14:15:00Z",
  },
  {
    depotRegistrationId: 104,
    dptName: "Burhanpur Sub-Warehouse",
    depotId: 3, // KHANDWA (Parent Depot)
    subDepotId: 1, // BURHANPUR Sub Depot
    districtId: 2, // Indore (Close Region District / Burhanpur falls under Indore Division)
    type: "SubDepot",
    address: "Main Road, Burhanpur",
    pin: "450331",
    incharge: "Vijay Chouhan",
    mobile: "7000112233",
    email: "burhanpur.dpt@mptbc.mp.gov.in",
    capacity: 350000,
    godowns: 2,
    isActive: false,
    createdOn: "2026-08-13T09:45:00Z",
  },
];

const STORAGE_KEY = "mptbc_depot_registration_data_v1";

export function getDepotRegistrations(): DepotRegistration.Registration[] {
  const data = localStorage.getItem(STORAGE_KEY);
  let list: DepotRegistration.Registration[];

  if (!data) {
    list = defaultDepotRegistrations;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } else {
    try {
      list = JSON.parse(data);
    } catch {
      list = defaultDepotRegistrations;
    }
  }

  // Resolve Master Names dynamically
  const depots = getDepots();
  const subDepots = getSubDepots();

  return list.map((item) => {
    const parentDepot = depots.find((d) => d.depotId === item.depotId);
    const subDpt = item.subDepotId
      ? subDepots.find((sd) => sd.subDepotId === item.subDepotId)
      : undefined;
    const dist = mockDistricts.find((d) => d.districtId === item.districtId);

    return {
      ...item,
      depotName: parentDepot ? parentDepot.name : `Depot #${item.depotId}`,
      subDepotName: subDpt
        ? subDpt.name
        : item.subDepotId
          ? `Sub Depot #${item.subDepotId}`
          : undefined,
      districtName: dist ? dist.name : `District #${item.districtId}`,
    };
  });
}

export function saveDepotRegistrations(
  list: DepotRegistration.Registration[],
): void {
  // Strip virtual field names before storing
  const rawList = list.map((item) => {
    const copy = { ...item };
    delete copy.depotName;
    delete copy.subDepotName;
    delete copy.districtName;
    return copy;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rawList));

  // Dispatch event for UI updates
  window.dispatchEvent(new Event("mptbc_depot_registration_changed"));
}

/* ==========================================
   Mock API Operations
   ========================================== */

export async function fetchDepotRegistrations(): Promise<
  DepotRegistration.Registration[]
> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getDepotRegistrations();
}

export async function fetchDepotRegistrationById(
  id: number,
): Promise<DepotRegistration.Registration> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const list = getDepotRegistrations();
  const item = list.find((d) => d.depotRegistrationId === Number(id));
  if (!item) throw new Error("Depot Registration profile not found");
  return item;
}

export async function createDepotRegistration(
  form: DepotRegistration.RegistrationForm,
): Promise<DepotRegistration.Registration> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const list = getDepotRegistrations();

  const newItem: DepotRegistration.Registration = {
    ...form,
    depotRegistrationId: Date.now(),
    isActive: true,
    createdOn: new Date().toISOString(),
  };

  list.push(newItem);
  saveDepotRegistrations(list);
  return newItem;
}

export async function updateDepotRegistration(
  id: number,
  form: DepotRegistration.RegistrationForm,
): Promise<DepotRegistration.Registration> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const list = getDepotRegistrations();
  const index = list.findIndex((d) => d.depotRegistrationId === Number(id));
  if (index === -1) throw new Error("Depot Registration profile not found");

  const updatedItem: DepotRegistration.Registration = {
    ...list[index],
    ...form,
    modifiedOn: new Date().toISOString(),
  };

  list[index] = updatedItem;
  saveDepotRegistrations(list);
  return updatedItem;
}

export async function deleteDepotRegistration(id: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const list = getDepotRegistrations();
  const filtered = list.filter((d) => d.depotRegistrationId !== Number(id));

  if (filtered.length === list.length) return false;

  saveDepotRegistrations(filtered);
  return true;
}

export async function patchDepotRegistrationStatus(
  id: number,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const list = getDepotRegistrations();
  const index = list.findIndex((d) => d.depotRegistrationId === Number(id));
  if (index === -1) return false;

  list[index].isActive = !list[index].isActive;
  saveDepotRegistrations(list);
  return true;
}

/* ==========================================
   React Query Hooks
   ========================================== */

const queryKey = ["@mptbc/depot-registration"];

export function useDepotRegistrationsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: fetchDepotRegistrations,
    enabled,
  });
}

export function useDepotRegistrationQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => fetchDepotRegistrationById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateDepotRegistrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepotRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateDepotRegistrationMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepotRegistration.RegistrationForm) =>
      updateDepotRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
    },
  });
}

export function useDeleteDepotRegistrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepotRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useDepotRegistrationStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDepotRegistrationStatus(data.id),
    onSuccess: (success, variables) => {
      if (!success) return;

      const cache =
        queryClient.getQueryData<DepotRegistration.Registration[]>(queryKey) ??
        [];
      const index = cache.findIndex(
        (item) => item.depotRegistrationId === variables.id,
      );
      if (index === -1) return;

      const updatedItem = {
        ...cache[index],
        isActive: variables.isActive,
      };

      queryClient.setQueryData(queryKey, [
        ...cache.slice(0, index),
        updatedItem,
        ...cache.slice(index + 1),
      ]);
    },
  });
}
