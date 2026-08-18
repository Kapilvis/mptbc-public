import { useNavigate } from "react-router-dom";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { dataManager } from "../../../inventory/mockData";

interface Props {
  printerCode: string;
}

export default function PrintingProgress({ printerCode }: Props) {
  const navigate = useNavigate();

  // Load orders from the global store dynamically
  const allOrders = dataManager.getOrders();
  const printerOrders = allOrders.filter((o) => o.printerCode === printerCode);

  // Target orders for this section
  const targetOrderNos = [
    "PO-2026-001",
    "PO-2026-002",
    "PO-2026-003",
    "PO-2026-004",
    "PO-2026-005",
  ];

  const displayOrders = printerOrders.filter((o) =>
    targetOrderNos.includes(o.orderNo),
  );

  // Fallback sorting to match the prompt's sequence
  displayOrders.sort(
    (a, b) =>
      targetOrderNos.indexOf(a.orderNo) - targetOrderNos.indexOf(b.orderNo),
  );

  const getStatusText = (status: string) => {
    if (status === "Partially Supplied") return "In Progress";
    if (status === "Approved" || status === "Pending") return "Pending";
    return status; // Completed, Cancelled etc.
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50";
      case "Partially Supplied":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50";
      case "Pending":
      case "Approved":
      default:
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
    }
  };

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
            <i className="pi pi-sync text-[#4F8F70]" />
            Printing Progress
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            Production line updates and textbook print fulfillment ratios
          </p>
        </div>
        <Button
          label="View All Orders"
          icon="list"
          onClick={() => navigate("/printing/orders/list")}
          className="p-button-sm self-start sm:self-auto text-xs py-1"
        />
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/80 text-[10px] uppercase font-bold tracking-widest text-gray-400 pb-2">
              <th className="py-2.5 font-bold">Order No.</th>
              <th className="py-2.5 font-bold">Book / Class</th>
              <th className="py-2.5 text-right font-bold">Quantity</th>
              <th className="py-2.5 text-right font-bold">Printed</th>
              <th className="py-2.5 text-right font-bold">Pending</th>
              <th className="py-2.5 text-right font-bold">Progress</th>
              <th className="py-2.5 pl-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/40 dark:divide-gray-800/40 text-xs">
            {displayOrders.map((o) => {
              // Calculate progress percentage dynamically
              const progress = Math.min(
                100,
                Math.round((o.suppliedQty / o.requiredQty) * 100),
              );
              const progressStatus = getStatusText(o.status);

              return (
                <tr
                  key={o.orderNo}
                  onClick={() =>
                    navigate(`/printing/orders/details/${o.orderNo}`)
                  }
                  className="group hover:bg-gray-50/70 dark:hover:bg-gray-850/30 cursor-pointer transition-colors duration-150"
                >
                  <td className="py-3 font-mono font-bold text-xs text-[#4F8F70] group-hover:underline">
                    {o.orderNo}
                  </td>
                  <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                    {o.bookTitle} - {o.classLevel}
                  </td>
                  <td className="py-3 text-right font-semibold font-mono text-gray-700 dark:text-gray-300">
                    {o.requiredQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right font-semibold font-mono text-gray-700 dark:text-gray-300">
                    {o.suppliedQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right font-semibold font-mono text-gray-500 dark:text-gray-400">
                    {o.pendingQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-2.5 justify-end w-full">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden shrink-0">
                        <div
                          className="bg-[#5FAF7A] h-full rounded-full transition-all duration-550"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-gray-800 dark:text-white shrink-0 text-right w-8">
                        {progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pl-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${getStatusBadgeClass(
                        o.status,
                      )}`}
                    >
                      {progressStatus}
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
