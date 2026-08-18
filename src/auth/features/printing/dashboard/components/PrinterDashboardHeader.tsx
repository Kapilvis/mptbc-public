import { useAuth } from "../../../../AuthProvider";
import type { PrinterInfo } from "../printerDashboard.mock";

interface Props {
  printerInfo: PrinterInfo;
}

export default function PrinterDashboardHeader({ printerInfo }: Props) {
  const { user } = useAuth();

  return (
    <div className="bg-[#4F8F70] text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <span className="text-xs font-bold tracking-widest text-[#E8F4EC]/80 uppercase">
          Welcome Back
        </span>
        <h2 className="text-2xl font-black tracking-tight mt-0.5">
          Good Morning, {user?.profile?.name || "PRINTER ADMIN"}
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#E8F4EC]/95 mt-2">
          <span className="font-semibold">{printerInfo.printerName}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8F4EC]/40" />
          <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded border border-white/5">
            Printer Code: {printerInfo.printerCode}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white/10 border border-white/10 px-4 py-3 rounded-xl shrink-0">
        <div>
          <span className="text-[10px] text-[#E8F4EC]/75 block uppercase font-bold tracking-wider">
            Financial Year
          </span>
          <span className="text-base font-bold tracking-wide">2026-27</span>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white border border-white/20">
            PA
          </div>
          <div>
            <span className="text-xs font-bold block">
              {user?.profile?.name || "PRINTER ADMIN"}
            </span>
            <span className="text-[10px] text-[#E8F4EC]/85 block capitalize font-medium">
              Printer Role
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
