import { Card } from "shared/components/panels";
import { getSupplyStatusItems } from "../printerDashboard.mock";

export default function SupplyStatus({ printerCode }: { printerCode: string }) {
  const items = getSupplyStatusItems(printerCode);
  const maxVal = 150000;

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bar: "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-xs",
          bg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10",
        };
      case "blue":
        return {
          bar: "bg-gradient-to-r from-blue-500 to-indigo-450 shadow-xs",
          bg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-500/10",
        };
      case "purple":
        return {
          bar: "bg-gradient-to-r from-purple-500 to-pink-450 shadow-xs",
          bg: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-500/10",
        };
      case "amber":
      default:
        return {
          bar: "bg-gradient-to-r from-amber-500 to-orange-450 shadow-xs",
          bg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-500/10",
        };
    }
  };

  const getIconClass = (icon: string) => {
    switch (icon) {
      case "print":
        return "pi pi-print";
      case "box":
        return "pi pi-box";
      case "send":
        return "pi pi-send";
      case "clock":
      default:
        return "pi pi-clock";
    }
  };

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between !border-t-transparent relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Premium top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-truck text-[#4F8F70]" />
          Supply Status
        </h3>
      </div>

      <div className="space-y-4 mt-4">
        {items.map((item) => {
          const colors = getColorClasses(item.color);
          const icon = getIconClass(item.icon);
          const percent = Math.min(
            100,
            Math.round((item.value / maxVal) * 100),
          );

          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${colors.bg}`}
                  >
                    <i className={icon} />
                  </div>
                  <span className="font-extrabold text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
                  {item.value.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner border border-gray-200/10">
                <div
                  className={`${colors.bar} h-full rounded-full transition-all duration-550`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
