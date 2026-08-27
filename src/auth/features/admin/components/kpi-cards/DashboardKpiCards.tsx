import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Chart as ChartJS } from "chart.js";
import {
  FileText,
  Printer,
  Warehouse,
  Settings,
  Truck,
  CreditCard,
  AlertTriangle,
  IndianRupee,
  Users,
  Scale,
  CheckSquare,
  Inbox,
  TrendingUp,
  Package,
} from "lucide-react";
import { Chart } from "primereact/chart";
import { BaseKpiCard } from "./BaseKpiCard";
import { mockDashboardData } from "../../data/mockKpiData";
import { DemandBreakdownModal } from "../modals/DemandBreakdownModal";
import { PaperGsmModal } from "../modals/PaperGsmModal";

export const DemandKpiCard: React.FC = () => {
  const data = mockDashboardData.demand;

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string;
  }>({ isOpen: false, type: "" });

  interface DemandConfigItem {
    title: string;
    data: Record<string, unknown>[];
    columns: Controls.ColumnProps<Record<string, unknown>>[];
    chartType?: "bar" | "doughnut";
    labels?: string[];
    vals?: number[];
  }

  const configs: Record<string, DemandConfigItem> = {
    class: {
      title: "Group Class Wise Demand",
      data: (data.classesModal || []) as unknown as Record<string, unknown>[],
      columns: [
        { field: "classGroup", header: "Class" },
        { field: "demand", header: "Demand" },
      ],
    },
    stream: {
      title: "Stream Wise Demand",
      data: (data.streamsModal || []) as unknown as Record<string, unknown>[],
      columns: [
        { field: "stream", header: "Stream" },
        { field: "demand", header: "Demand" },
      ],
    },
    gsm: {
      title: "GSM Wise Demand",
      data: (data.gsmModal || []) as unknown as Record<string, unknown>[],
      columns: [
        { field: "gsm", header: "GSM" },
        { field: "demand", header: "Demand" },
      ],
    },
    bookType: {
      title: "Book Type Wise Demand",
      data: (data.bookTypesModal || []) as unknown as Record<string, unknown>[],
      columns: [
        { field: "bookType", header: "Book Type" },
        { field: "demand", header: "Demand" },
        { field: "share", header: "% Share" },
      ],
    },
    medium: {
      title: "Medium Wise Demand",
      data: (data.mediumsModal || []) as unknown as Record<string, unknown>[],
      columns: [
        { field: "medium", header: "Medium" },
        { field: "demand", header: "Demand" },
        { field: "share", header: "% Share" },
      ],
    },
    detailedClass: {
      title: "Class Wise Demand",
      data: (data.detailedClassesModal || []) as unknown as Record<
        string,
        unknown
      >[],
      columns: [
        { field: "className", header: "CLASS" },
        { field: "demand", header: "DEMAND" },
        { field: "approved", header: "APPROVED" },
        { field: "pending", header: "PENDING" },
      ],
    },
  };

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

        meta.data.forEach((element: unknown, index: number) => {
          const value = dataArr[index] || 0;
          const pct = Math.round((value / total) * 100);
          if (pct < 3) return;

          const el = element as {
            x: number;
            y: number;
            tooltipPosition?: () => { x: number; y: number };
          };
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

  const deptChartData = {
    labels: ["RSK", "DPI", "Open Market", "Special"],
    datasets: [
      {
        data: [180000, 135000, 90000, 45000],
        backgroundColor: ["#3b82f6", "#10b981", "#ffb84d", "#8b5cf6"],
        hoverOffset: 6,
        borderRadius: 6,
        borderWidth: 3,
        borderColor: "#ffffff",
        spacing: 4,
      },
    ],
  };

  const deptChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; raw: number }) => {
            const total = 450000;
            const pct = Math.round((context.raw / total) * 100);
            return ` ${context.label}: ${context.raw.toLocaleString()} Demand (${pct}%)`;
          },
        },
      },
    },
  };

  const activeConfig = modalState.type
    ? configs[modalState.type]
    : configs.class;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Master DEMAND RECEIVED Section Card */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-black uppercase tracking-wider">
                Demand Received
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-black/10 text-black shadow-xs">
                In Books
              </span>
            </div>
          </div>
        </div>

        {/* 1. Stat strip (6 standalone cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* 1. Total Demand */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-2.5 min-h-[84px]">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
              <FileText size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-0.5 leading-tight whitespace-normal">
                Total Demand
              </span>
              <span className="text-[18px] font-extrabold text-blue-600 leading-none mb-0.5">
                {data.totalDemand}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* 2. Demand Approval */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-2.5 min-h-[84px]">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
              <CheckSquare size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-0.5 leading-tight whitespace-normal">
                Demand Approved
              </span>
              <span className="text-[18px] font-extrabold text-emerald-600 leading-none mb-0.5">
                {data.demandApproved}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* 3. Under Approval */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-2.5 min-h-[84px]">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
              <Inbox size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-0.5 leading-tight whitespace-normal">
                Under Approval
              </span>
              <span className="text-[18px] font-extrabold text-amber-600 leading-none mb-0.5">
                {data.underApproval?.value || "60,000"}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* 4. Last Year (YOY) */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-2.5 min-h-[84px]">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
              <TrendingUp size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-0.5 leading-tight whitespace-normal">
                Last Year (YOY)
              </span>
              <span className="text-[18px] font-extrabold text-purple-600 flex items-center gap-1 leading-none mb-0.5">
                <i className="pi pi-arrow-up text-[13px] text-purple-600"></i>
                {data.lastYearComparison?.value || "+5.39%"}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Growth
              </span>
            </div>
          </div>

          {/* 5. Opening Stock in Depot (5th KPI) */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-2.5 min-h-[84px]">
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg shrink-0 mt-0.5">
              <Warehouse size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-0.5 leading-tight whitespace-normal">
                Opening Stock in Depots
              </span>
              <span className="text-[18px] font-extrabold text-teal-600 leading-none mb-0.5">
                {data.openingStockDepot || "30,500"}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* 6. Actual Requirement (6th KPI: Approved - Opening) */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-2.5 min-h-[84px]">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
              <Package size={18} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-0.5 leading-tight whitespace-normal">
                Demand For Work Order
              </span>
              <span className="text-[18px] font-extrabold text-indigo-600 leading-none mb-0.5">
                {data.actualRequirement || "3,59,500"}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>
        </div>

        {/* 2. Middle Sub-grid (Last 3 Year, View Demand, Dept Wise Demand) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left Column (Trends) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Last 3 Year Demand */}
            <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-extrabold text-slate-800 mb-4 flex items-center gap-2.5 uppercase tracking-wide">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 flex items-center justify-center">
                  <i className="pi pi-chart-bar text-sm" />
                </div>
                <span>Last 3 Year Demand</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-black mb-1.5 shadow-2xs">
                    2025
                  </span>
                  <div className="text-sm font-black text-black tracking-tight flex items-center justify-center gap-1 flex-wrap">
                    <span>4,27,000</span>
                    <span className="text-[10px] font-black text-emerald-600 inline-flex items-center gap-0.5">
                      <i className="pi pi-arrow-up text-[8px]"></i>+1.43%
                    </span>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-black mb-1.5 shadow-2xs">
                    2024
                  </span>
                  <div className="text-sm font-black text-black tracking-tight flex items-center justify-center gap-1 flex-wrap">
                    <span>4,21,000</span>
                    <span className="text-[10px] font-black text-emerald-600 inline-flex items-center gap-0.5">
                      <i className="pi pi-arrow-up text-[8px]"></i>+2.43%
                    </span>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-black mb-1.5 shadow-2xs">
                    2023
                  </span>
                  <div className="text-sm font-black text-black tracking-tight flex items-center justify-center gap-1 flex-wrap">
                    <span>4,11,000</span>
                    <span className="text-[10px] font-bold text-gray-400">
                      (Base)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Demand Card */}
            <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 mb-4 flex items-center gap-2.5 uppercase tracking-wide">
                  <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                    <i className="pi pi-list text-sm" />
                  </div>
                  <span className="bg-linear-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent font-extrabold">
                    View Demand
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "class",
                      label: "Group Class Wise",
                      textColor: "text-indigo-600 group-hover:text-indigo-700",
                      bgColor:
                        "bg-indigo-50/70 hover:bg-indigo-100/80 border-indigo-200/80",
                      arrowColor: "text-indigo-400 group-hover:text-indigo-600",
                    },
                    {
                      id: "detailedClass",
                      label: "Class Wise",
                      textColor: "text-blue-600 group-hover:text-blue-700",
                      bgColor:
                        "bg-blue-50/70 hover:bg-blue-100/80 border-blue-200/80",
                      arrowColor: "text-blue-400 group-hover:text-blue-600",
                    },
                    {
                      id: "stream",
                      label: "Stream Wise",
                      textColor:
                        "text-emerald-600 group-hover:text-emerald-700",
                      bgColor:
                        "bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200/80",
                      arrowColor:
                        "text-emerald-400 group-hover:text-emerald-600",
                    },
                    {
                      id: "medium",
                      label: "Medium Wise",
                      textColor: "text-amber-600 group-hover:text-amber-700",
                      bgColor:
                        "bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/80",
                      arrowColor: "text-amber-400 group-hover:text-amber-600",
                    },
                    {
                      id: "gsm",
                      label: "GSM Wise",
                      textColor: "text-purple-600 group-hover:text-purple-700",
                      bgColor:
                        "bg-purple-50/70 hover:bg-purple-100/80 border-purple-200/80",
                      arrowColor: "text-purple-400 group-hover:text-purple-600",
                    },
                    {
                      id: "bookType",
                      label: "Book Type Wise",
                      textColor: "text-cyan-700 group-hover:text-cyan-800",
                      bgColor:
                        "bg-cyan-50/70 hover:bg-cyan-100/80 border-cyan-200/80",
                      arrowColor: "text-cyan-500 group-hover:text-cyan-700",
                    },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() =>
                        setModalState({ isOpen: true, type: btn.id })
                      }
                      className={`flex items-center justify-between rounded-xl border ${btn.bgColor} px-3.5 py-2.5 text-xs font-semibold transition-all text-left shadow-2xs group cursor-pointer`}
                    >
                      <span className={btn.textColor}>{btn.label}</span>
                      <i
                        className={`pi pi-chevron-right text-xs ${btn.arrowColor} group-hover:translate-x-0.5 transition-transform`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() =>
                    setModalState({ isOpen: true, type: "detailedClass" })
                  }
                  className="w-full rounded-xl bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 p-[1.5px] transition-all group shadow-xs cursor-pointer"
                >
                  <div className="w-full h-full bg-white hover:bg-slate-50/80 rounded-[10.5px] py-2.5 px-4 flex items-center justify-between transition-colors">
                    <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-xs">
                      Demand Approval Status
                    </span>
                    <i className="pi pi-arrow-right text-xs text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Department Pie Chart) */}
          <div className="lg:col-span-7 bg-white border border-blue-100 rounded-[10px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-[10px]">
                  <i className="pi pi-chart-pie text-xl" />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-black uppercase tracking-wide">
                    Demand Analytics
                  </h3>
                </div>
              </div>
              <button className="text-black hover:text-gray-800 p-1">
                <i className="pi pi-ellipsis-v text-[15px]" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-10 flex-1 px-2 pb-2">
              {/* Chart Area with center text */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 shrink-0 ml-2">
                <Chart
                  type="doughnut"
                  data={deptChartData}
                  options={deptChartOptions}
                  plugins={[doughnutSliceLabelsPlugin]}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-0.5">
                  <Users size={20} className="text-slate-600 mb-1" />
                  <span className="text-[20px] font-extrabold text-slate-900 leading-tight tracking-tight">
                    4,50,000
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Demand
                  </span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="flex-1 w-full flex flex-col justify-center">
                {[
                  {
                    name: "RSK",
                    percent: "40%",
                    value: "1,80,000",
                    hexColor: "#3b82f6",
                    pillBg: "bg-blue-100",
                    pillText: "text-blue-900",
                  },
                  {
                    name: "DPI",
                    percent: "30%",
                    value: "1,35,000",
                    hexColor: "#10b981",
                    pillBg: "bg-emerald-100",
                    pillText: "text-emerald-900",
                  },
                  {
                    name: "Open Market",
                    percent: "20%",
                    value: "90,000",
                    hexColor: "#ffb84d",
                    pillBg: "bg-amber-100/90",
                    pillText: "text-amber-900",
                  },
                  {
                    name: "Special",
                    percent: "10%",
                    value: "45,000",
                    hexColor: "#8b5cf6",
                    pillBg: "bg-purple-100",
                    pillText: "text-purple-900",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-3 border-b border-slate-100 border-dashed last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.hexColor }}
                      />
                      <div className="flex flex-col items-start gap-1">
                        <div className="text-[13px] font-extrabold text-slate-800">
                          {item.name}
                        </div>
                        <div
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${item.pillBg} ${item.pillText} leading-none`}
                        >
                          {item.percent}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-black text-slate-900">
                        {item.value}
                      </div>
                      <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                        Demand
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemandBreakdownModal
        visible={modalState.isOpen}
        onHide={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={activeConfig.title}
        data={activeConfig.data}
        columns={activeConfig.columns}
        chartType={activeConfig.chartType}
        chartLabels={activeConfig.labels}
        chartDataVals={activeConfig.vals}
        chartLabel="Demand"
      />
    </div>
  );
};

export const PaperAnalysisKpiCard: React.FC = () => {
  const data = mockDashboardData.paperAnalysis;
  const navigate = useNavigate();
  const [isGsmModalOpen, setGsmModalOpen] = useState(false);

  return (
    <BaseKpiCard title="Paper & Books Analysis" theme="green" icon={FileText}>
      <div className="flex flex-col gap-2 flex-1">
        {/* Total Required */}
        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
            Total Required
          </span>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-slate-900">
              3,767 MT
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              3,90,000 Books
            </span>
          </div>
        </div>

        {/* Opening Stock */}
        <div className="flex justify-between items-center px-3 py-2 bg-blue-50/60 border border-blue-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-blue-900 uppercase tracking-wide">
              Opening Stock
            </span>
            <span className="text-[10px] font-medium text-blue-600/90">
              (as on 1-Jan-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-blue-800">60 MT</span>
            <span className="text-[11px] font-medium text-blue-600">
              30,500 Books
            </span>
          </div>
        </div>

        {/* Actual Requirement (NEW - right below Opening Stock) */}
        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/70 border border-purple-200/80 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-purple-950 uppercase tracking-wide">
              Demand For Work Order
            </span>
            <span className="text-[10px] font-medium text-purple-700/90">
              (as on 1-Jan-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-purple-900">
              3,707 MT
            </span>
            <span className="text-[11px] font-medium text-purple-700">
              3,59,500 Books
            </span>
          </div>
        </div>

        {/* Received Stock */}
        <div className="flex justify-between items-center px-3 py-2 bg-indigo-50/60 border border-indigo-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-indigo-900 uppercase tracking-wide">
              Received Stock
            </span>
            <span className="text-[10px] font-medium text-indigo-600/90">
              (last received: 17-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-indigo-800">
              3,165 MT
            </span>
            <span className="text-[11px] font-medium text-indigo-600">
              1,80,500 Books
            </span>
          </div>
        </div>

        {/* Return Stock */}
        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
              Return Stock
            </span>
            <span className="text-[10px] font-medium text-amber-700/80">
              (Return on 1-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-amber-800">10 MT</span>
            <span className="text-[11px] font-medium text-amber-700">
              1,000 Books
            </span>
          </div>
        </div>

        {/* Available Stock */}
        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
              Available Stock
            </span>
            <span className="text-[10px] font-medium text-emerald-700/80">
              (as on 23-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-emerald-800">
              602 MT
            </span>
            <span className="text-[11px] font-medium text-emerald-700">
              62,350 Books
            </span>
          </div>
        </div>

        {/* Need To Purchase */}
        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/60 border border-purple-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-purple-900 uppercase tracking-wide">
              Need To Purchase / Print
            </span>
            <span className="text-[10px] font-medium text-purple-600/90">
              (since 10-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-purple-800">
              602 MT
            </span>
            <span className="text-[11px] font-medium text-purple-700">
              62,350 Books
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={() => setGsmModalOpen(true)}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>GSM wise paper - MT</span>
          <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-800">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
        <button
          onClick={() => navigate("/paper")}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-800 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>View Tender Work Order</span>
          <span className="flex items-center gap-1 text-slate-700 font-semibold">
            {data.workOrdersPending?.value || "2 Pending"}{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>

      <PaperGsmModal
        visible={isGsmModalOpen}
        onHide={() => setGsmModalOpen(false)}
        data={data.gsmModal || []}
      />
    </BaseKpiCard>
  );
};

export const PrinterProfileKpiCard: React.FC<{ onOpenModal: () => void }> = ({
  onOpenModal,
}) => {
  const data = mockDashboardData.printerProfile;
  return (
    <BaseKpiCard
      title="Printer Profile"
      badge="In Numbers"
      theme="orange"
      icon={Printer}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
            Total Printers
          </span>
          <span className="text-[13px] font-bold text-amber-800">
            {data.totalPrinters}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-orange-50/60 border border-orange-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-orange-900 uppercase tracking-wide">
            Total Capacity
          </span>
          <span className="text-[13px] font-bold text-orange-800">
            {data.totalCapacity || "6,00,000 Books"}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
            Current Capacity Utilization
          </span>
          <span className="text-[13px] font-bold text-slate-900">
            {data.currentCapacity || "3,59,500 Books"}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-blue-50/60 border border-blue-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-blue-900 uppercase tracking-wide">
            Capacity Utilization
          </span>
          <span className="text-[13px] font-bold text-blue-800">
            {`${data.capacityUtilization}%`}
          </span>
        </div>
      </div>
      <div className="mt-4 bg-slate-50/70 rounded-xl border border-slate-200/90 p-3 shadow-2xs">
        <p className="text-[11px] text-slate-700 font-extrabold mb-2 uppercase tracking-wide">
          Top Capacity Printers
        </p>
        <div className="flex flex-col gap-1.5">
          {data.maxCapacityPrinters.slice(0, 2).map((p) => (
            <div key={p.id} className="flex justify-between text-xs py-0.5">
              <span className="font-bold text-slate-800">{p.name}</span>
              <span className="font-extrabold text-slate-900">
                {p.capacity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={onOpenModal}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[13px] font-bold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-800">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>
    </BaseKpiCard>
  );
};

export const CentralDepotKpiCard: React.FC = () => {
  const data = mockDashboardData.centralDepot;
  const [isGsmModalOpen, setGsmModalOpen] = useState(false);

  // Map the mock data to fit the PaperGsmModal structure
  const modalData = (data.gsmBreakdown || []).map((item) => ({
    gsm: item.type,
    quantity: item.stock,
  }));

  return (
    <BaseKpiCard
      title="Central Paper Depot"
      badge="In MT"
      theme="purple"
      icon={Warehouse}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/60 border border-purple-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-purple-900 uppercase tracking-wide">
            Opening Stock
          </span>
          <span className="text-[13px] font-bold text-purple-800">
            {data.openingStock}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-blue-50/60 border border-blue-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-blue-900 uppercase tracking-wide">
            Received This Year
          </span>
          <span className="text-[13px] font-bold text-blue-800">
            {data.receivedThisYear}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-indigo-50/60 border border-indigo-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-indigo-900 uppercase tracking-wide">
            Dispatched to Printer
          </span>
          <span className="text-[13px] font-bold text-indigo-800">
            {data.dispatchedToPrinter}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
            Closing Stock
          </span>
          <span className="text-[13px] font-bold text-emerald-800">
            {data.closingStock}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={() => setGsmModalOpen(true)}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[13px] font-bold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>View GSM wise stock summary</span>
          <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-800">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>

      <PaperGsmModal
        visible={isGsmModalOpen}
        onHide={() => setGsmModalOpen(false)}
        data={modalData}
      />
    </BaseKpiCard>
  );
};

export const PrintingProgressKpiCard: React.FC<{ onOpenModal: () => void }> = ({
  onOpenModal,
}) => {
  const data = mockDashboardData.printingProgress;
  return (
    <BaseKpiCard
      title="Printing Progress"
      badge="In Numbers"
      theme="orange"
      icon={Settings}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
              Total Printer
            </span>
            <span className="text-[10px] font-medium text-amber-700/80 normal-case">
              (as per rate contract)
            </span>
          </div>
          <span className="text-[13px] font-bold text-amber-800">
            {data.totalPrinters}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
              Total Target
            </span>
            <span className="text-[10px] font-medium text-slate-500 normal-case">
              (as per work order)
            </span>
          </div>
          <span className="text-[13px] font-bold text-slate-900">
            {data.totalBooksTarget}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-blue-50/60 border border-blue-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-blue-900 uppercase tracking-wide">
              Dispatch
            </span>
            <span className="text-[10px] font-medium text-blue-600/90 normal-case">
              (printer to depot)
            </span>
          </div>
          <span className="text-[13px] font-bold text-blue-800">
            {data.dispatchCount}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-indigo-50/60 border border-indigo-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-indigo-900 uppercase tracking-wide">
              Total Inspection
            </span>
          </div>
          <span className="text-[13px] font-bold text-indigo-800">
            {data.totalInspections}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
              QA (Passed)
            </span>
          </div>
          <span className="text-[13px] font-bold text-emerald-800">
            {data.qaPassed}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
              Pending
            </span>
            <span className="text-[10px] font-medium text-slate-500 normal-case">
              (from printer)
            </span>
          </div>
          <span className="text-[13px] font-bold text-slate-800">
            {data.pending}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/60 border border-purple-100/90 rounded-xl shadow-2xs">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-purple-900 uppercase tracking-wide">
              Total Transporter
            </span>
          </div>
          <span className="text-[13px] font-bold text-purple-800">
            {data.totalTransporter}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={onOpenModal}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[13px] font-bold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-800">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>
    </BaseKpiCard>
  );
};

export const DistributionKpiCard: React.FC = () => {
  const data = mockDashboardData.distribution;
  return (
    <BaseKpiCard
      title="Distribution from Depot"
      badge="In Numbers"
      theme="violet"
      icon={Truck}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-violet-50/60 border border-violet-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-violet-900 uppercase tracking-wide">
            Received from printer
          </span>
          <span className="text-[13px] font-bold text-violet-800">
            {data.received}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
            Dispatch to block
          </span>
          <span className="text-[13px] font-bold text-emerald-800">
            {data.delivered}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
            In transit to block
          </span>
          <span className="text-[13px] font-bold text-amber-800">
            {data.inTransit?.value || "10,500"}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
            Pending for dispatch
          </span>
          <span className="text-[13px] font-bold text-slate-900">
            {data.pending}
          </span>
        </div>
      </div>
    </BaseKpiCard>
  );
};

export const BillAndPaymentKpiCard: React.FC<{
  onOpenPaperModal: () => void;
  onOpenPrinterModal: () => void;
}> = ({ onOpenPaperModal, onOpenPrinterModal }) => {
  const paperData = mockDashboardData.billAndPayment.paper;
  const printerData = mockDashboardData.billAndPayment.printer;
  const othersData = mockDashboardData.billAndPayment.others;

  return (
    <BaseKpiCard
      title="Bill & Payment"
      badge="In Amount"
      theme="teal"
      icon={CreditCard}
    >
      <div className="flex flex-col flex-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-100/90 py-2 px-2.5 border border-slate-200/90 rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">
          <div className="col-span-4 pr-2"></div>
          <div className="col-span-2 text-right px-1.5">Total</div>
          <div className="col-span-2 text-right px-1.5">Paper</div>
          <div className="col-span-2 text-right px-1.5">Printer</div>
          <div className="col-span-2 text-right pl-1.5">Other</div>
        </div>

        {/* Total Work Orders */}
        <div className="grid grid-cols-12 py-2 px-2.5 bg-slate-50/90 border border-slate-200/80 rounded-xl mb-1.5 items-center text-[12px] shadow-2xs">
          <div className="col-span-4 pr-2 font-semibold text-slate-700 uppercase tracking-wide text-[11px]">
            Work Orders
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-slate-900">
            70
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-slate-900">
            {paperData.totalWorkOrders}
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-slate-900">
            {printerData.totalWorkOrders}
          </div>
          <div className="col-span-2 text-right pl-1.5 font-bold text-slate-900">
            {othersData.totalWorkOrders}
          </div>
        </div>

        {/* Bills Received */}
        <div className="grid grid-cols-12 py-2 px-2.5 bg-blue-50/60 border border-blue-100/90 rounded-xl mb-1.5 items-center text-[12px] shadow-2xs">
          <div className="col-span-4 pr-2 font-semibold text-blue-900 uppercase tracking-wide text-[11px]">
            Bills Recv.
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-blue-800">
            58
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-blue-800">
            {paperData.billsReceived}
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-blue-800">
            {printerData.billsReceived}
          </div>
          <div className="col-span-2 text-right pl-1.5 font-bold text-blue-800">
            {othersData.billsReceived}
          </div>
        </div>

        {/* Payment Released */}
        <div className="grid grid-cols-12 py-2 px-2.5 bg-emerald-50/60 border border-emerald-100/90 rounded-xl mb-1.5 items-center text-[12px] shadow-2xs">
          <div className="col-span-4 pr-2 font-semibold text-emerald-900 uppercase tracking-wide text-[11px]">
            Released
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-emerald-800">
            ₹140 Cr
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-emerald-800">
            {paperData.paymentReleased}
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-emerald-800">
            {printerData.paymentReleased}
          </div>
          <div className="col-span-2 text-right pl-1.5 font-bold text-emerald-800">
            {othersData.paymentReleased}
          </div>
        </div>

        {/* Payment In Process */}
        <div className="grid grid-cols-12 py-2 px-2.5 bg-indigo-50/60 border border-indigo-100/90 rounded-xl mb-1.5 items-center text-[12px] shadow-2xs">
          <div className="col-span-4 pr-2 font-semibold text-indigo-900 uppercase tracking-wide text-[11px]">
            In Process
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-indigo-800">
            ₹25 Cr
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-indigo-800">
            {paperData.paymentInProcess}
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-indigo-800">
            {printerData.paymentInProcess}
          </div>
          <div className="col-span-2 text-right pl-1.5 font-bold text-indigo-800">
            {othersData.paymentInProcess}
          </div>
        </div>

        {/* Pending (30 Days) */}
        <div className="grid grid-cols-12 py-2 px-2.5 bg-amber-50/60 border border-amber-100/90 rounded-xl mb-1.5 items-center text-[12px] shadow-2xs">
          <div className="col-span-4 pr-2 font-semibold text-amber-900 uppercase tracking-wide text-[11px]">
            Pending (30D)
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-amber-800">
            ₹16 Cr
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-amber-800">
            {paperData.pending30Days}
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-amber-800">
            {printerData.pending30Days}
          </div>
          <div className="col-span-2 text-right pl-1.5 font-bold text-amber-800">
            {othersData.pending30Days}
          </div>
        </div>

        {/* Pending (60 Days) */}
        <div className="grid grid-cols-12 py-2 px-2.5 bg-purple-50/60 border border-purple-100/90 rounded-xl items-center text-[12px] shadow-2xs">
          <div className="col-span-4 pr-2 font-semibold text-purple-900 uppercase tracking-wide text-[11px]">
            Pending (60D)
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-purple-800">
            ₹9 Cr
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-purple-800">
            {paperData.pending60Days}
          </div>
          <div className="col-span-2 text-right px-1.5 font-bold text-purple-800">
            {printerData.pending60Days}
          </div>
          <div className="col-span-2 text-right pl-1.5 font-bold text-purple-800">
            {othersData.pending60Days}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={onOpenPaperModal}
          className="flex-1 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>Paper Details</span>
          <i className="pi pi-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform text-slate-500" />
        </button>
        <button
          onClick={onOpenPrinterModal}
          className="flex-1 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>Printer Details</span>
          <i className="pi pi-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform text-slate-500" />
        </button>
      </div>
    </BaseKpiCard>
  );
};

export const GrievanceKpiCard: React.FC = () => {
  const data = mockDashboardData.grievance;
  return (
    <BaseKpiCard
      title="Grievance"
      badge="In Numbers"
      theme="amber"
      icon={AlertTriangle}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
            Total Grievances
          </span>
          <span className="text-[13px] font-bold text-slate-900">
            {data.totalNumber}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
            Resolved
          </span>
          <span className="text-[13px] font-bold text-emerald-800">
            {data.resolved}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
            Pending
          </span>
          <span className="text-[13px] font-bold text-amber-800">
            {data.pending}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/60 border border-purple-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-purple-900 uppercase tracking-wide">
            Overdue
          </span>
          <span className="text-[13px] font-bold text-purple-800">
            {data.overdue}
          </span>
        </div>
      </div>
    </BaseKpiCard>
  );
};

export const FinanceKpiCard: React.FC = () => {
  const data = mockDashboardData.finance;
  return (
    <BaseKpiCard
      title="Finance"
      badge="In Amount"
      theme="green"
      icon={IndianRupee}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-blue-50/60 border border-blue-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-blue-900 uppercase tracking-wide">
            Total Budget
          </span>
          <span className="text-[13px] font-bold text-blue-800">
            {data.totalBudget}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
            Budget Utilized
          </span>
          <span className="text-[13px] font-bold text-emerald-800">
            {data.budgetUtilized}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-indigo-50/60 border border-indigo-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-indigo-900 uppercase tracking-wide">
            Remaining Budget
          </span>
          <span className="text-[13px] font-bold text-indigo-800">
            {data.remainingBudget}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-xs mb-2 font-semibold text-slate-700 uppercase tracking-wide">
          <span>Utilization</span>
          <span className="text-emerald-700 font-semibold">
            {data.utilizationPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${data.utilizationPercent}%` }}
          ></div>
        </div>
      </div>
    </BaseKpiCard>
  );
};

