import type { Chart as ChartJS, TooltipItem } from "chart.js";
import { CheckCircle, Truck } from "lucide-react";
import { Chart } from "primereact/chart";
import { Card } from "shared/components/panels";

interface CustomArcElement {
  tooltipPosition?: () => { x: number; y: number };
  x: number;
  y: number;
}

export function DemandApprovalPipelineWidget() {
  const doughnutSliceLabelsPlugin = {
    id: "doughnutSliceLabels",
    afterDraw(chart: ChartJS) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta || !meta.data) return;
        const dataArr = (dataset.data || []) as number[];
        const total = dataArr.reduce((a: number, b: number) => a + b, 0);
        if (total <= 0) return;

        meta.data.forEach((element: object, index: number) => {
          const value = dataArr[index] || 0;
          const pct = Math.round((value / total) * 100);
          if (pct < 3) return;

          const el = element as CustomArcElement;
          const pos = el.tooltipPosition
            ? el.tooltipPosition()
            : { x: el.x, y: el.y };

          ctx.save();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
          ctx.shadowBlur = 3;
          ctx.fillText(`${pct}%`, pos.x, pos.y);
          ctx.restore();
        });
      });
    },
  };

  // --- Approved Demand Chart Data ---
  const approvedChartData = {
    labels: ["RSK", "DPI", "Open Market", "Special"],
    datasets: [
      {
        data: [160000, 120000, 75000, 35000],
        backgroundColor: ["#3b82f6", "#10b981", "#ffb84d", "#8b5cf6"],
        hoverOffset: 6,
        borderRadius: 6,
        borderWidth: 3,
        borderColor: "#ffffff",
        spacing: 4,
      },
    ],
  };

  const approvedChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutout: "60%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const total = 390000;
            const rawVal = (context.raw as number) || 0;
            const pct = Math.round((rawVal / total) * 100);
            return ` ${context.label}: ${rawVal.toLocaleString()} Approved (${pct}%)`;
          },
        },
      },
    },
  };

  // --- Print and received at depot Chart Data ---
  const depotChartData = {
    labels: ["RSK", "DPI", "Open Market", "Special"],
    datasets: [
      {
        data: [75000, 55000, 35000, 15500],
        backgroundColor: ["#3b82f6", "#10b981", "#ffb84d", "#8b5cf6"],
        hoverOffset: 6,
        borderRadius: 6,
        borderWidth: 3,
        borderColor: "#ffffff",
        spacing: 4,
      },
    ],
  };

  const depotChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutout: "60%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const total = 180500;
            const rawVal = (context.raw as number) || 0;
            const pct = Math.round((rawVal / total) * 100);
            return ` ${context.label}: ${rawVal.toLocaleString()} Received (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="mb-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
        <div className="flex gap-4 items-center">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-[10px]">
            <i className="pi pi-chart-pie text-xl" />
          </div>
          <div>
            <h3 className="text-[15px] font-black text-black uppercase tracking-wide">
              Approved demand and Print Analytics
            </h3>
          </div>
        </div>
        <button className="text-black hover:text-gray-800 p-1">
          <i className="pi pi-ellipsis-v text-[15px]" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 pb-2">
        {/* LEFT COLUMN: APPROVED DEMAND */}
        <div className="flex flex-col xl:flex-row items-center gap-6 justify-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0">
            <Chart
              type="doughnut"
              data={approvedChartData}
              options={approvedChartOptions}
              plugins={[doughnutSliceLabelsPlugin]}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-0.5">
              <CheckCircle size={20} className="text-emerald-600 mb-1" />
              <span className="text-[18px] font-extrabold text-slate-900 leading-tight tracking-tight">
                3,90,000
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Approved Demand
              </span>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center max-w-[240px]">
            {[
              {
                name: "RSK",
                percent: "41%",
                value: "1,60,000",
                hexColor: "#3b82f6",
                pillBg: "bg-blue-100",
                pillText: "text-blue-900",
              },
              {
                name: "DPI",
                percent: "31%",
                value: "1,20,000",
                hexColor: "#10b981",
                pillBg: "bg-emerald-100",
                pillText: "text-emerald-900",
              },
              {
                name: "Open Market",
                percent: "19%",
                value: "75,000",
                hexColor: "#ffb84d",
                pillBg: "bg-amber-100/90",
                pillText: "text-amber-900",
              },
              {
                name: "Special",
                percent: "9%",
                value: "35,000",
                hexColor: "#8b5cf6",
                pillBg: "bg-purple-100",
                pillText: "text-purple-900",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-slate-200/60 border-dashed last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.hexColor }}
                  />
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="text-[13px] font-extrabold text-slate-800">
                      {item.name}
                    </div>
                    <div
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${item.pillBg} ${item.pillText} leading-none`}
                    >
                      {item.percent}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-black text-slate-900">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PRINT AND RECEIVED AT DEPOT */}
        <div className="flex flex-col xl:flex-row items-center gap-6 justify-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0">
            <Chart
              type="doughnut"
              data={depotChartData}
              options={depotChartOptions}
              plugins={[doughnutSliceLabelsPlugin]}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-0.5">
              <Truck size={20} className="text-blue-600 mb-1" />
              <span className="text-[18px] font-extrabold text-slate-900 leading-tight tracking-tight">
                1,80,500
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center px-2 leading-tight mt-0.5">
                Print & received
                <br />
                at depot
              </span>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center max-w-[240px]">
            {[
              {
                name: "RSK",
                percent: "42%",
                value: "75,000",
                hexColor: "#3b82f6",
                pillBg: "bg-blue-100",
                pillText: "text-blue-900",
              },
              {
                name: "DPI",
                percent: "30%",
                value: "55,000",
                hexColor: "#10b981",
                pillBg: "bg-emerald-100",
                pillText: "text-emerald-900",
              },
              {
                name: "Open Market",
                percent: "19%",
                value: "35,000",
                hexColor: "#ffb84d",
                pillBg: "bg-amber-100/90",
                pillText: "text-amber-900",
              },
              {
                name: "Special",
                percent: "9%",
                value: "15,500",
                hexColor: "#8b5cf6",
                pillBg: "bg-purple-100",
                pillText: "text-purple-900",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-slate-200/60 border-dashed last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.hexColor }}
                  />
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="text-[13px] font-extrabold text-slate-800">
                      {item.name}
                    </div>
                    <div
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${item.pillBg} ${item.pillText} leading-none`}
                    >
                      {item.percent}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-black text-slate-900">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
