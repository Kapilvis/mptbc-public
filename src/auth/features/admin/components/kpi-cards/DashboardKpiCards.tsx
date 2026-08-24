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
} from "lucide-react";
import { Chart } from "primereact/chart";
import { BaseKpiCard, MetricRow } from "./BaseKpiCard";
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

        {/* 1. Stat strip (4 standalone cards) */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total Demand */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
              <FileText size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-0.5">
                Total Demand
              </span>
              <span className="text-[22px] font-extrabold text-blue-600 leading-tight mb-0.5">
                {data.totalDemand}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* Demand Approval */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
              <CheckSquare size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-0.5">
                Demand Approval
              </span>
              <span className="text-[22px] font-extrabold text-emerald-600 leading-tight mb-0.5">
                {data.demandApproved}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* Under Approval */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
              <Inbox size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-0.5">
                Under Approval
              </span>
              <span className="text-[22px] font-extrabold text-amber-600 leading-tight mb-0.5">
                {data.underApproval?.value || "3,00,000"}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Books
              </span>
            </div>
          </div>

          {/* Last Year */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
              <TrendingUp size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-0.5">
                Last Year (YOY)
              </span>
              <span className="text-[22px] font-extrabold text-purple-600 flex items-center gap-1 leading-tight mb-0.5">
                <i className="pi pi-arrow-up text-[14px] text-purple-600"></i>
                {data.lastYearComparison?.value || "+5.39%"}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Growth
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
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 flex items-center justify-center">
                    <i className="pi pi-list text-sm" />
                  </div>
                  <span>View Demand</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "class", label: "Group Class Wise" },
                    { id: "detailedClass", label: "Class Wise" },
                    { id: "stream", label: "Stream Wise" },
                    { id: "medium", label: "Medium Wise" },
                    { id: "gsm", label: "GSM Wise" },
                    { id: "bookType", label: "Book Type Wise" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() =>
                        setModalState({ isOpen: true, type: btn.id })
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-3.5 py-2.5 text-xs font-extrabold text-slate-800 hover:bg-slate-100 transition-all text-left shadow-2xs group cursor-pointer"
                    >
                      <span>{btn.label}</span>
                      <i className="pi pi-chevron-right text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() =>
                    setModalState({ isOpen: true, type: "detailedClass" })
                  }
                  className="w-full rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200/90 py-2.5 px-4 text-xs font-extrabold text-blue-700 flex items-center justify-between transition-all group shadow-2xs cursor-pointer"
                >
                  <span>Demand Approval Status</span>
                  <i className="pi pi-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
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
      <div className="flex flex-col gap-1.5 flex-1">
        {/* Total Required */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
            Total Required
          </span>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[15px] font-black text-slate-900">
              3,767 MT
            </span>
            <span className="text-[12px] font-bold text-slate-600">
              3,90,000 Books
            </span>
          </div>
        </div>

        {/* Opening Stock */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Opening Stock
            </span>
            <span className="text-[11px] font-semibold text-slate-800/80">
              (as on 1-Jan-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[14px] font-black text-slate-800">60 MT</span>
            <span className="text-[12px] font-bold text-slate-600">
              6,000 Books
            </span>
          </div>
        </div>

        {/* Received Stock */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Received Stock
            </span>
            <span className="text-[11px] font-semibold text-slate-800/80">
              (last received: 17-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[14px] font-black text-blue-700">
              3,165 MT
            </span>
            <span className="text-[12px] font-bold text-blue-600">
              3,27,650 Books
            </span>
          </div>
        </div>

        {/* Return Stock */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Return Stock
            </span>
            <span className="text-[11px] font-semibold text-slate-800/80">
              (Return on 1-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[14px] font-black text-amber-700">10 MT</span>
            <span className="text-[12px] font-bold text-amber-600">
              1,000 Books
            </span>
          </div>
        </div>

        {/* Available Stock (GREEN) */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-emerald-800 uppercase tracking-wide">
              Available Stock
            </span>
            <span className="text-[11px] font-bold text-emerald-800">
              (as on 23-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[14px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              602 MT
            </span>
            <span className="text-[12px] font-bold text-emerald-700 mt-0.5">
              62,350 Books
            </span>
          </div>
        </div>

        {/* Need To Purchase (ORANGE) */}
        <div className="flex justify-between items-center py-2">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-orange-900 uppercase tracking-wide">
              Need To Purchase / Print
            </span>
            <span className="text-[11px] font-bold text-orange-900">
              (since 10-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-tight">
            <span className="text-[14px] font-black text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/80">
              52 MT
            </span>
            <span className="text-[12px] font-bold text-orange-800 mt-0.5">
              5,20,000 Books
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={() => setGsmModalOpen(true)}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3 py-2 text-[13px] font-bold text-slate-700 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>GSM wise paper - MT</span>
          <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-800">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
        <button
          onClick={() => navigate("/paper")}
          className="w-full rounded-xl border border-amber-200/90 bg-amber-50/80 hover:bg-amber-100/90 px-3 py-2 text-[13px] font-bold text-amber-900 transition-all flex justify-between items-center group shadow-2xs cursor-pointer"
        >
          <span>View Tender Work Order</span>
          <span className="flex items-center gap-1 text-amber-800 font-extrabold">
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
      <div className="flex flex-col gap-1.5 flex-1">
        <MetricRow label="Total Printers" value={data.totalPrinters} />
        <MetricRow
          label="Total Capacity"
          value={data.totalCapacity || "6,00,000 Books"}
        />
        <MetricRow
          label="Current Capacity Utilization"
          value={data.currentCapacity || "3,90,000 Books"}
        />
        <MetricRow
          label="Capacity Utilization"
          value={
            <span className="text-[13px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
              {`${data.capacityUtilization}%`}
            </span>
          }
        />
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
      <div className="flex flex-col gap-1.5 flex-1">
        <MetricRow label="Opening Stock" value={data.openingStock} />
        <MetricRow
          label="Received This Year"
          value={
            <span className="text-blue-700 font-extrabold">
              {data.receivedThisYear}
            </span>
          }
        />
        <MetricRow
          label="Dispatched to Printer"
          value={data.dispatchedToPrinter}
        />
        <MetricRow
          label="Closing Stock"
          value={
            <span className="text-[13px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              {data.closingStock}
            </span>
          }
        />
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
      <div className="flex flex-col gap-1 flex-1">
        {/* Total Printer */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Total Printer
            </span>
            <span className="text-[11px] font-semibold text-slate-800/80 normal-case">
              (as per rate contract)
            </span>
          </div>
          <span className="text-[15px] font-black text-slate-900">
            {data.totalPrinters}
          </span>
        </div>

        {/* Total Target */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Total Target
            </span>
            <span className="text-[11px] font-semibold text-slate-800/80 normal-case">
              (as per work order)
            </span>
          </div>
          <span className="text-[15px] font-black text-slate-900">
            {data.totalBooksTarget}
          </span>
        </div>

        {/* Dispatch */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Dispatch
            </span>
            <span className="text-[11px] font-semibold text-slate-800/80 normal-case">
              (printer to depot)
            </span>
          </div>
          <span className="text-[15px] font-black text-slate-900">
            {data.dispatchCount}
          </span>
        </div>

        {/* Total Inspection */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Total Inspection
            </span>
          </div>
          <span className="text-[15px] font-black text-slate-900">
            {data.totalInspections}
          </span>
        </div>

        {/* QA (Passed) */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-emerald-800 uppercase tracking-wide">
              QA (Passed)
            </span>
          </div>
          <span className="text-[14px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
            {data.qaPassed}
          </span>
        </div>

        {/* Pending (ORANGE) */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-orange-900 uppercase tracking-wide">
              Pending
            </span>
            <span className="text-[11px] font-bold text-orange-900 normal-case">
              (from printer)
            </span>
          </div>
          <span className="text-[14px] font-black text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/80">
            {data.pending}
          </span>
        </div>

        {/* Total Transporter */}
        <div className="flex justify-between items-center py-2 last:border-0">
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wide">
              Total Transporter
            </span>
          </div>
          <span className="text-[14px] font-black text-slate-900">
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
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Received from printer" value={data.received} />
        <MetricRow
          label="Dispatch to block"
          value={
            <span className="text-[13px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              {data.delivered}
            </span>
          }
        />
        <MetricRow
          label="In transit to block"
          value={
            <span className="text-[13px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
              {data.inTransit?.value || "10,500"}
            </span>
          }
        />
        <MetricRow
          label="Pending for dispatch"
          value={
            <span className="text-[13px] font-extrabold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/80">
              {data.pending}
            </span>
          }
        />
      </div>
    </BaseKpiCard>
  );
};

export const BillAndPaymentKpiCard: React.FC<{
  onOpenPaperModal: () => void;
  onOpenPrinterModal: () => void;
}> = ({ onOpenPaperModal }) => {
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
      <div className="flex flex-col gap-1 flex-1">
        {/* Table / Grid Container with Column Dividers */}
        <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-100/90 py-2 px-2 border-b border-slate-200 text-[11px] font-black text-slate-700 uppercase tracking-wide divide-x divide-slate-200">
            <div className="col-span-4 pr-2">Metric</div>
            <div className="col-span-2 text-right px-1.5">Total</div>
            <div className="col-span-2 text-right px-1.5">Paper</div>
            <div className="col-span-2 text-right px-1.5">Printer</div>
            <div className="col-span-2 text-right pl-1.5">Other</div>
          </div>

          {/* Total Work Orders */}
          <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 border-dashed divide-x divide-slate-100 items-center text-[12px]">
            <div className="col-span-4 pr-2 font-extrabold text-slate-800 uppercase tracking-wide text-[11px]">
              Work Orders
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-slate-900">
              70
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-slate-900">
              {paperData.totalWorkOrders}
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-slate-900">
              {printerData.totalWorkOrders}
            </div>
            <div className="col-span-2 text-right pl-1.5 font-black text-slate-900">
              {othersData.totalWorkOrders}
            </div>
          </div>

          {/* Bills Received */}
          <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 border-dashed divide-x divide-slate-100 items-center text-[12px]">
            <div className="col-span-4 pr-2 font-extrabold text-slate-800 uppercase tracking-wide text-[11px]">
              Bills Recv.
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-slate-900">
              58
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-slate-900">
              {paperData.billsReceived}
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-slate-900">
              {printerData.billsReceived}
            </div>
            <div className="col-span-2 text-right pl-1.5 font-black text-slate-900">
              {othersData.billsReceived}
            </div>
          </div>

          {/* Payment Released */}
          <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 border-dashed divide-x divide-slate-100 items-center text-[12px]">
            <div className="col-span-4 pr-2 font-extrabold text-emerald-800 uppercase tracking-wide text-[11px]">
              Released
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-emerald-700">
              ₹140 Cr
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-emerald-700">
              {paperData.paymentReleased}
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-emerald-700">
              {printerData.paymentReleased}
            </div>
            <div className="col-span-2 text-right pl-1.5 font-black text-emerald-700">
              {othersData.paymentReleased}
            </div>
          </div>

          {/* Payment In Process */}
          <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 border-dashed divide-x divide-slate-100 items-center text-[12px]">
            <div className="col-span-4 pr-2 font-extrabold text-orange-900 uppercase tracking-wide text-[11px]">
              In Process
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-800">
              ₹25 Cr
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-800">
              {paperData.paymentInProcess}
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-800">
              {printerData.paymentInProcess}
            </div>
            <div className="col-span-2 text-right pl-1.5 font-black text-orange-800">
              {othersData.paymentInProcess}
            </div>
          </div>

          {/* Pending (30 Days) */}
          <div className="grid grid-cols-12 py-2 px-2 border-b border-slate-100 border-dashed divide-x divide-slate-100 items-center text-[12px]">
            <div className="col-span-4 pr-2 font-extrabold text-orange-900 uppercase tracking-wide text-[11px]">
              Pending (30D)
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-800">
              ₹16 Cr
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-800">
              {paperData.pending30Days}
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-800">
              {printerData.pending30Days}
            </div>
            <div className="col-span-2 text-right pl-1.5 font-black text-orange-800">
              {othersData.pending30Days}
            </div>
          </div>

          {/* Pending (60 Days) */}
          <div className="grid grid-cols-12 py-2 px-2 divide-x divide-slate-100 items-center text-[12px]">
            <div className="col-span-4 pr-2 font-extrabold text-orange-950 uppercase tracking-wide text-[11px]">
              Pending (60D)
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-900">
              ₹9 Cr
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-900">
              {paperData.pending60Days}
            </div>
            <div className="col-span-2 text-right px-1.5 font-black text-orange-900">
              {printerData.pending60Days}
            </div>
            <div className="col-span-2 text-right pl-1.5 font-black text-orange-900">
              {othersData.pending60Days}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={onOpenPaperModal}
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

export const GrievanceKpiCard: React.FC = () => {
  const data = mockDashboardData.grievance;
  return (
    <BaseKpiCard
      title="Grievance"
      badge="In Numbers"
      theme="amber"
      icon={AlertTriangle}
    >
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Total Grievances" value={data.totalNumber} />
        <MetricRow
          label="Resolved"
          value={
            <span className="text-[13px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              {data.resolved}
            </span>
          }
        />
        <MetricRow
          label="Pending"
          value={
            <span className="text-[13px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
              {data.pending}
            </span>
          }
        />
        <MetricRow
          label="Overdue"
          value={
            <span className="text-[13px] font-extrabold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/80">
              {data.overdue}
            </span>
          }
        />
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
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Total Budget" value={data.totalBudget} />
        <MetricRow label="Budget Utilized" value={data.budgetUtilized} />
        <MetricRow label="Remaining Budget" value={data.remainingBudget} />
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-xs mb-2 font-extrabold text-slate-800 uppercase tracking-wide">
          <span>Utilization</span>
          <span className="text-emerald-700 font-extrabold">
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
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Total Employees" value={data.totalEmployees} />

        {/* Sub-breakdown rows */}
        <div className="pl-3.5 border-l-2 border-blue-500/80 my-1.5 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-800">
            <span className="uppercase tracking-wide text-slate-600">
              Permanent
            </span>
            <span className="font-extrabold text-slate-900">
              {data.permanent || 30}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-800">
            <span className="uppercase tracking-wide text-slate-600">
              Samvida
            </span>
            <span className="font-extrabold text-slate-900">
              {data.samvida || 20}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-800">
            <span className="uppercase tracking-wide text-slate-600">
              Contractual
            </span>
            <span className="font-extrabold text-slate-900">
              {data.contractual || 15}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-800">
            <span className="uppercase tracking-wide text-slate-600">
              Outsource
            </span>
            <span className="font-extrabold text-slate-900">
              {data.outsource || 20}
            </span>
          </div>
        </div>

        <MetricRow
          label="Present"
          value={
            <span className="text-[13px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              {data.presentEmployees}
            </span>
          }
        />
        <MetricRow
          label="On Leave"
          value={
            <span className="text-[13px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
              {data.onLeave}
            </span>
          }
        />
        <MetricRow label="Attendance Rate" value={`${data.attendanceRate}%`} />
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-3">
        <button
          onClick={() => navigate("/hrms/dashboard")}
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

export const LegalKpiCard: React.FC = () => {
  const data = mockDashboardData.legal;
  return (
    <BaseKpiCard title="Legal" badge="In Numbers" theme="purple" icon={Scale}>
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Total Cases" value={data.totalCases} />
        <MetricRow
          label="Pending Cases"
          value={
            <span className="text-[13px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
              {data.pendingCases}
            </span>
          }
        />
        <MetricRow label="Upcoming Hearings" value={data.upcomingHearings} />
        <MetricRow
          label="High Priority"
          value={
            <span className="text-[13px] font-extrabold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/80">
              {data.highPriority}
            </span>
          }
        />
      </div>
    </BaseKpiCard>
  );
};
