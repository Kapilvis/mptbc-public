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

const THEMES: Record<
  string,
  {
    cardClass: string;
    badgeClass: string;
    titleClass: string;
    valueClass: string;
    subtextClass: string;
    watermarkClass: string;
    glossClass: string;
  }
> = {
  blue: {
    cardClass:
      "bg-gradient-to-br from-blue-50/90 to-blue-100/40 dark:from-blue-950/40 dark:to-blue-900/10 border-blue-200/70 dark:border-blue-900/40 hover:shadow-blue-200/50 dark:hover:shadow-blue-950/20",
    badgeClass:
      "bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25 dark:from-blue-950/80 dark:to-blue-900/60 dark:text-blue-400 border border-blue-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-blue-500 dark:text-blue-400",
    glossClass: "via-blue-300/30 dark:via-blue-500/10",
  },
  purple: {
    cardClass:
      "bg-gradient-to-br from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-purple-900/10 border-purple-200/70 dark:border-purple-900/40 hover:shadow-purple-200/50 dark:hover:shadow-purple-950/20",
    badgeClass:
      "bg-gradient-to-tr from-purple-600 to-purple-500 text-white shadow-md shadow-purple-500/25 dark:from-purple-950/80 dark:to-purple-900/60 dark:text-purple-400 border border-purple-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-purple-500 dark:text-purple-400",
    glossClass: "via-purple-300/30 dark:via-purple-500/10",
  },
  green: {
    cardClass:
      "bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-emerald-900/10 border-emerald-200/70 dark:border-emerald-900/40 hover:shadow-emerald-200/50 dark:hover:shadow-emerald-950/20",
    badgeClass:
      "bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/25 dark:from-emerald-950/80 dark:to-emerald-900/60 dark:text-emerald-400 border border-emerald-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-emerald-500 dark:text-emerald-400",
    glossClass: "via-emerald-300/30 dark:via-emerald-500/10",
  },
  yellow: {
    cardClass:
      "bg-gradient-to-br from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-amber-900/10 border-amber-250/60 dark:border-amber-900/40 hover:shadow-amber-200/50 dark:hover:shadow-amber-950/20",
    badgeClass:
      "bg-gradient-to-tr from-amber-600 to-amber-505 text-white shadow-md shadow-amber-500/25 dark:from-amber-950/80 dark:to-amber-900/60 dark:text-amber-400 border border-amber-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-amber-500 dark:text-amber-400",
    glossClass: "via-amber-300/30 dark:via-amber-500/10",
  },
  teal: {
    cardClass:
      "bg-gradient-to-br from-teal-50/90 to-teal-100/40 dark:from-teal-950/40 dark:to-teal-900/10 border-teal-200/70 dark:border-teal-900/40 hover:shadow-teal-200/50 dark:hover:shadow-teal-950/20",
    badgeClass:
      "bg-gradient-to-tr from-teal-600 to-teal-505 text-white shadow-md shadow-teal-500/25 dark:from-teal-950/80 dark:to-teal-900/60 dark:text-teal-400 border border-teal-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-teal-550 dark:text-teal-400",
    glossClass: "via-teal-300/30 dark:via-teal-500/10",
  },
  indigo: {
    cardClass:
      "bg-gradient-to-br from-indigo-50/90 to-indigo-100/40 dark:from-indigo-950/40 dark:to-indigo-900/10 border-indigo-200/70 dark:border-indigo-900/40 hover:shadow-indigo-200/50 dark:hover:shadow-indigo-950/20",
    badgeClass:
      "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 dark:from-indigo-950/80 dark:to-indigo-900/60 dark:text-indigo-400 border border-indigo-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-indigo-500 dark:text-indigo-400",
    glossClass: "via-indigo-300/30 dark:via-indigo-500/10",
  },
  red: {
    cardClass:
      "bg-gradient-to-br from-rose-50/90 to-rose-100/40 dark:from-rose-950/40 dark:to-rose-900/10 border-rose-200/70 dark:border-rose-900/40 hover:shadow-rose-200/50 dark:hover:shadow-rose-950/20",
    badgeClass:
      "bg-gradient-to-tr from-rose-600 to-rose-505 text-white shadow-md shadow-rose-500/25 dark:from-rose-950/80 dark:to-rose-900/60 dark:text-rose-400 border border-rose-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-rose-500 dark:text-rose-400",
    glossClass: "via-rose-300/30 dark:via-rose-500/10",
  },
  orange: {
    cardClass:
      "bg-gradient-to-br from-orange-50/90 to-orange-100/40 dark:from-orange-950/40 dark:to-orange-900/10 border-orange-200/70 dark:border-orange-900/40 hover:shadow-orange-200/50 dark:hover:shadow-orange-950/20",
    badgeClass:
      "bg-gradient-to-tr from-orange-600 to-orange-500 text-white shadow-md shadow-orange-500/25 dark:from-orange-950/80 dark:to-orange-900/60 dark:text-orange-400 border border-orange-400/20",
    titleClass: "text-slate-700 dark:text-slate-205 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    subtextClass: "text-slate-600 dark:text-slate-400 font-extrabold",
    watermarkClass: "text-orange-500 dark:text-orange-400",
    glossClass: "via-orange-300/30 dark:via-orange-500/10",
  },
};

