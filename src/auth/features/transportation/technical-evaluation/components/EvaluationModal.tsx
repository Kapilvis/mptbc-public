import { useState } from "react";
import { useEvaluateTransporterMutation } from "../queries";
import { ToastService } from "services";
import Modal from "shared/components/popups/Modal";
import { Button } from "shared/components/buttons";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Check,
  X,
} from "lucide-react";

interface EvaluationModalProps {
  transporter: Transportation.TransporterRegistration;
  vehicles: Transportation.Vehicle[];
  visible: boolean;
  onHide: () => void;
}

export default function EvaluationModal({
  transporter,
  vehicles,
  visible,
  onHide,
}: EvaluationModalProps) {
  const [caVerified, setCaVerified] = useState(!!transporter.caCertificate);
  const [remarks, setRemarks] = useState("");

  const evaluateMutation = useEvaluateTransporterMutation(
    transporter.transporterId,
  );

  // Filter vehicles for this transporter
  const transporterVehicles = vehicles.filter(
    (v) => v.transporterId === transporter.transporterId,
  );

  // Calculations for Technical Evaluation
  const maxTurnover = Math.max(
    transporter.turnoverFY2223 || 0,
    transporter.turnoverFY2324 || 0,
    transporter.turnoverFY2425 || 0,
  );
  const turnoverPass = maxTurnover >= 8000000;
  const caPass = !!transporter.caCertificate && caVerified;

  const totalVehicles = transporterVehicles.length;
  const fleetPass = totalVehicles >= 10;

  const cat3Vehicles = transporterVehicles.filter(
    (v) => v.category === "Cat-3",
  ).length;
  const cat3Pass = cat3Vehicles >= 4;

  const isSystemQualified = turnoverPass && caPass && fleetPass && cat3Pass;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isDocExpired = (expiryDateStr: string) => {
    if (!expiryDateStr) return true;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  };

  const getDocStatusBadge = (expiryDateStr: string) => {
    const expired = isDocExpired(expiryDateStr);
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
          expired
            ? "bg-rose-50 text-rose-600 border border-rose-100"
            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
        }`}
      >
        {expired ? "Expired" : "Active"}
      </span>
    );
  };

  const checkAnyVehicleDocExpired = () => {
    return transporterVehicles.some(
      (v) =>
        isDocExpired(v.rcExpiry) ||
        isDocExpired(v.insuranceExpiry) ||
        isDocExpired(v.fitnessExpiry) ||
        isDocExpired(v.permitExpiry) ||
        isDocExpired(v.pucExpiry),
    );
  };

  const handleAction = async (status: "Qualified" | "NotQualified") => {
    try {
      await evaluateMutation.mutateAsync(status);
      ToastService.success(
        `Transporter technical bid marked as ${status === "Qualified" ? "QUALIFIED" : "DISQUALIFIED"} successfully!`,
      );
      onHide();
    } catch {
      ToastService.error("Failed to update evaluation status.");
    }
  };

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      size="large"
      header={`Technical Bid Evaluation — ${transporter.transporterName}`}
    >
      <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Profile Status
            </span>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  transporter.technicalStatus === "Qualified"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : transporter.technicalStatus === "NotQualified"
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {transporter.technicalStatus === "Qualified"
                  ? "Qualified"
                  : transporter.technicalStatus === "NotQualified"
                    ? "Not Qualified"
                    : "Pending Review"}
              </span>
            </div>
          </div>

          {/* Turnovers summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Max Turnover (Target: 80L)
            </span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base font-bold text-slate-800">
                {formatCurrency(maxTurnover)}
              </span>
              {turnoverPass ? (
                <CheckCircle size={18} className="text-emerald-500" />
              ) : (
                <XCircle size={18} className="text-rose-500" />
              )}
            </div>
          </div>

          {/* Fleet summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Fleet (Target: 10)
            </span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base font-bold text-slate-800">
                {totalVehicles} Registered
              </span>
              {fleetPass ? (
                <CheckCircle size={18} className="text-emerald-500" />
              ) : (
                <XCircle size={18} className="text-rose-500" />
              )}
            </div>
          </div>

          {/* Cat-3 summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cat-3 Trucks (Target: 4)
            </span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base font-bold text-slate-800">
                {cat3Vehicles} Registered
              </span>
              {cat3Pass ? (
                <CheckCircle size={18} className="text-emerald-500" />
              ) : (
                <XCircle size={18} className="text-rose-500" />
              )}
            </div>
          </div>
        </div>

        {/* Verification Items Checklist */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-semibold text-sm text-slate-700">
            TECHNICAL REQUIREMENTS VERIFICATION SUMMARY
          </div>
          <div className="divide-y divide-slate-100">
            {/* Item 1: CA Certificate */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  CA Certificate Check
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify chartered accountant certificate for audit
                  authenticity.
                </p>
                {transporter.caCertificate ? (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2 hover:underline"
                  >
                    <FileText size={14} />
                    {transporter.caCertificate} (Click to Preview)
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-semibold mt-2">
                    <X size={14} /> CA Certificate File Missing!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ca-verify-check"
                  checked={caVerified}
                  disabled={!transporter.caCertificate}
                  onChange={(e) => setCaVerified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="ca-verify-check"
                  className="text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Mark CA Certificate as Verified
                </label>
              </div>
            </div>

            {/* Item 2: Turnovers */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Turnover Eligibility Check
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Requirement: Declared annual turnover &ge; ₹80.00 Lakhs in at
                  least one of the last three FYs.
                </p>
                <div className="flex gap-4 mt-2 text-xs flex-wrap">
                  <span className="text-slate-500">
                    FY22-23:{" "}
                    <strong className="text-slate-700">
                      {formatCurrency(transporter.turnoverFY2223)}
                    </strong>
                  </span>
                  <span className="text-slate-500">
                    FY23-24:{" "}
                    <strong className="text-slate-700">
                      {formatCurrency(transporter.turnoverFY2324)}
                    </strong>
                  </span>
                  <span className="text-slate-500">
                    FY24-25:{" "}
                    <strong className="text-slate-700">
                      {formatCurrency(transporter.turnoverFY2425)}
                    </strong>
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    turnoverPass
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}
                >
                  {turnoverPass ? <Check size={14} /> : <X size={14} />}
                  {turnoverPass ? "Turnover Verified" : "Turnover Deficit"}
                </span>
              </div>
            </div>

            {/* Item 3: Fleet Requirements */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Fleet Size Check
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Requirement: Minimum 10 total vehicles and at least 4
                  Category-3 (Heavy Trucks &ge; 9 Ton) vehicles.
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-slate-500">
                    Total Fleet:{" "}
                    <strong className="text-slate-700">{totalVehicles}</strong>{" "}
                    (Min: 10)
                  </span>
                  <span className="text-slate-500">
                    Cat-3 Trucks:{" "}
                    <strong className="text-slate-700">{cat3Vehicles}</strong>{" "}
                    (Min: 4)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    fleetPass
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}
                >
                  {fleetPass ? <Check size={14} /> : <X size={14} />}
                  Total Fleet {fleetPass ? "Met" : "Shortage"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    cat3Pass
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}
                >
                  {cat3Pass ? <Check size={14} /> : <X size={14} />}
                  Cat-3 Fleet {cat3Pass ? "Met" : "Shortage"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Document Expirations table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-semibold text-sm text-slate-700 flex justify-between items-center">
            <span>FLEET DOCUMENTS EXPIRY DETAILS</span>
            {checkAnyVehicleDocExpired() ? (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                <AlertTriangle size={12} />
                Expired Documents Found
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <Check size={12} />
                All Documents Valid
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                  <th className="px-4 py-3">Reg. No.</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">RC Expiry</th>
                  <th className="px-4 py-3">Insurance Exp</th>
                  <th className="px-4 py-3">Fitness Exp</th>
                  <th className="px-4 py-3">Permit Exp</th>
                  <th className="px-4 py-3">PUC Exp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {transporterVehicles.length > 0 ? (
                  transporterVehicles.map((v) => (
                    <tr key={v.vehicleId} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {v.registrationNo}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600 text-[10px]">
                          {v.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span>{v.rcExpiry}</span>
                          {getDocStatusBadge(v.rcExpiry)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span>{v.insuranceExpiry}</span>
                          {getDocStatusBadge(v.insuranceExpiry)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span>{v.fitnessExpiry}</span>
                          {getDocStatusBadge(v.fitnessExpiry)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span>{v.permitExpiry}</span>
                          {getDocStatusBadge(v.permitExpiry)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span>{v.pucExpiry}</span>
                          {getDocStatusBadge(v.pucExpiry)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-400 font-medium"
                    >
                      No vehicles registered for this transporter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Remarks */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="eval-remarks"
            className="text-sm font-bold text-slate-700"
          >
            Evaluation Audit Remarks (Optional)
          </label>
          <textarea
            id="eval-remarks"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter verification notes, check comments, or reject justification..."
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <AlertTriangle size={14} className="text-amber-500" />
            <span>
              System Qualification Check:{" "}
              <strong
                className={
                  isSystemQualified ? "text-emerald-600" : "text-rose-600"
                }
              >
                {isSystemQualified ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </strong>
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              label="Reject Bid"
              icon="times"
              onClick={() => handleAction("NotQualified")}
              variant="danger"
              disabled={evaluateMutation.isPending}
            />
            <Button
              type="button"
              label="Approve Bid"
              icon="check"
              onClick={() => handleAction("Qualified")}
              variant="success"
              disabled={!caPass || evaluateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