export const HrmsKpiCard: React.FC = () => {
  const data = mockDashboardData.hrms;
  const navigate = useNavigate();
  return (
    <BaseKpiCard title="HRMS" badge="In Numbers" theme="blue" icon={Users}>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-blue-50/60 border border-blue-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-blue-900 uppercase tracking-wide">
            Total Employees
          </span>
          <span className="text-[13px] font-bold text-blue-800">
            {data.totalEmployees}
          </span>
        </div>

        {/* Sub-breakdown rows */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-2xs">
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="uppercase tracking-wide text-slate-600">
              Permanent
            </span>
            <span className="font-bold text-slate-900">
              {data.permanent || 30}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="uppercase tracking-wide text-slate-600">
              Samvida
            </span>
            <span className="font-bold text-slate-900">
              {data.samvida || 20}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="uppercase tracking-wide text-slate-600">
              Contractual
            </span>
            <span className="font-bold text-slate-900">
              {data.contractual || 15}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="uppercase tracking-wide text-slate-600">
              Outsource
            </span>
            <span className="font-bold text-slate-900">
              {data.outsource || 20}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50/60 border border-emerald-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-emerald-900 uppercase tracking-wide">
            Present
          </span>
          <span className="text-[13px] font-bold text-emerald-800">
            {data.presentEmployees}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
            On Leave
          </span>
          <span className="text-[13px] font-bold text-amber-800">
            {data.onLeave}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/60 border border-purple-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-purple-900 uppercase tracking-wide">
            Attendance Rate
          </span>
          <span className="text-[13px] font-bold text-purple-800">
            {`${data.attendanceRate}%`}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={() => navigate("/hrms/dashboard")}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-800">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>
    </BaseKpiCard>
  );
};

export const LegalKpiCard: React.FC = () => {
  const data = mockDashboardData.legal;
  return (
    <BaseKpiCard title="Legal" badge="In Numbers" theme="purple" icon={Scale}>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center px-3 py-2 bg-purple-50/60 border border-purple-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-purple-900 uppercase tracking-wide">
            Total Cases
          </span>
          <span className="text-[13px] font-bold text-purple-800">
            {data.totalCases}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-amber-50/60 border border-amber-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">
            Pending Cases
          </span>
          <span className="text-[13px] font-bold text-amber-800">
            {data.pendingCases}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-indigo-50/60 border border-indigo-100/90 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-indigo-900 uppercase tracking-wide">
            Upcoming Hearings
          </span>
          <span className="text-[13px] font-bold text-indigo-800">
            {data.upcomingHearings}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl shadow-2xs">
          <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
            High Priority
          </span>
          <span className="text-[13px] font-bold text-slate-900">
            {data.highPriority}
          </span>
        </div>
      </div>
    </BaseKpiCard>
  );
};
