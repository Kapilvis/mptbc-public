import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { ToastService } from "services";
import { Dropdown } from "primereact/dropdown";
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Download,
  Package,
  FileText,
  IndianRupee,
  Building,
  Layers,
  Clock,
  X,
} from "lucide-react";

interface BlockItem {
  name: string;
  target: number;
  dispatched: number;
  delivered: number;
  trips: number;
  status: string;
}

interface DistrictItem {
  district: string;
  blocksCount: number;
  blocksSummary: string;
  transporter: string;
  targetBundles: number;
  dispatchedBundles: number;
  deliveredBundles: number;
  totalTrips: number;
  deliveredTrips: number;
  inTransitTrips: number;
  delayedTrips: number;
  completionRate: number;
  status: string;
  blockList: BlockItem[];
}

export default function ReportsPage() {
  const pageTitle = usePageTitle();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<string>("2026-27");
  const [drilldownDistrict, setDrilldownDistrict] =
    useState<DistrictItem | null>(null);

  // Executive KPI summary data
  const kpis = {
    totalTargetBundles: 7200,
    dispatchedBundles: 6000,
    deliveredBundles: 5100,
    totalVehicles: 150,
    deliveredVehicles: 105,
    inTransitVehicles: 35,
    delayedVehicles: 10,
    totalWorkOrders: 48,
    completedWorkOrders: 42,
    totalFreightValue: 495000,
    disbursedFreightValue: 420000,
    penaltiesDeducted: 15500,
  };

  const dispatchPercentage = (
    (kpis.dispatchedBundles / kpis.totalTargetBundles) *
    100
  ).toFixed(1);
  const workOrderPercentage = (
    (kpis.completedWorkOrders / kpis.totalWorkOrders) *
    100
  ).toFixed(1);
  const freightPercentage = (
    (kpis.disbursedFreightValue / kpis.totalFreightValue) *
    100
  ).toFixed(1);

  // Transportation Flow Pipeline Counts
  const flowStages = [
    {
      title: "1. Tenders & Contracts",
      count: "10 Districts",
      sub: "Contracted Rates",
      color: "border-blue-500 text-blue-700 bg-blue-50/60",
    },
    {
      title: "2. Work Orders",
      count: "84 Orders",
      sub: "38 Blocks Allocated",
      color: "border-indigo-500 text-indigo-700 bg-indigo-50/60",
    },
    {
      title: "3. Dispatched Textbooks",
      count: "11,800 Bundles",
      sub: "295 Vehicle Trips",
      color: "border-sky-500 text-sky-700 bg-sky-50/60",
    },
    {
      title: "4. Live In-Transit",
      count: "48 Trucks",
      sub: "GPS Tracking Active",
      color: "border-amber-500 text-amber-700 bg-amber-50/60",
    },
    {
      title: "5. Delivered / POD",
      count: "247 Trucks",
      sub: "OTP & POD Verified",
      color: "border-emerald-500 text-emerald-700 bg-emerald-50/60",
    },
    {
      title: "6. Settled & Paid",
      count: "₹ 9.80 Lakhs",
      sub: "82 Bills Settled",
      color: "border-teal-500 text-teal-700 bg-teal-50/60",
    },
  ];

  // District Level Data with Block-level drill-down details (10 Major MP Districts)
  const districtData = [
    {
      district: "Indore",
      blocksCount: 4,
      blocksSummary: "Indore, MHOW, Sanwer, Depalpur",
      transporter: "Verma Logistics / Sharma Transport",
      targetBundles: 2400,
      dispatchedBundles: 2200,
      deliveredBundles: 1950,
      totalTrips: 55,
      deliveredTrips: 42,
      inTransitTrips: 10,
      delayedTrips: 3,
      completionRate: 91.6,
      status: "On Schedule",
      blockList: [
        {
          name: "INDORE",
          target: 700,
          dispatched: 650,
          delivered: 600,
          trips: 16,
          status: "Active",
        },
        {
          name: "Dr. Ambedkar Nagar (MHOW)",
          target: 600,
          dispatched: 550,
          delivered: 500,
          trips: 14,
          status: "Active",
        },
        {
          name: "SANWER",
          target: 550,
          dispatched: 500,
          delivered: 450,
          trips: 13,
          status: "Active",
        },
        {
          name: "DEPALPUR",
          target: 550,
          dispatched: 500,
          delivered: 400,
          trips: 12,
          status: "Active",
        },
      ],
    },
    {
      district: "Bhopal",
      blocksCount: 2,
      blocksSummary: "PHANDA, BERASIA",
      transporter: "Verma Logistics",
      targetBundles: 1800,
      dispatchedBundles: 1600,
      deliveredBundles: 1400,
      totalTrips: 38,
      deliveredTrips: 28,
      inTransitTrips: 8,
      delayedTrips: 2,
      completionRate: 88.8,
      status: "On Schedule",
      blockList: [
        {
          name: "PHANDA",
          target: 1000,
          dispatched: 900,
          delivered: 800,
          trips: 22,
          status: "Active",
        },
        {
          name: "BERASIA",
          target: 800,
          dispatched: 700,
          delivered: 600,
          trips: 16,
          status: "Active",
        },
      ],
    },
    {
      district: "Ujjain",
      blocksCount: 6,
      blocksSummary: "Ujjain, Nagda, Mahidpur, Tarana, Ghatiya, Khachrod",
      transporter: "MP Roadlines",
      targetBundles: 1400,
      dispatchedBundles: 1100,
      deliveredBundles: 950,
      totalTrips: 28,
      deliveredTrips: 19,
      inTransitTrips: 7,
      delayedTrips: 2,
      completionRate: 78.5,
      status: "In Progress",
      blockList: [
        {
          name: "Ujjain City",
          target: 350,
          dispatched: 290,
          delivered: 250,
          trips: 7,
          status: "Active",
        },
        {
          name: "Nagda",
          target: 250,
          dispatched: 200,
          delivered: 170,
          trips: 5,
          status: "Active",
        },
        {
          name: "Mahidpur",
          target: 200,
          dispatched: 160,
          delivered: 140,
          trips: 4,
          status: "Active",
        },
        {
          name: "Tarana",
          target: 200,
          dispatched: 160,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
        {
          name: "Ghatiya",
          target: 200,
          dispatched: 150,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
        {
          name: "Khachrod",
          target: 200,
          dispatched: 140,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
      ],
    },
    {
      district: "Gwalior",
      blocksCount: 4,
      blocksSummary: "Gwalior, Dabra, Morar, Bhitarwar",
      transporter: "Sharma Transport Co.",
      targetBundles: 1200,
      dispatchedBundles: 1000,
      deliveredBundles: 850,
      totalTrips: 24,
      deliveredTrips: 15,
      inTransitTrips: 7,
      delayedTrips: 2,
      completionRate: 83.3,
      status: "In Progress",
      blockList: [
        {
          name: "Gwalior City",
          target: 400,
          dispatched: 350,
          delivered: 300,
          trips: 8,
          status: "Active",
        },
        {
          name: "Dabra",
          target: 300,
          dispatched: 250,
          delivered: 210,
          trips: 6,
          status: "Active",
        },
        {
          name: "Morar",
          target: 250,
          dispatched: 210,
          delivered: 180,
          trips: 5,
          status: "Active",
        },
        {
          name: "Bhitarwar",
          target: 250,
          dispatched: 190,
          delivered: 160,
          trips: 5,
          status: "Active",
        },
      ],
    },
    {
      district: "Jabalpur",
      blocksCount: 4,
      blocksSummary: "Jabalpur, Sihora, Patan, Panagar",
      transporter: "Verma Logistics",
      targetBundles: 1100,
      dispatchedBundles: 850,
      deliveredBundles: 700,
      totalTrips: 22,
      deliveredTrips: 14,
      inTransitTrips: 6,
      delayedTrips: 2,
      completionRate: 77.2,
      status: "In Progress",
      blockList: [
        {
          name: "Jabalpur City",
          target: 400,
          dispatched: 320,
          delivered: 270,
          trips: 8,
          status: "Active",
        },
        {
          name: "Sihora",
          target: 250,
          dispatched: 200,
          delivered: 160,
          trips: 5,
          status: "Active",
        },
        {
          name: "Patan",
          target: 250,
          dispatched: 180,
          delivered: 150,
          trips: 5,
          status: "Active",
        },
        {
          name: "Panagar",
          target: 200,
          dispatched: 150,
          delivered: 120,
          trips: 4,
          status: "Active",
        },
      ],
    },
    {
      district: "Rewa",
      blocksCount: 5,
      blocksSummary: "Rewa, Raipur Karchuliyan, Mauganj, Hanumana, Teonthar",
      transporter: "MP Roadlines",
      targetBundles: 950,
      dispatchedBundles: 750,
      deliveredBundles: 620,
      totalTrips: 19,
      deliveredTrips: 12,
      inTransitTrips: 5,
      delayedTrips: 2,
      completionRate: 78.9,
      status: "In Progress",
      blockList: [
        {
          name: "Rewa City",
          target: 300,
          dispatched: 250,
          delivered: 210,
          trips: 6,
          status: "Active",
        },
        {
          name: "Raipur Karchuliyan",
          target: 200,
          dispatched: 150,
          delivered: 120,
          trips: 4,
          status: "Active",
        },
        {
          name: "Mauganj",
          target: 150,
          dispatched: 120,
          delivered: 100,
          trips: 3,
          status: "Active",
        },
        {
          name: "Hanumana",
          target: 150,
          dispatched: 120,
          delivered: 100,
          trips: 3,
          status: "Active",
        },
        {
          name: "Teonthar",
          target: 150,
          dispatched: 110,
          delivered: 90,
          trips: 3,
          status: "Active",
        },
      ],
    },
    {
      district: "Sagar",
      blocksCount: 4,
      blocksSummary: "Sagar, Rahatgarh, Bina, Khurai",
      transporter: "Sharma Transport Co.",
      targetBundles: 900,
      dispatchedBundles: 720,
      deliveredBundles: 600,
      totalTrips: 18,
      deliveredTrips: 11,
      inTransitTrips: 5,
      delayedTrips: 2,
      completionRate: 80.0,
      status: "In Progress",
      blockList: [
        {
          name: "Sagar City",
          target: 300,
          dispatched: 250,
          delivered: 210,
          trips: 6,
          status: "Active",
        },
        {
          name: "Rahatgarh",
          target: 200,
          dispatched: 160,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
        {
          name: "Bina",
          target: 200,
          dispatched: 160,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
        {
          name: "Khurai",
          target: 200,
          dispatched: 150,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
      ],
    },
    {
      district: "Satna",
      blocksCount: 4,
      blocksSummary: "Satna, Maihar, Nagod, Amarpatan",
      transporter: "Verma Logistics",
      targetBundles: 850,
      dispatchedBundles: 680,
      deliveredBundles: 550,
      totalTrips: 17,
      deliveredTrips: 10,
      inTransitTrips: 5,
      delayedTrips: 2,
      completionRate: 80.0,
      status: "In Progress",
      blockList: [
        {
          name: "Satna City",
          target: 300,
          dispatched: 240,
          delivered: 190,
          trips: 6,
          status: "Active",
        },
        {
          name: "Maihar",
          target: 200,
          dispatched: 160,
          delivered: 130,
          trips: 4,
          status: "Active",
        },
        {
          name: "Nagod",
          target: 200,
          dispatched: 150,
          delivered: 120,
          trips: 4,
          status: "Active",
        },
        {
          name: "Amarpatan",
          target: 150,
          dispatched: 130,
          delivered: 110,
          trips: 3,
          status: "Active",
        },
      ],
    },
    {
      district: "Ratlam",
      blocksCount: 3,
      blocksSummary: "Ratlam, Jaora, Alot",
      transporter: "MP Roadlines",
      targetBundles: 750,
      dispatchedBundles: 620,
      deliveredBundles: 510,
      totalTrips: 15,
      deliveredTrips: 10,
      inTransitTrips: 4,
      delayedTrips: 1,
      completionRate: 82.6,
      status: "In Progress",
      blockList: [
        {
          name: "Ratlam City",
          target: 350,
          dispatched: 300,
          delivered: 250,
          trips: 7,
          status: "Active",
        },
        {
          name: "Jaora",
          target: 200,
          dispatched: 170,
          delivered: 140,
          trips: 4,
          status: "Active",
        },
        {
          name: "Alot",
          target: 200,
          dispatched: 150,
          delivered: 120,
          trips: 4,
          status: "Active",
        },
      ],
    },
    {
      district: "Dewas",
      blocksCount: 4,
      blocksSummary: "Dewas, Sonkatch, Bagli, Kannod",
      transporter: "Sharma Transport Co.",
      targetBundles: 700,
      dispatchedBundles: 580,
      deliveredBundles: 480,
      totalTrips: 14,
      deliveredTrips: 9,
      inTransitTrips: 4,
      delayedTrips: 1,
      completionRate: 82.8,
      status: "In Progress",
      blockList: [
        {
          name: "Dewas City",
          target: 300,
          dispatched: 260,
          delivered: 220,
          trips: 6,
          status: "Active",
        },
        {
          name: "Sonkatch",
          target: 150,
          dispatched: 120,
          delivered: 100,
          trips: 3,
          status: "Active",
        },
        {
          name: "Bagli",
          target: 150,
          dispatched: 110,
          delivered: 90,
          trips: 3,
          status: "Active",
        },
        {
          name: "Kannod",
          target: 100,
          dispatched: 90,
          delivered: 70,
          trips: 2,
          status: "Active",
        },
      ],
    },
  ];

  // Maximum target among districts to compute proportional vertical bar heights
  const maxDistrictTarget = Math.max(
    ...districtData.map((d) => d.targetBundles),
  );

  // Filtered districts for chart
  const displayedDistricts = useMemo(() => {
    if (selectedDistrict === "All") return districtData;
    return districtData.filter((d) => d.district === selectedDistrict);
  }, [selectedDistrict]);

  const handleExport = () => {
    ToastService.success("Executive Transportation Summary Report downloaded!");
  };

  return (
    <Page header={pageTitle || "Transportation Analytics"}>
      <div className="flex flex-col gap-6">
        {/* Top Filter & Export Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
            {/* District Dropdown Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                District:
              </span>
              <Dropdown
                value={selectedDistrict}
                options={[
                  { label: "All Districts", value: "All" },
                  { label: "Indore", value: "Indore" },
                  { label: "Bhopal", value: "Bhopal" },
                  { label: "Ujjain", value: "Ujjain" },
                  { label: "Gwalior", value: "Gwalior" },
                  { label: "Jabalpur", value: "Jabalpur" },
                  { label: "Rewa", value: "Rewa" },
                  { label: "Sagar", value: "Sagar" },
                  { label: "Satna", value: "Satna" },
                  { label: "Ratlam", value: "Ratlam" },
                  { label: "Dewas", value: "Dewas" },
                ]}
                onChange={(e) => setSelectedDistrict(e.value)}
                placeholder="Select District"
                className="w-44 h-[38px] text-xs font-semibold"
                panelClassName="z-[11000]"
                appendTo={document.body}
              />
            </div>

            {/* Academic Year Dropdown Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Academic Year:
              </span>
              <Dropdown
                value={selectedAcademicYear}
                options={[
                  { label: "2026-27", value: "2026-27" },
                  { label: "2025-26", value: "2025-26" },
                  { label: "2024-25", value: "2024-25" },
                ]}
                onChange={(e) => setSelectedAcademicYear(e.value)}
                placeholder="Select Academic Year"
                className="w-44 h-[38px] text-xs font-semibold"
                panelClassName="z-[11000]"
                appendTo={document.body}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
              Academic Year: {selectedAcademicYear}
            </span>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* Top 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Dispatched Bundles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dispatched Bundles
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Package size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800">
                  {kpis.dispatchedBundles.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  / {kpis.totalTargetBundles.toLocaleString()} Bundles
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${dispatchPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold mt-2">
                <span>{dispatchPercentage}% Target Met</span>
                <span className="text-slate-400">1,200 Remaining</span>
              </div>
            </div>
          </div>

          {/* 2. Active Transportation Vehicles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Vehicle Status
              </span>
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <Truck size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800">
                  {kpis.totalVehicles}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Total Vehicle Trips
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ {kpis.deliveredVehicles} Delivered
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  • {kpis.inTransitVehicles} In-Transit
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  ! {kpis.delayedVehicles} Delayed
                </span>
              </div>
            </div>
          </div>

          {/* 3. Work Orders Execution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Work Orders
              </span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800">
                  {kpis.completedWorkOrders}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  / {kpis.totalWorkOrders} Orders Completed
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${workOrderPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold mt-2">
                <span>{workOrderPercentage}% Executed</span>
                <span className="text-slate-400">6 Pending Dispatch</span>
              </div>
            </div>
          </div>

          {/* 4. Payment & Billing Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment & Billing Status
              </span>
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                <IndianRupee size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800">
                  ₹ {(kpis.disbursedFreightValue / 100000).toFixed(2)}L
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  / ₹ {(kpis.totalFreightValue / 100000).toFixed(2)}L
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freightPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold mt-2">
                <span>{freightPercentage}% Disbursed</span>
                <span className="text-rose-600 font-bold">
                  ₹15.5k Penalty Deducted
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transportation Flow Pipeline Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-emerald-600" />
              Transportation Workflow Status
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {flowStages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col gap-1 transition hover:scale-[1.02] ${stage.color}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {stage.title}
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {stage.count}
                </span>
                <span className="text-[10px] opacity-75">{stage.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Comparison Grid (2 Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: District Supply Progress - VERTICAL BAR CHART (2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    District Supply Progress
                  </h4>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                    <span className="text-slate-600">Target Bundles</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                    <span className="text-slate-800 font-bold">
                      Dispatched Bundles
                    </span>
                  </div>
                </div>
              </div>

              {/* Vertical Bars Chart Container */}
              <div className="relative pt-6 pb-2">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-0 top-6 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-slate-200 w-full" />
                  <div className="border-b border-dashed border-slate-200 w-full" />
                  <div className="border-b border-dashed border-slate-200 w-full" />
                  <div className="border-b border-dashed border-slate-200 w-full" />
                </div>

                {/* Columns Group - Districts evenly distributed */}
                <div
                  className={`relative z-10 grid gap-2 sm:gap-2.5 h-56 items-end ${
                    displayedDistricts.length <= 1
                      ? "grid-cols-1 max-w-xs mx-auto"
                      : displayedDistricts.length <= 5
                        ? "grid-cols-5"
                        : "grid-cols-5 sm:grid-cols-10"
                  }`}
                >
                  {displayedDistricts.map((d) => {
                    const targetHeightPct =
                      (d.targetBundles / maxDistrictTarget) * 100;
                    const dispatchedHeightPct =
                      (d.dispatchedBundles / maxDistrictTarget) * 100;

                    return (
                      <div
                        key={d.district}
                        onClick={() => setDrilldownDistrict(d)}
                        className="group flex flex-col items-center h-full justify-end cursor-pointer"
                        title="Click to view block breakdown"
                      >
                        {/* Completion Badge on top of column */}
                        <span
                          className={`mb-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs transition group-hover:scale-110 ${
                            d.completionRate > 85
                              ? "bg-emerald-100 text-emerald-800"
                              : d.completionRate > 70
                                ? "bg-sky-100 text-sky-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {d.completionRate}%
                        </span>

                        {/* Dual Vertical Bars (Target vs Dispatched) */}
                        <div className="flex items-end gap-1 sm:gap-2 w-full max-w-[56px] justify-center h-40">
                          {/* Target Bar */}
                          <div
                            className="w-1/2 bg-slate-200/90 rounded-t-md transition-all duration-500 group-hover:bg-slate-300 relative"
                            style={{ height: `${targetHeightPct}%` }}
                          >
                            <span className="hidden group-hover:block absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1 py-0.5 rounded font-mono whitespace-nowrap z-20">
                              Target: {d.targetBundles}
                            </span>
                          </div>

                          {/* Dispatched Bar */}
                          <div
                            className={`w-1/2 rounded-t-md transition-all duration-500 shadow-xs relative ${
                              d.completionRate > 85
                                ? "bg-emerald-500 group-hover:bg-emerald-600"
                                : d.completionRate > 70
                                  ? "bg-sky-500 group-hover:bg-sky-600"
                                  : "bg-amber-500 group-hover:bg-amber-600"
                            }`}
                            style={{ height: `${dispatchedHeightPct}%` }}
                          >
                            <span className="hidden group-hover:block absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-[9px] px-1 py-0.5 rounded font-mono whitespace-nowrap z-20">
                              Sent: {d.dispatchedBundles}
                            </span>
                          </div>
                        </div>

                        {/* District Name Label */}
                        <div className="mt-3 text-center">
                          <span className="text-xs font-bold text-slate-800 block group-hover:text-emerald-700 transition">
                            {d.district}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {d.blocksCount} Blocks
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Overall State Fulfillment: <strong>83.3%</strong>
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Click on any district column to view block breakdown
              </span>
            </div>
          </div>

          {/* Right: Live Transit & Vehicle SLA Status (1 col) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Truck size={16} className="text-sky-600" />
                  Delivery Status
                </h4>
              </div>

              <div className="flex flex-col gap-3">
                {/* Delivered */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        Delivered On-Time
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        Delivered within 3 days
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-emerald-800">
                    105{" "}
                    <span className="text-[10px] font-normal">Vehicles</span>
                  </span>
                </div>

                {/* In Transit */}
                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
                      <Clock size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-sky-900 block">
                        On-Route / In-Transit
                      </span>
                      <span className="text-[10px] text-sky-700">
                        Live GPS tracking active
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-sky-800">
                    35 <span className="text-[10px] font-normal">Vehicles</span>
                  </span>
                </div>

                {/* Delayed */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">
                        Transit Delay Alert
                      </span>
                      <span className="text-[10px] text-amber-700">
                        Delayed past 3 days (72 hrs)
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-amber-800">
                    10 <span className="text-[10px] font-normal">Vehicles</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>GPS Tracking Status</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                100% Operational
              </span>
            </div>
          </div>
        </div>

        {/* Block-Level Drill-Down Modal Drawer */}
        {drilldownDistrict && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200">
              <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Building size={18} />
                    {drilldownDistrict.district} District - Block Level Supply
                    Breakdown
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {drilldownDistrict.blocksCount} Blocks allocated |
                    Transporter: {drilldownDistrict.transporter}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrilldownDistrict(null)}
                  className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Target
                    </span>
                    <span className="text-base font-black text-slate-800 block">
                      {drilldownDistrict.targetBundles.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                    <span className="text-[10px] font-bold text-sky-600 uppercase">
                      Dispatched
                    </span>
                    <span className="text-base font-black text-sky-800 block">
                      {drilldownDistrict.dispatchedBundles.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                      Delivered
                    </span>
                    <span className="text-base font-black text-emerald-800 block">
                      {drilldownDistrict.deliveredBundles.toLocaleString()}
                    </span>
                  </div>
                </div>

                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">
                  Block-Wise Distribution Target vs Received
                </h5>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {drilldownDistrict.blockList?.map((b: BlockItem) => {
                    const blockPct = ((b.dispatched / b.target) * 100).toFixed(
                      1,
                    );
                    return (
                      <div
                        key={b.name}
                        className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between gap-4"
                      >
                        <div className="w-48">
                          <span className="text-xs font-bold text-slate-800 block">
                            {b.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {b.trips} Truck Trips Allocated
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between text-[11px] text-slate-600 font-semibold mb-1">
                            <span>
                              {b.dispatched} / {b.target} Bundles
                            </span>
                            <span className="font-bold text-emerald-700">
                              {blockPct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${blockPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                            <CheckCircle2 size={10} /> Delivered: {b.delivered}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDrilldownDistrict(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
