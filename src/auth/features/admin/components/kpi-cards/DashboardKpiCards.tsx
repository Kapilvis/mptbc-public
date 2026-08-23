import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const deptChartData = {
    labels: ["RSK", "DPI", "Open Market", "Special"],
    datasets: [
      {
        data: [180000, 135000, 90000, 45000],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        hoverOffset: 4,
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  };

  const deptChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; raw: number }) =>
            ` ${context.label}: ${context.raw.toLocaleString()} Demand`,
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
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-[12px] shadow-sm flex flex-col gap-4">
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
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
              <FileText size={22} />
            </div>
            <div className="flex flex-col mt-0.5">
              <span className="text-xs font-black text-black uppercase tracking-wide mb-1">
                Total Demand
              </span>
              <span className="text-3xl font-black text-blue-600 leading-none mb-1">
                {data.totalDemand}
              </span>
              <span className="text-xs text-black font-black uppercase tracking-wide">
                Books
              </span>
            </div>
          </div>

          {/* Demand Approval */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
              <CheckSquare size={22} />
            </div>
            <div className="flex flex-col mt-0.5">
              <span className="text-xs font-black text-black uppercase tracking-wide mb-1">
                Demand Approval
              </span>
              <span className="text-3xl font-black text-emerald-600 leading-none mb-1">
                {data.demandApproved}
              </span>
              <span className="text-xs text-black font-black uppercase tracking-wide">
                Books
              </span>
            </div>
          </div>

          {/* Under Approval */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg shrink-0 mt-0.5">
              <Inbox size={22} />
            </div>
            <div className="flex flex-col mt-0.5">
              <span className="text-xs font-black text-black uppercase tracking-wide mb-1">
                Under Approval
              </span>
              <span className="text-3xl font-black text-orange-600 leading-none mb-1">
                {data.underApproval?.value || "3,00,000"}
              </span>
              <span className="text-xs text-black font-black uppercase tracking-wide">
                Books
              </span>
            </div>
          </div>

          {/* Last Year */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
              <TrendingUp size={22} />
            </div>
            <div className="flex flex-col mt-0.5">
              <span className="text-xs font-black text-black uppercase tracking-wide mb-1">
                Last Year (YOY)
              </span>
              <span className="text-3xl font-black text-purple-600 flex items-center gap-1 leading-none mb-1">
                <i className="pi pi-arrow-up text-[18px] text-purple-600 -mt-1"></i>
                {data.lastYearComparison?.value || "+5.39%"}
              </span>
              <span className="text-xs text-black font-black uppercase tracking-wide">
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
            <div className="bg-white border border-blue-100 rounded-[10px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-black text-black mb-6 flex items-center gap-2 uppercase tracking-wide">
                <i className="pi pi-chart-bar text-black"></i> Last 3 Year
                Demand
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-black/10">
                <div>
                  <div className="text-xs font-black text-black mb-1">2025</div>
                  <div className="text-sm font-black text-black tracking-tight flex items-center justify-center gap-1 flex-wrap">
                    <span>4,27,000</span>
                    <span className="text-[10px] font-black text-emerald-600 inline-flex items-center gap-0.5">
                      <i className="pi pi-arrow-up text-[8px]"></i>+1.43%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-black text-black mb-1">2024</div>
                  <div className="text-sm font-black text-black tracking-tight flex items-center justify-center gap-1 flex-wrap">
                    <span>4,21,000</span>
                    <span className="text-[10px] font-black text-emerald-600 inline-flex items-center gap-0.5">
                      <i className="pi pi-arrow-up text-[8px]"></i>+2.43%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-black text-black mb-1">2023</div>
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
            <div className="bg-white border border-blue-100 rounded-[10px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-black mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <i className="pi pi-list text-black"></i> View Demand
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
                      className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-black text-black hover:bg-gray-100 transition-all text-left shadow-sm group"
                    >
                      <span>{btn.label}</span>
                      <i className="pi pi-chevron-right text-xs text-black/50 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-black/10">
                <button
                  onClick={() => navigate("/distribution/dashboard")}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group shadow-sm"
                >
                  <span>View Dashboard</span>
                  <span className="flex items-center gap-1 text-black">
                    View{" "}
                    <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Department Pie Chart) */}
          <div className="lg:col-span-7 bg-white border border-indigo-100 rounded-[10px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
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
                  className="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <Users size={28} className="text-black mb-1.5" />
                  <span className="text-[26px] font-black text-black leading-tight tracking-tight">
                    4,50,000
                  </span>
                  <span className="text-xs text-black font-black uppercase tracking-wide">
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
                    color: "bg-blue-500",
                    pillBg: "bg-blue-200",
                    pillText: "text-black",
                  },
                  {
                    name: "DPI",
                    percent: "30%",
                    value: "1,35,000",
                    color: "bg-emerald-500",
                    pillBg: "bg-emerald-200",
                    pillText: "text-black",
                  },
                  {
                    name: "Open Market",
                    percent: "20%",
                    value: "90,000",
                    color: "bg-orange-500",
                    pillBg: "bg-orange-200",
                    pillText: "text-black",
                  },
                  {
                    name: "Special",
                    percent: "10%",
                    value: "45,000",
                    color: "bg-purple-500",
                    pillBg: "bg-purple-200",
                    pillText: "text-black",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-3.5 border-b border-black/10 border-dashed last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${item.color}`}
                      />
                      <div className="flex flex-col items-start gap-1.5">
                        <div className="text-[14px] font-black text-black">
                          {item.name}
                        </div>
                        <div
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.pillBg} ${item.pillText} leading-none`}
                        >
                          {item.percent}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-black">
                        {item.value}
                      </div>
                      <div className="text-xs text-black font-black uppercase tracking-wide mt-0.5">
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
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <span className="text-[13px] font-black text-black uppercase tracking-wide">
            Total Required
          </span>
          <div className="text-right flex flex-col leading-snug">
            <span className="text-[14px] font-black text-black">3,767 MT</span>
            <span className="text-[13px] font-black text-black">
              3,90,000 Books
            </span>
          </div>
        </div>

        {/* Opening Stock */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Opening Stock
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (as on 1-Jan-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-snug">
            <span className="text-[14px] font-black text-black">60 MT</span>
            <span className="text-[13px] font-black text-black">
              6,000 Books
            </span>
          </div>
        </div>

        {/* Received Stock */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Received Stock
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (last received: 17-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-snug">
            <span className="text-[14px] font-black text-black">3,165 MT</span>
            <span className="text-[13px] font-black text-black">
              3,27,650 Books
            </span>
          </div>
        </div>

        {/* Return Stock */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Return Stock
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (Return on 1-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-snug">
            <span className="text-[14px] font-black text-black">10 MT</span>
            <span className="text-[13px] font-black text-black">
              1,000 Books
            </span>
          </div>
        </div>

        {/* Available Stock (GREEN) */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Available Stock
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (as on 23-Aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-snug">
            <span className="text-[14px] font-black text-emerald-600">
              602 MT
            </span>
            <span className="text-[13px] font-black text-emerald-600">
              62,350 Books
            </span>
          </div>
        </div>

        {/* Need To Purchase (RED) */}
        <div className="flex justify-between items-center py-2 last:border-0">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Need To Purchase / Print
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (since 10-aug-2026)
            </span>
          </div>
          <div className="text-right flex flex-col leading-snug">
            <span className="text-[14px] font-black text-rose-600">52 MT</span>
            <span className="text-[13px] font-black text-rose-600">
              5,20,000 Books
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4">
        <button
          onClick={() => setGsmModalOpen(true)}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group"
        >
          <span>GSM wise paper - MT</span>
          <span className="flex items-center gap-1 text-black">
            View{" "}
            <i className="pi pi-chevron-right text-xs group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>
        <button
          onClick={() => navigate("/paper")}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group"
        >
          <span>View Tender Work Order</span>
          <span className="flex items-center gap-1 text-black">
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
      <div className="flex flex-col gap-1 flex-1">
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
          value={`${data.capacityUtilization}%`}
        />
      </div>
      <div className="mt-4 bg-white rounded-lg border border-black/10 p-3 shadow-sm">
        <p className="text-xs text-black font-black mb-2 uppercase tracking-wide">
          Top Capacity Printers
        </p>
        <div className="flex flex-col gap-1.5">
          {data.maxCapacityPrinters.slice(0, 2).map((p) => (
            <div key={p.id} className="flex justify-between text-xs py-0.5">
              <span className="font-black text-black">{p.name}</span>
              <span className="font-black text-black">{p.capacity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4">
        <button
          onClick={onOpenModal}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group shadow-sm"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-black">
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
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Opening Stock" value={data.openingStock} />
        <MetricRow label="Received This Year" value={data.receivedThisYear} />
        <MetricRow
          label="Dispatched to Printer"
          value={data.dispatchedToPrinter}
        />
        <MetricRow label="Closing Stock" value={data.closingStock} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4">
        <button
          onClick={() => setGsmModalOpen(true)}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group"
        >
          <span>View GSM wise stock summary</span>
          <span className="flex items-center gap-1 text-black">
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
      title="PRINTING progress"
      badge="In Numbers"
      theme="orange"
      icon={Settings}
    >
      <div className="flex flex-col gap-1 flex-1">
        {/* Total Printer */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Total Printer
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (as per rate contract)
            </span>
          </div>
          <span className="text-[14px] font-black text-black">
            {data.totalPrinters}
          </span>
        </div>

        {/* Total Target */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Total Target
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (as per work order)
            </span>
          </div>
          <span className="text-[14px] font-black text-black">
            {data.totalBooksTarget}
          </span>
        </div>

        {/* Dispatch */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Dispatch
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (printer to depot)
            </span>
          </div>
          <span className="text-[14px] font-black text-black">
            {data.dispatchCount}
          </span>
        </div>

        {/* Total Inspection */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Total Inspection
            </span>
          </div>
          <span className="text-[14px] font-black text-black">
            {data.totalInspections}
          </span>
        </div>

        {/* QA (Passed) */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              QA (Passed)
            </span>
          </div>
          <span className="text-[14px] font-black text-emerald-600">
            {data.qaPassed}
          </span>
        </div>

        {/* Pending */}
        <div className="flex justify-between items-center py-2 border-b border-black/10 border-dashed">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Pending
            </span>
            <span className="text-[11px] font-black text-black lowercase tracking-wide normal-case">
              (from printer)
            </span>
          </div>
          <span className="text-[14px] font-black text-rose-600">
            {data.pending}
          </span>
        </div>

        {/* Total Transporter */}
        <div className="flex justify-between items-center py-2 last:border-0">
          <div className="flex flex-col leading-snug">
            <span className="text-[13px] font-black text-black uppercase tracking-wide">
              Total Transporter
            </span>
          </div>
          <span className="text-[14px] font-black text-black">
            {data.totalTransporter}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4">
        <button
          onClick={onOpenModal}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-black">
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
          value={<span className="text-emerald-600">{data.delivered}</span>}
        />
        <MetricRow
          label="In transit to block"
          value={data.inTransit?.value || "10,500"}
        />
        <MetricRow
          label="Pending for dispatch"
          value={
            <span className="text-rose-600 font-extrabold">{data.pending}</span>
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
        {/* Table / Grid Header */}
        <div className="grid grid-cols-12 gap-1 pb-2 border-b border-black/10 text-xs font-black text-black uppercase tracking-wide">
          <div className="col-span-4">Metric</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2 text-right">Paper</div>
          <div className="col-span-2 text-right">Printer</div>
          <div className="col-span-2 text-right">Other</div>
        </div>

        {/* Total Work Orders */}
        <div className="grid grid-cols-12 gap-1 py-2 border-b border-black/10 border-dashed items-center text-xs font-black text-black">
          <div className="col-span-4 text-black uppercase tracking-wide text-[11px]">
            Work Orders
          </div>
          <div className="col-span-2 text-right font-black">70</div>
          <div className="col-span-2 text-right font-black">
            {paperData.totalWorkOrders}
          </div>
          <div className="col-span-2 text-right font-black">
            {printerData.totalWorkOrders}
          </div>
          <div className="col-span-2 text-right font-black">
            {othersData.totalWorkOrders}
          </div>
        </div>

        {/* Bills Received */}
        <div className="grid grid-cols-12 gap-1 py-2 border-b border-black/10 border-dashed items-center text-xs font-black text-black">
          <div className="col-span-4 text-black uppercase tracking-wide text-[11px]">
            Bills Recv.
          </div>
          <div className="col-span-2 text-right font-black">58</div>
          <div className="col-span-2 text-right font-black">
            {paperData.billsReceived}
          </div>
          <div className="col-span-2 text-right font-black">
            {printerData.billsReceived}
          </div>
          <div className="col-span-2 text-right font-black">
            {othersData.billsReceived}
          </div>
        </div>

        {/* Payment Released */}
        <div className="grid grid-cols-12 gap-1 py-2 border-b border-black/10 border-dashed items-center text-xs font-black text-black">
          <div className="col-span-4 text-black uppercase tracking-wide text-[11px]">
            Released
          </div>
          <div className="col-span-2 text-right font-black text-emerald-600">
            ₹140 Cr
          </div>
          <div className="col-span-2 text-right font-black text-emerald-600">
            {paperData.paymentReleased}
          </div>
          <div className="col-span-2 text-right font-black text-emerald-600">
            {printerData.paymentReleased}
          </div>
          <div className="col-span-2 text-right font-black text-emerald-600">
            {othersData.paymentReleased}
          </div>
        </div>

        {/* Payment In Process */}
        <div className="grid grid-cols-12 gap-1 py-2 border-b border-black/10 border-dashed items-center text-xs font-black text-black">
          <div className="col-span-4 text-black uppercase tracking-wide text-[11px]">
            In Process
          </div>
          <div className="col-span-2 text-right font-black text-orange-600">
            ₹25 Cr
          </div>
          <div className="col-span-2 text-right font-black text-orange-600">
            {paperData.paymentInProcess}
          </div>
          <div className="col-span-2 text-right font-black text-orange-600">
            {printerData.paymentInProcess}
          </div>
          <div className="col-span-2 text-right font-black text-orange-600">
            {othersData.paymentInProcess}
          </div>
        </div>

        {/* Pending (30 Days) */}
        <div className="grid grid-cols-12 gap-1 py-2 border-b border-black/10 border-dashed items-center text-xs font-black text-black">
          <div className="col-span-4 text-black uppercase tracking-wide text-[11px]">
            Pending (30 Days)
          </div>
          <div className="col-span-2 text-right font-black text-rose-600">
            ₹16 Cr
          </div>
          <div className="col-span-2 text-right font-black text-rose-600">
            {paperData.pending30Days}
          </div>
          <div className="col-span-2 text-right font-black text-rose-600">
            {printerData.pending30Days}
          </div>
          <div className="col-span-2 text-right font-black text-rose-600">
            {othersData.pending30Days}
          </div>
        </div>

        {/* Pending (60 Days) */}
        <div className="grid grid-cols-12 gap-1 py-2 border-b border-black/10 border-dashed last:border-0 items-center text-xs font-black text-black">
          <div className="col-span-4 text-black uppercase tracking-wide text-[11px]">
            Pending (60 Days)
          </div>
          <div className="col-span-2 text-right font-black text-rose-700">
            ₹9 Cr
          </div>
          <div className="col-span-2 text-right font-black text-rose-700">
            {paperData.pending60Days}
          </div>
          <div className="col-span-2 text-right font-black text-rose-700">
            {printerData.pending60Days}
          </div>
          <div className="col-span-2 text-right font-black text-rose-700">
            {othersData.pending60Days}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4">
        <button
          onClick={onOpenPaperModal}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group shadow-sm"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-black">
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
      theme="red"
      icon={AlertTriangle}
    >
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Total Grievances" value={data.totalNumber} />
        <MetricRow
          label="Resolved"
          value={<span className="text-emerald-600">{data.resolved}</span>}
        />
        <MetricRow label="Pending" value={data.pending} />
        <MetricRow
          label="Overdue"
          value={<span className="text-red-600 font-bold">{data.overdue}</span>}
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
      <div className="mt-4 pt-4 border-t border-black/10">
        <div className="flex justify-between text-xs mb-2 font-black text-black uppercase tracking-wide">
          <span>Utilization</span>
          <span className="text-black font-black">
            {data.utilizationPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full"
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
          <div className="flex justify-between items-center text-[11px] font-black text-black">
            <span className="uppercase tracking-wide text-black/70">
              Permanent
            </span>
            <span className="font-extrabold">{data.permanent || 30}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-black text-black">
            <span className="uppercase tracking-wide text-black/70">
              Samvida
            </span>
            <span className="font-extrabold">{data.samvida || 20}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-black text-black">
            <span className="uppercase tracking-wide text-black/70">
              Contractual
            </span>
            <span className="font-extrabold">{data.contractual || 15}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-black text-black">
            <span className="uppercase tracking-wide text-black/70">
              Outsource
            </span>
            <span className="font-extrabold">{data.outsource || 20}</span>
          </div>
        </div>

        <MetricRow
          label="Present"
          value={
            <span className="text-emerald-600">{data.presentEmployees}</span>
          }
        />
        <MetricRow
          label="On Leave"
          value={<span className="text-orange-600">{data.onLeave}</span>}
        />
        <MetricRow label="Attendance Rate" value={`${data.attendanceRate}%`} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4">
        <button
          onClick={() => navigate("/hrms/dashboard")}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-black hover:bg-gray-100 transition-all flex justify-between items-center group shadow-sm"
        >
          <span>View Details</span>
          <span className="flex items-center gap-1 text-black">
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
    <BaseKpiCard title="Legal" badge="In Numbers" theme="red" icon={Scale}>
      <div className="flex flex-col gap-1 flex-1">
        <MetricRow label="Total Cases" value={data.totalCases} />
        <MetricRow label="Pending Cases" value={data.pendingCases} />
        <MetricRow label="Upcoming Hearings" value={data.upcomingHearings} />
        <MetricRow
          label="High Priority"
          value={
            <span className="text-red-600 font-bold">{data.highPriority}</span>
          }
        />
      </div>
    </BaseKpiCard>
  );
};
