import { Card } from "shared/components/panels";
import { getSupplyStatusItems } from "../printerDashboard.mock";

export default function SupplyStatus({ printerCode }: { printerCode: string }) {
  const items = getSupplyStatusItems(printerCode);
  const maxVal = 150000;

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bar: "bg-emerald-500",
          bg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
        };
      case "blue":
        return {
          bar: "bg-blue-500",
          bg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
        };
      case "purple":
        return {
          bar: "bg-purple-500",
          bg: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
        };
      case "amber":
      default:
        return {
          bar: "bg-amber-500",
          bg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
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
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-truck text-[#4F8F70]" />
          Supply Status
        </h3>
        <p className="text-xs text-gray-550 dark:text-gray-400 mt-0.5">
          Progress levels of printed inventory matching depot dispatches
        </p>
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
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}
                  >
                    <i className={icon} />
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono font-black text-gray-800 dark:text-white">
                  {item.value.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-750 h-2 rounded-full overflow-hidden">
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
