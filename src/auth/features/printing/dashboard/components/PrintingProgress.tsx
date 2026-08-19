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
        return "bg-emerald-50 text-emerald-805 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-350 dark:border-emerald-900/50";
      case "Partially Supplied":
        return "bg-blue-50 text-blue-805 border-blue-250 dark:bg-blue-950/20 dark:text-blue-350 dark:border-blue-900/50";
      case "Pending":
      case "Approved":
      default:
        return "bg-amber-50 text-amber-805 border-amber-250 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/50";
    }
  };

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between border-t-transparent! relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Premium top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
            <i className="pi pi-sync text-[#4F8F70]" />
            Printing Progress
          </h3>
        </div>
        <Button
          label="View All Orders"
          icon="list"
          onClick={() => navigate("/printing/orders/list")}
          className="p-button-sm self-start sm:self-auto text-xs py-1"
        />
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/80 text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 pb-2">
              <th className="py-2.5 pl-2">Order No.</th>
              <th className="py-2.5 font-bold">Book / Class</th>
              <th className="py-2.5 text-center font-bold">Quantity</th>
              <th className="py-2.5 text-center font-bold">Printed</th>
              <th className="py-2.5 text-center font-bold">Pending</th>
              <th className="py-2.5 text-center font-bold">Progress</th>
              <th className="py-2.5 pl-4 font-bold pr-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/40 dark:divide-gray-800/40 text-sm">
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
                  className="group hover:bg-[#E8F4EC]/35 dark:hover:bg-[#4F8F70]/5 cursor-pointer transition-colors duration-150"
                >
                  <td className="py-3.5 font-mono font-black text-sm text-[#4F8F70] group-hover:underline pl-2">
                    {o.orderNo}
                  </td>
                  <td className="py-3.5 font-extrabold text-slate-900 dark:text-gray-100">
                    {(o.bookTitle || "").includes(o.classLevel || "")
                      ? o.bookTitle || ""
                      : `${o.bookTitle || ""} - ${o.classLevel || ""}`}
                  </td>
                  <td className="py-3.5 text-center font-extrabold font-mono text-slate-900 dark:text-gray-200">
                    {o.requiredQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 text-center font-extrabold font-mono text-slate-900 dark:text-gray-200">
                    {o.suppliedQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 text-center font-extrabold font-mono text-slate-700 dark:text-gray-300">
                    {o.pendingQty.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center gap-2.5 justify-center w-full">
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shrink-0 shadow-inner border border-gray-200/10">
                        <div
                          className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-black text-slate-900 dark:text-white shrink-0 text-center w-10">
                        {progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pl-4 pr-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusBadgeClass(
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
