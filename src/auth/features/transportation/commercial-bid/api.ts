import { mockTenders, mockBids } from "./data";
import type { Bid } from "./data";
import { getTransporters } from "../../master/transporter-registration/api";
import { getVehicles } from "../../master/vehicle-master/api";

const bids = [...mockBids];

export async function getTenders() {
  return [...mockTenders];
}

export async function getBids(transporterId?: number) {
  if (transporterId) {
    return bids.filter((b) => b.transporterId === Number(transporterId));
  }
  return [...bids];
}

export interface QualificationReport {
  isQualified: boolean;
  maxTurnover: number;
  totalVehicles: number;
  cat3Vehicles: number;
  turnoverPass: boolean;
  caPass: boolean;
  fleetPass: boolean;
  cat3Pass: boolean;
  reasons: string[];
}

export async function checkTransporterQualification(
  transporterId: number,
): Promise<QualificationReport> {
  const transporters = await getTransporters();
  const vehicles = await getVehicles();

  const transporter = transporters.find(
    (t) => t.transporterId === Number(transporterId),
  );
  if (!transporter) {
    return {
      isQualified: false,
      maxTurnover: 0,
      totalVehicles: 0,
      cat3Vehicles: 0,
      turnoverPass: false,
      caPass: false,
      fleetPass: false,
      cat3Pass: false,
      reasons: ["Transporter record not found."],
    };
  }

  const maxTurnover = Math.max(
    transporter.turnoverFY2223 || 0,
    transporter.turnoverFY2324 || 0,
    transporter.turnoverFY2425 || 0,
  );
  const turnoverPass = maxTurnover >= 8000000;
  const caPass = !!transporter.caCertificate;

  const transporterVehicles = vehicles.filter(
    (v) => v.transporterId === Number(transporterId),
  );
  const totalVehicles = transporterVehicles.length;
  const fleetPass = totalVehicles >= 10;

  const cat3Vehicles = transporterVehicles.filter(
    (v) => v.category === "Cat-3",
  ).length;
  const cat3Pass = cat3Vehicles >= 4;

  const isQualified = turnoverPass && caPass && fleetPass && cat3Pass;
  const reasons: string[] = [];

  if (!turnoverPass) {
    reasons.push(
      `Annual turnover is less than ₹80,00,000 in all three FY years (highest was ₹${(
        maxTurnover / 100000
      ).toFixed(2)}L).`,
    );
  }
  if (!caPass) {
    reasons.push("Mandatory CA certificate has not been uploaded.");
  }
  if (!fleetPass) {
    reasons.push(
      `Registered fleet size is ${totalVehicles} (minimum 10 vehicles required).`,
    );
  }
  if (!cat3Pass) {
    reasons.push(
      `Category 3 (>= 9 Ton) vehicles count is ${cat3Vehicles} (minimum 4 required).`,
    );
  }

  return {
    isQualified,
    maxTurnover,
    totalVehicles,
    cat3Vehicles,
    turnoverPass,
    caPass,
    fleetPass,
    cat3Pass,
    reasons,
  };
}

export async function submitBid(bidData: Omit<Bid, "bidId" | "submittedAt">) {
  // Check if bid already exists
  const existingIndex = bids.findIndex(
    (b) =>
      b.tenderId === bidData.tenderId &&
      b.transporterId === Number(bidData.transporterId),
  );

  const nextId =
    bids.length > 0 ? Math.max(...bids.map((b) => b.bidId)) + 1 : 1;
  const nowStr = new Date().toISOString().slice(0, 16).replace("T", " ");

  const newBid: Bid = {
    ...bidData,
    bidId: existingIndex !== -1 ? bids[existingIndex].bidId : nextId,
    transporterId: Number(bidData.transporterId),
    rateCat1: Number(bidData.rateCat1),
    rateCat2: Number(bidData.rateCat2),
    rateCat3: Number(bidData.rateCat3),
    submittedAt: nowStr,
  };

  if (existingIndex !== -1) {
    bids[existingIndex] = newBid;
  } else {
    bids.push(newBid);
  }

  return newBid;
}

export async function authorizePrimeBidder(
  tenderId: string,
  transporterId: number,
) {
  const tender = mockTenders.find((t) => t.tenderId === tenderId);
  if (tender) {
    tender.allocatedTransporterId = transporterId;
    return tender;
  }
  throw new Error("Tender not found");
}

export async function resetPrimeBidder(tenderId: string) {
  const tender = mockTenders.find((t) => t.tenderId === tenderId);
  if (tender) {
    tender.allocatedTransporterId = undefined;
    return tender;
  }
  throw new Error("Tender not found");
}
