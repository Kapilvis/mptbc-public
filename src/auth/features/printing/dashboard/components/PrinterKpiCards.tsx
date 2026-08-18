import { Card } from "shared/components/panels";

interface Stats {
  activeOrders: number;
  inProgress: number;
  booksPrinted: number;
  booksPending: number;
  paperAllocated: number;
  paperReceived: number;
  paperConsumed: number;
  supplyPending: number;
}

interface Props {
  stats: Stats;
}

export default function PrinterKpiCards({ stats }: Props) {
  const row1 = [
    {
      title: "Active Orders",
      value: stats.activeOrders,
      subText: "↑ 2 this week",
      icon: "pi pi-file",
      badgeType: "blue",
      badgeClass:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-350 border-blue-100",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      subText: "58% of total",
      icon: "pi pi-sync",
      badgeType: "purple",
      badgeClass:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-350 border-purple-100",
    },
    {
      title: "Books Printed",
      value: stats.booksPrinted.toLocaleString("en-IN"),
      subText: "↑ 12.4%",
      icon: "pi pi-print",
      badgeType: "green",
      badgeClass:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-350 border-emerald-100",
    },
    {
      title: "Books Pending",
      value: stats.booksPending.toLocaleString("en-IN"),
      subText: "↓ 8.2%",
      icon: "pi pi-clock",
      badgeType: "yellow",
      badgeClass:
        "bg-amber-50 text-amber-750 dark:bg-amber-950/30 dark:text-amber-350 border-amber-100",
    },
  ];

  const row2 = [
    {
      title: "Paper Allocated",
      value: `${stats.paperAllocated.toFixed(2)} MT`,
      subText: "For current FY orders",
      icon: "pi pi-file-edit",
      badgeType: "blue",
      badgeClass:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-350 border-blue-100",
    },
    {
      title: "Paper Received",
      value: `${stats.paperReceived.toFixed(2)} MT`,
      subText: "78.2% of allocation",
      icon: "pi pi-download",
      badgeType: "green",
      badgeClass:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-350 border-emerald-100",
    },
    {
      title: "Supply Pending",
      value: stats.supplyPending.toLocaleString("en-IN"),
      subText: "Awaiting dispatch challan",
      icon: "pi pi-truck",
      badgeType: "red",
      badgeClass:
        "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-350 border-rose-100",
    },
    {
      title: "Paper Consumed",
      value: `${stats.paperConsumed.toFixed(2)} MT`,
      subText: "73.7% of received",
      icon: "pi pi-box",
      badgeType: "yellow",
      badgeClass:
        "bg-amber-50 text-amber-750 dark:bg-amber-950/30 dark:text-amber-350 border-amber-100",
    },
  ];

  const renderCard = (m: (typeof row1)[0], idx: number) => (
    <Card
      key={idx}
      className="relative overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200/60 dark:border-gray-700/60 shadow-xs"
    >
      <div className="p-3.5 flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${m.badgeClass}`}
        >
          <i className={`${m.icon} text-lg`} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-gray-550 dark:text-gray-400 block truncate">
            {m.title}
          </span>
          <span className="text-2xl font-black tracking-tight text-gray-800 dark:text-white block mt-0.5 font-mono">
            {m.value}
          </span>
          <span className="text-[10px] font-bold text-gray-400 block mt-1">
            {m.subText}
          </span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {row1.map(renderCard)}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {row2.map(renderCard)}
      </div>
    </div>
  );
}
