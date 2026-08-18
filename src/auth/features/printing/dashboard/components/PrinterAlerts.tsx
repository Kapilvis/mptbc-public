import { Card } from "shared/components/panels";
import { getPrinterAlerts } from "../printerDashboard.mock";

export default function PrinterAlerts({
  printerCode,
}: {
  printerCode: string;
}) {
  const alerts = getPrinterAlerts(printerCode);

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: "pi pi-exclamation-triangle",
          iconColor: "text-amber-500",
          border: "border-l-4 border-l-amber-500",
          bg: "bg-amber-50/30 dark:bg-amber-950/5",
        };
      case "success":
        return {
          icon: "pi pi-check-circle",
          iconColor: "text-emerald-500",
          border: "border-l-4 border-l-emerald-500",
          bg: "bg-emerald-50/30 dark:bg-emerald-950/5",
        };
      case "info":
      default:
        return {
          icon: "pi pi-info-circle",
          iconColor: "text-blue-500",
          border: "border-l-4 border-l-blue-500",
          bg: "bg-blue-50/30 dark:bg-blue-950/5",
        };
    }
  };

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-bell text-[#4F8F70]" />
          Alerts & Notifications
        </h3>
        <button className="text-xs font-bold text-[#4F8F70] hover:underline cursor-pointer">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((a, idx) => {
          const style = getAlertStyles(a.type);

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border border-gray-150/60 dark:border-gray-800/60 flex gap-3 transition-all hover:border-gray-200 dark:hover:border-gray-700 ${style.border} ${style.bg}`}
            >
              <i
                className={`${style.icon} ${style.iconColor} text-base mt-0.5 shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-white truncate">
                    {a.message}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 shrink-0 font-mono">
                    {a.time}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-normal">
                  {a.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
