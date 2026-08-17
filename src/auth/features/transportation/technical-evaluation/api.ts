import {
  getTransporters,
  updateTransporterStatus,
} from "../../master/transporter-registration/api";
import { getVehicles } from "../../master/vehicle-master/api";

export async function getTransportersForEvaluation() {
  return getTransporters();
}

export async function getVehiclesForEvaluation() {
  return getVehicles();
}

export async function evaluateTransporter(
  transporterId: number,
  status: "Qualified" | "NotQualified",
) {
  return updateTransporterStatus(transporterId, status);
}
