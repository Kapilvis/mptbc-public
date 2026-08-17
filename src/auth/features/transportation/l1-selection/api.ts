import {
  getTenders,
  getBids,
  authorizePrimeBidder as authorizeBidderApi,
} from "../commercial-bid/api";
import { getTransporters } from "../../master/transporter-registration/api";
import { getVehicles } from "../../master/vehicle-master/api";

export async function getTendersForL1() {
  return getTenders();
}

export async function getBidsForL1() {
  return getBids();
}

export async function getTransportersForL1() {
  return getTransporters();
}

export async function getVehiclesForL1() {
  return getVehicles();
}

export async function authorizePrimeBidder(
  tenderId: string,
  transporterId: number,
) {
  return authorizeBidderApi(tenderId, transporterId);
}
