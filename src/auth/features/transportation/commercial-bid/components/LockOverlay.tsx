import { Card } from "shared/components/panels";
import type { QualificationReport } from "../api";
import { ShieldAlert, AlertCircle } from "lucide-react";

interface LockOverlayProps {
  report: QualificationReport;
  transporterName: string;
}

export default function LockOverlay({
  report,
  transporterName,
}: LockOverlayProps) {
  // Only check the 3 requirements displayed in the cards
  const failedCount =
    (report.turnoverPass ? 0 : 1) +
    (report.fleetPass ? 0 : 1) +
    (report.cat3Pass ? 0 : 1);

  const formatDate = () => {
    const d = new Date();
    const day = d.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Calculations for Financial Criterion
  const maxTurnoverLakhs = (report.maxTurnover / 100000).toFixed(2);
  const deficitLakhs = Math.max(0, 80 - report.maxTurnover / 100000).toFixed(2);
  const turnoverProgress = Math.max(
    0,
    Math.min(100, (report.maxTurnover / 8000000) * 100),
  );

  // Calculations for Fleet Requirement
  const shortageVehicles = Math.max(0, 10 - report.totalVehicles);
  const fleetProgress = Math.max(
    0,
    Math.min(100, (report.totalVehicles / 10) * 100),
  );

  // Calculations for Vehicle Capacity
  const shortageCat3 = Math.max(0, 4 - report.cat3Vehicles);
  const cat3Progress = Math.max(
    0,
    Math.min(100, (report.cat3Vehicles / 4) * 100),
  );

  return (
    <div className="w-full mt-8">
      {/* Header Status Card using shared Card styling */}
      <Card>
        <div className="flex items-start md:items-center gap-4 p-2">
          <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
            <ShieldAlert size={28} className="stroke-[1.5]" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-800">
                {transporterName}
              </h2>
              <span className="bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                LOCKED (NOT ELIGIBLE)
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Your commercial bidding screen is currently locked because your
              profile does not meet {failedCount} mandatory technical &
              financial evaluation criteria.
            </p>
          </div>
        </div>
      </Card>

      {/* Disqualification Reasons Heading */}
      <div className="flex items-center justify-between flex-wrap gap-4 mt-8 mb-6 px-1">
        <div className="flex items-center gap-2 text-rose-500">
          <AlertCircle size={18} />
          <span className="text-sm font-bold tracking-wider uppercase text-slate-800">
            DISQUALIFICATION REASONS ({failedCount} FAILED REQUIREMENTS)
          </span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Evaluation Timestamp: {formatDate()}
        </div>
      </div>

      {/* Grid of Failed Requirements using shared Card styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Annual Turnover */}
        {!report.turnoverPass && (
          <Card className="h-full">
            <div className="flex flex-col justify-between h-full min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    Financial Criterion
                  </span>
                  <span className="bg-rose-50 border border-rose-100/50 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Deficit: ₹{deficitLakhs}L
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Minimum Annual Turnover
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Annual turnover is less than ₹80,00,000 in all three FY years.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">
                    Required Minimum:
                  </span>
                  <span className="text-slate-700 font-semibold">
                    ₹80.00 Lakhs
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">
                    Highest Achieved:
                  </span>
                  <span className="text-rose-600 font-bold">
                    ₹{maxTurnoverLakhs} Lakhs
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${turnoverProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Card 2: Fleet Requirement */}
        {!report.fleetPass && (
          <Card className="h-full">
            <div className="flex flex-col justify-between h-full min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    Fleet Requirement
                  </span>
                  <span className="bg-rose-50 border border-rose-100/50 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Shortage: {shortageVehicles} Vehicles
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Registered Fleet Size
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Total verified registered fleet size is {report.totalVehicles}{" "}
                  (minimum 10 required).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">
                    Required Minimum:
                  </span>
                  <span className="text-slate-700 font-semibold">
                    10 Vehicles
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">
                    Verified On File:
                  </span>
                  <span className="text-rose-600 font-bold">
                    {report.totalVehicles} Vehicles
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${fleetProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Card 3: Vehicle Capacity */}
        {!report.cat3Pass && (
          <Card className="h-full">
            <div className="flex flex-col justify-between h-full min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    Vehicle Capacity
                  </span>
                  <span className="bg-rose-50 border border-rose-100/50 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Shortage: {shortageCat3} Vehicles
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Category 3 (≥ 9 Ton) Fleet
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Category 3 heavy vehicle count is {report.cat3Vehicles}{" "}
                  (minimum 4 required).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">
                    Required Heavy Fleet:
                  </span>
                  <span className="text-slate-700 font-semibold">
                    4 Vehicles
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">
                    Verified Heavy Fleet:
                  </span>
                  <span className="text-rose-600 font-bold">
                    {report.cat3Vehicles} Vehicles
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${cat3Progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
