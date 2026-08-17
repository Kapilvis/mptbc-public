import { mockTransporters } from "./data";

const transporters = [...mockTransporters];

export async function getTransporters(): Promise<
  Transportation.TransporterRegistration[]
> {
  return [...transporters];
}

export async function getTransporterById(
  transporterId: number,
): Promise<Transportation.TransporterRegistration> {
  const item = transporters.find(
    (t) => t.transporterId === Number(transporterId),
  );
  if (!item) throw new Error("Transporter not found");
  return { ...item };
}

export async function createTransporter(
  data: Omit<
    Transportation.TransporterRegistration,
    "transporterId" | "registrationNo" | "technicalStatus"
  >,
) {
  const nextId =
    transporters.length > 0
      ? Math.max(...transporters.map((t) => t.transporterId)) + 1
      : 1;

  const registrationNo = `TBC-T-${String(nextId).padStart(3, "0")}`;

  // Turnover Qualification Rule (any FY >= 80 Lakhs AND CA Certificate exists)
  const isTurnoverEligible =
    Number(data.turnoverFY2223) >= 8000000 ||
    Number(data.turnoverFY2324) >= 8000000 ||
    Number(data.turnoverFY2425) >= 8000000;

  const hasCa = !!data.caCertificate;
  const technicalStatus: "Qualified" | "NotQualified" =
    isTurnoverEligible && hasCa ? "Qualified" : "NotQualified";

  const newItem: Transportation.TransporterRegistration = {
    ...data,
    transporterId: nextId,
    registrationNo,
    technicalStatus,
  };

  transporters.push(newItem);
  return newItem;
}

export async function updateTransporter(
  transporterId: number,
  data: Transportation.TransporterRegistration,
): Promise<Transportation.TransporterRegistration | undefined> {
  const index = transporters.findIndex(
    (t) => t.transporterId === Number(transporterId),
  );
  if (index !== -1) {
    const isTurnoverEligible =
      Number(data.turnoverFY2223) >= 8000000 ||
      Number(data.turnoverFY2324) >= 8000000 ||
      Number(data.turnoverFY2425) >= 8000000;

    const hasCa = !!data.caCertificate;
    const technicalStatus: "Qualified" | "NotQualified" =
      isTurnoverEligible && hasCa ? "Qualified" : "NotQualified";

    const updatedItem = {
      ...transporters[index],
      ...data,
      technicalStatus,
    };
    transporters[index] = updatedItem;
    return updatedItem;
  }
  return undefined;
}

export async function deleteTransporter(
  transporterId: number,
): Promise<boolean> {
  const index = transporters.findIndex(
    (t) => t.transporterId === Number(transporterId),
  );
  if (index !== -1) {
    transporters.splice(index, 1);
    return true;
  }
  return false;
}

export async function updateTransporterStatus(
  transporterId: number,
  status: "Pending" | "Qualified" | "NotQualified",
): Promise<Transportation.TransporterRegistration | undefined> {
  const index = transporters.findIndex(
    (t) => t.transporterId === Number(transporterId),
  );
  if (index !== -1) {
    transporters[index] = {
      ...transporters[index],
      technicalStatus: status,
    };
    return transporters[index];
  }
  return undefined;
}