export default function PrinterKpiCards({ stats }: Props) {
  const row1 = [
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: "pi pi-file",
      badgeType: "blue",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: "pi pi-sync",
      badgeType: "purple",
    },
    {
      title: "Books Printed",
      value: stats.booksPrinted.toLocaleString("en-IN"),
      icon: "pi pi-print",
      badgeType: "green",
    },
    {
      title: "Books Pending",
      value: stats.booksPending.toLocaleString("en-IN"),
      icon: "pi pi-clock",
      badgeType: "yellow",
    },
  ];

  const row2 = [
    {
      title: "Paper Allocated",
      value: `${Math.round(stats.paperAllocated)} MT`,
      icon: "pi pi-file-edit",
      badgeType: "teal",
    },
    {
      title: "Paper Received",
      value: `${Math.round(stats.paperReceived)} MT`,
      icon: "pi pi-download",
      badgeType: "indigo",
    },
    {
      title: "Pending Book Supply",
      value: stats.supplyPending.toLocaleString("en-IN"),
      icon: "pi pi-truck",
      badgeType: "red",
    },
    {
      title: "Paper Consumed",
      value: `${Math.round(stats.paperConsumed)} MT`,
      icon: "pi pi-box",
      badgeType: "orange",
    },
  ];

  const renderCard = (m: (typeof row1)[0], idx: number) => {
    const theme = THEMES[m.badgeType] || THEMES.blue;
    return (
      <div
        key={idx}
        className={`group relative overflow-hidden rounded-2xl p-4.5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl border ${theme.cardClass}`}
      >
        {/* Glassmorphic Top Highlight Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent ${theme.glossClass} to-transparent z-10`}
        />

        {/* Background Watermark Icon */}
        <i
          className={`${m.icon} absolute -bottom-5 -right-5 text-8xl opacity-[0.05] dark:opacity-[0.03] pointer-events-none transition-all duration-700 ease-out group-hover:rotate-12 group-hover:scale-125 ${theme.watermarkClass}`}
          aria-hidden="true"
        />

        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center shrink-0 border ${theme.badgeClass}`}
          >
            <i className={`${m.icon} text-base`} />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className={`text-[10px] uppercase tracking-wider block truncate ${theme.titleClass}`}
            >
              {m.title}
            </span>
            <span
              className={`text-[25px] block mt-0.5 font-mono ${theme.valueClass}`}
            >
              {m.value}
            </span>
          </div>
        </div>
      </div>
    );
  };

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
