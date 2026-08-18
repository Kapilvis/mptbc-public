import { useNavigate } from "react-router-dom";
import { Card } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import { getDaysRemaining } from "../printerDashboard.mock";

interface Props {
  printerCode: string;
}

export default function UpcomingDeadlines({ printerCode }: Props) {
  const navigate = useNavigate();

  // Load printer orders
  const orders = dataManager
    .getOrders()
    .filter((o) => o.printerCode === printerCode);

  // Specific deadlines requested
  const targetDeadlines = ["PO-2026-003", "PO-2026-002", "PO-2026-001"];
  const deadlineOrders = orders.filter((o) =>
    targetDeadlines.includes(o.orderNo),
  );

  // Sequence: Urgent (PO-003) -> Warning (PO-002) -> Normal (PO-001)
  deadlineOrders.sort(
    (a, b) =>
      targetDeadlines.indexOf(a.orderNo) - targetDeadlines.indexOf(b.orderNo),
  );

  const getUrgencyConfig = (days: number) => {
    if (days <= 2) {
      return {
        label: "Urgent",
        borderClass: "border-l-4 border-l-rose-500",
        bgClass: "bg-rose-50/50 dark:bg-rose-950/10",
        textClass: "text-rose-700 dark:text-rose-400",
      };
    }
    if (days <= 7) {
      return {
        label: "Warning",
        borderClass: "border-l-4 border-l-amber-500",
        bgClass: "bg-amber-50/50 dark:bg-amber-950/10",
        textClass: "text-amber-700 dark:text-amber-400",
      };
    }
    return {
      label: "Normal",
      borderClass: "border-l-4 border-l-emerald-500",
      bgClass: "bg-emerald-50/50 dark:bg-emerald-950/10",
      textClass: "text-emerald-700 dark:text-emerald-400",
    };
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-bell text-[#4F8F70]" />
          Upcoming Deadlines
        </h3>
        <button
          onClick={() => navigate("/printing/orders/list")}
          className="text-xs font-bold text-[#4F8F70] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {deadlineOrders.map((o) => {
          const days = getDaysRemaining(o.requiredByDate);
          const config = getUrgencyConfig(days);

          return (
            <div
              key={o.orderNo}
              onClick={() => navigate(`/printing/orders/details/${o.orderNo}`)}
              className={`p-3.5 rounded-xl border border-gray-150/60 dark:border-gray-800/60 flex items-center justify-between cursor-pointer hover:shadow-xs hover:border-gray-300 dark:hover:border-gray-750 transition-all ${config.borderClass} ${config.bgClass}`}
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-[#4F8F70] block">
                  {o.orderNo}
                </span>
                <span className="text-xs font-black text-gray-850 dark:text-white block mt-0.5">
                  {o.bookTitle}
                </span>
                <span className="text-[10px] font-bold text-gray-400 block mt-1">
                  Due: {formatDate(o.requiredByDate)} •{" "}
                  {o.requiredQty.toLocaleString("en-IN")} Books
                </span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block ${config.textClass}`}
                >
                  {config.label}
                </span>
                <span className="text-xs font-black text-gray-750 dark:text-white block mt-0.5 font-mono">
                  {days > 0
                    ? `${days} Days Left`
                    : days === 0
                      ? "Due Today"
                      : "Overdue"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
