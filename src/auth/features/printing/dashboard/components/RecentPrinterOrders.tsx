import { useNavigate } from "react-router-dom";
import { Card } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";

interface Props {
  printerCode: string;
}

export default function RecentPrinterOrders({ printerCode }: Props) {
  const navigate = useNavigate();

  // Fetch orders dynamically from global mock data store
  const allOrders = dataManager.getOrders();
  const printerOrders = allOrders.filter((o) => o.printerCode === printerCode);

  const displayOrders = (
    printerOrders.length >= 3 ? printerOrders : allOrders
  ).slice(0, 4);

  const getStatusText = (status: string, priority: string) => {
    if (status === "Partially Supplied") {
      return priority === "High" ? "Urgent" : "In Progress";
    }
    if (status === "Approved" || status === "Pending") return "Pending";
    return status;
  };

  const getStatusBadgeClass = (status: string, priority: string) => {
    const text = getStatusText(status, priority);
    switch (text) {
      case "Urgent":
        return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/50";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  // Paper Weight mapper corresponding to orders
  const getPaperWeight = (orderNo: string) => {
    const weightMap: Record<string, string> = {
      "PO-2026-001": "22 MT",
      "PO-2026-002": "15 MT",
      "PO-2026-003": "28 MT",
      "PO-2026-004": "12 MT",
    };
    return weightMap[orderNo] || "15 MT";
  };

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
            <i className="pi pi-file text-[#4F8F70]" />
            Recent Printer Orders
          </h3>
          <p className="text-xs font-medium text-gray-550 dark:text-gray-400 mt-0.5">
            Log of recently assigned printing contracts and requirements
          </p>
        </div>
        <button
          onClick={() => navigate("/printing/orders/list")}
          className="text-xs font-bold text-[#4F8F70] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/80 text-[10px] uppercase font-bold tracking-widest text-gray-400 pb-2">
              <th className="py-2.5 font-bold">Order No.</th>
              <th className="py-2.5 font-bold">Order Date</th>
              <th className="py-2.5 font-bold">Book / Class</th>
              <th className="py-2.5 text-right font-bold">Quantity</th>
              <th className="py-2.5 text-right font-bold">Paper</th>
              <th className="py-2.5 pl-4 font-bold">Deadline</th>
              <th className="py-2.5 pl-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/40 dark:divide-gray-800/40 text-xs">
            {displayOrders.map((o) => {
              const statusText = getStatusText(o.status, o.priority);
              const badgeClass = getStatusBadgeClass(o.status, o.priority);

              return (
                <tr
                  key={o.orderNo}
                  className="transition-colors duration-150 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="py-3 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                    {o.orderNo}
                  </td>
                  <td className="py-3 text-gray-500 font-semibold">
                    {formatDate(o.orderDate)}
                  </td>
                  <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                    {o.bookTitle}
                  </td>
                  <td className="py-3 text-right font-semibold font-mono text-gray-700 dark:text-gray-300">
                    {o.requiredQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right font-semibold font-mono text-gray-500 dark:text-gray-400">
                    {getPaperWeight(o.orderNo)}
                  </td>
                  <td className="py-3 pl-4 font-semibold text-gray-700 dark:text-gray-300">
                    {formatDate(o.requiredByDate)}
                  </td>
                  <td className="py-3 pl-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${badgeClass}`}
                    >
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
