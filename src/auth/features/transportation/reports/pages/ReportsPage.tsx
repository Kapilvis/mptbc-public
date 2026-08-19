import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Loader } from "shared/components/progress";
import { Button } from "shared/components/buttons";
import { useWorkOrdersQuery } from "../../work-order/queries";
import { useTransportersQuery } from "../../../master/transporter-registration/queries";
import { useVehiclesQuery } from "../../../master/vehicle-master/queries";
import {
  Truck,
  Users,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface FlatReportDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
  expectedDeliveryDate: string;
  daysRemaining: number;
  displayStatus: string;
}

// Format date to Indian IST format (DD/MM/YYYY)
const formatISTDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ReportsPage() {
  const pageTitle = usePageTitle();
  const [subTab, setSubTab] = useState<
    "overview" | "transporters" | "vehicles"
  >("overview");
  const [activeSegment, setActiveSegment] = useState<
    "delivered" | "inTransit" | "pending" | null
  >(null);
  const { data: workOrders = [], isLoading: loadingWorkOrders } =
    useWorkOrdersQuery();
  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersQuery();
  const { data: vehicles = [], isLoading: loadingVehicles } =
    useVehiclesQuery();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "In Transit":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      case "Pending Dispatch":
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  // Flatten dispatches from work orders
  const dispatchesList = useMemo(() => {
    const list: FlatReportDispatch[] = [];
    workOrders.forEach((wo) => {
      if (wo.dispatches && wo.dispatches.length > 0) {
        wo.dispatches.forEach((disp) => {
          const dispatchDate = new Date(disp.dispatchDate);
          const dueDate = new Date(dispatchDate);
          dueDate.setDate(dueDate.getDate() + 5);
          const endPoint =
            disp.status === "Delivered" && disp.actualDeliveryDate
              ? new Date(disp.actualDeliveryDate)
              : new Date();
          endPoint.setHours(0, 0, 0, 0);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = dueDate.getTime() - endPoint.getTime();
          const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isDelayed = days < 0 && disp.status !== "Delivered";
          list.push({
            ...disp,
            district: wo.district,
            block: wo.block,
            transporterName: wo.transporterName,
            expectedDeliveryDate: (() => {
              const d = new Date(disp.dispatchDate);
              d.setDate(d.getDate() + 5);
              return d.toISOString().split("T")[0];
            })(),
            daysRemaining: days,
            displayStatus: isDelayed ? "Delayed" : disp.status,
          });
        });
      }
    });
    return list;
  }, [workOrders]);

  // Aggregated stats
  const stats = useMemo(() => {
    const totalAllocated = workOrders.reduce(
      (sum, wo) => sum + wo.totalBundles,
      0,
    );
    let totalDispatched = 0;
    let totalDelivered = 0;
    let totalInTransit = 0;
    workOrders.forEach((wo) => {
      if (wo.dispatches) {
        wo.dispatches.forEach((d) => {
          totalDispatched += d.bundlesLoaded;
          if (d.status === "Delivered") totalDelivered += d.bundlesLoaded;
          else if (d.status === "In Transit") totalInTransit += d.bundlesLoaded;
        });
      }
    });
    const pendingDispatch = Math.max(0, totalAllocated - totalDispatched);
    const deliveredPercent =
      totalAllocated > 0 ? (totalDelivered / totalAllocated) * 100 : 0;
    const inTransitPercent =
      totalAllocated > 0 ? (totalInTransit / totalAllocated) * 100 : 0;
    const pendingPercent =
      totalAllocated > 0 ? (pendingDispatch / totalAllocated) * 100 : 0;
    return {
      totalAllocated,
      totalDispatched,
      totalDelivered,
      totalInTransit,
      pendingDispatch,
      deliveredPercent,
      inTransitPercent,
      pendingPercent,
    };
  }, [workOrders]);

  // Block-wise summary
  const blockSummary = useMemo(() => {
    const map: Record<
      string,
      {
        block: string;
        district: string;
        totalBundles: number;
        dispatchedCount: number;
        deliveredCount: number;
        inTransitCount: number;
        delayedCount: number;
        deliveredBundles: number;
        completionPercent: number;
        status: "ON SCHEDULE" | "IN PROGRESS" | "DELAYED";
      }
    > = {};
    workOrders.forEach((wo) => {
      const key = `${wo.district} - ${wo.block}`;
      if (!map[key]) {
        map[key] = {
          block: wo.block,
          district: wo.district,
          totalBundles: 0,
          dispatchedCount: 0,
          deliveredCount: 0,
          inTransitCount: 0,
          delayedCount: 0,
          deliveredBundles: 0,
          completionPercent: 0,
          status: "IN PROGRESS",
        };
      }
      const entry = map[key];
      entry.totalBundles += wo.totalBundles;
      if (wo.dispatches) {
        wo.dispatches.forEach((d) => {
          entry.dispatchedCount += 1;
          if (d.status === "Delivered") {
            entry.deliveredCount += 1;
            entry.deliveredBundles += d.bundlesLoaded;
          } else if (d.status === "In Transit") entry.inTransitCount += 1;
          const dispatchDate = new Date(d.dispatchDate);
          const dueDate = new Date(dispatchDate);
          dueDate.setDate(dueDate.getDate() + 5);
          const endPoint =
            d.status === "Delivered" && d.actualDeliveryDate
              ? new Date(d.actualDeliveryDate)
              : new Date();
          endPoint.setHours(0, 0, 0, 0);
          dueDate.setHours(0, 0, 0, 0);
          const days = Math.ceil(
            (dueDate.getTime() - endPoint.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (days < 0 && d.status !== "Delivered") entry.delayedCount += 1;
        });
      }
    });
    return Object.values(map).map((entry) => {
      const pct =
        entry.totalBundles > 0
          ? (entry.deliveredBundles / entry.totalBundles) * 100
          : 0;
      let status: "ON SCHEDULE" | "IN PROGRESS" | "DELAYED" = "IN PROGRESS";
      if (entry.delayedCount > 0) status = "DELAYED";
      else if (pct >= 80) status = "ON SCHEDULE";
      return { ...entry, completionPercent: pct, status };
    });
  }, [workOrders]);

  // Vehicle fleet stats
  const vehicleFleetStats = useMemo(() => {
    const inTransitTrucks = new Set<string>();
    const deliveredTrucks = new Set<string>();
    dispatchesList.forEach((d) => {
      if (d.truckNo) {
        if (d.displayStatus === "In Transit") inTransitTrucks.add(d.truckNo);
        else if (d.displayStatus === "Delivered")
          deliveredTrucks.add(d.truckNo);
      }
    });
    const totalRegistered = vehicles.length || 0;
    const running = inTransitTrucks.size;
    const delivered = deliveredTrucks.size;
    const idle = Math.max(0, totalRegistered - running - delivered);
    const totalWO = workOrders.length;
    const woDelivered = workOrders.filter(
      (wo) =>
        wo.dispatches &&
        wo.dispatches.length > 0 &&
        wo.dispatches.every((d) => d.status === "Delivered"),
    ).length;
    const woInTransit = workOrders.filter(
      (wo) =>
        wo.dispatches?.some((d) => d.status === "In Transit") &&
        !wo.dispatches?.every((d) => d.status === "Delivered"),
    ).length;
    const woPending = Math.max(0, totalWO - woDelivered - woInTransit);
    return {
      totalRegistered,
      running,
      delivered,
      idle,
      totalTransporters: transporters.length || 0,
      totalWO,
      woDelivered,
      woInTransit,
      woPending,
    };
  }, [dispatchesList, vehicles, workOrders, transporters]);

  if (loadingWorkOrders || loadingTransporters || loadingVehicles) {
    return <Loader />;
  }

  return (
    <Page header={pageTitle || "Transportation Dashboard"}>
      <div className="flex flex-col gap-6">
        {/* ── TOP 3 CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Transporters only */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Transporters
              </span>
              <span className="text-3xl font-black text-purple-700 mt-1.5 block">
                {vehicleFleetStats.totalTransporters}
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-2 block">
                Registered transport contractors
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-500">
              <Users size={24} />
            </div>
          </div>

          {/* Card 2: Registered Vehicles — clickable */}
          <button
            onClick={() =>
              setSubTab(subTab === "vehicles" ? "overview" : "vehicles")
            }
            className={`bg-white rounded-2xl p-4 text-left border shadow-xs hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between group ${subTab === "vehicles" ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200 hover:border-emerald-300"}`}
          >
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Registered Vehicles
              </span>
              <span className="text-3xl font-black text-slate-800 mt-1.5 block">
                {vehicleFleetStats.totalRegistered}
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-2.5 block">
                {subTab === "vehicles"
                  ? "Showing vehicle list below"
                  : "Click to view full vehicle list"}
              </span>
            </div>
            <div
              className={`p-3 rounded-xl transition ${subTab === "vehicles" ? "bg-emerald-100 text-emerald-600" : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"}`}
            >
              <Truck size={24} />
            </div>
          </button>

          {/* Card 3: Work Order Summary — static info */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Work Order Summary
              </span>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-500">
                <FileText size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-800">
                {vehicleFleetStats.totalWO}
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Total work orders issued
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Delivered
                </span>
                <span className="font-black text-emerald-700">
                  {vehicleFleetStats.woDelivered}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-sky-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
                  In Transit
                </span>
                <span className="font-black text-sky-700">
                  {vehicleFleetStats.woInTransit}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
                  Pending Dispatch
                </span>
                <span className="font-black text-slate-600">
                  {vehicleFleetStats.woPending}
                </span>
              </div>
              <div className="flex rounded-full overflow-hidden h-1 mt-1 bg-slate-100">
                <div
                  className="bg-emerald-400 h-full"
                  style={{
                    width: vehicleFleetStats.totalWO
                      ? `${(vehicleFleetStats.woDelivered / vehicleFleetStats.totalWO) * 100}%`
                      : "0%",
                  }}
                />
                <div
                  className="bg-sky-400 h-full"
                  style={{
                    width: vehicleFleetStats.totalWO
                      ? `${(vehicleFleetStats.woInTransit / vehicleFleetStats.totalWO) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── OVERVIEW DASHBOARD ── */}
        {subTab === "overview" && (
          <>
            {/* Row: Donut + Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donut Chart */}
              <Card>
                <div className="p-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Overall Delivery Breakdown
                  </p>
                  <div className="relative flex items-center justify-center w-48 h-48">
                    <svg
                      viewBox="0 0 120 120"
                      className="w-48 h-48 -rotate-90"
                      style={{ cursor: "pointer" }}
                    >
                      {/* Base track */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="18"
                      />

                      {/* Delivered segment (green) */}
                      {stats.totalAllocated > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="18"
                          strokeDasharray={`${(stats.deliveredPercent / 100) * 314.16} 314.16`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          opacity={
                            activeSegment && activeSegment !== "delivered"
                              ? 0.25
                              : 1
                          }
                          style={{
                            transition: "opacity 0.25s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => setActiveSegment("delivered")}
                          onMouseLeave={() => setActiveSegment(null)}
                          onClick={() =>
                            setActiveSegment(
                              activeSegment === "delivered"
                                ? null
                                : "delivered",
                            )
                          }
                        />
                      )}

                      {/* In-Transit segment (amber) */}
                      {stats.totalAllocated > 0 &&
                        stats.inTransitPercent > 0 && (
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="18"
                            strokeDasharray={`${(stats.inTransitPercent / 100) * 314.16} 314.16`}
                            strokeDashoffset={
                              -((stats.deliveredPercent / 100) * 314.16)
                            }
                            strokeLinecap="round"
                            opacity={
                              activeSegment && activeSegment !== "inTransit"
                                ? 0.25
                                : 1
                            }
                            style={{
                              transition: "opacity 0.25s",
                              cursor: "pointer",
                            }}
                            onMouseEnter={() => setActiveSegment("inTransit")}
                            onMouseLeave={() => setActiveSegment(null)}
                            onClick={() =>
                              setActiveSegment(
                                activeSegment === "inTransit"
                                  ? null
                                  : "inTransit",
                              )
                            }
                          />
                        )}

                      {/* Pending segment (slate) */}
                      {stats.totalAllocated > 0 && stats.pendingPercent > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="18"
                          strokeDasharray={`${(stats.pendingPercent / 100) * 314.16} 314.16`}
                          strokeDashoffset={
                            -(
                              ((stats.deliveredPercent +
                                stats.inTransitPercent) /
                                100) *
                              314.16
                            )
                          }
                          strokeLinecap="round"
                          opacity={
                            activeSegment && activeSegment !== "pending"
                              ? 0.25
                              : 1
                          }
                          style={{
                            transition: "opacity 0.25s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => setActiveSegment("pending")}
                          onMouseLeave={() => setActiveSegment(null)}
                          onClick={() =>
                            setActiveSegment(
                              activeSegment === "pending" ? null : "pending",
                            )
                          }
                        />
                      )}
                    </svg>

                    {/* Center text — updates on hover */}
                    <div className="absolute text-center pointer-events-none flex flex-col items-center justify-center">
                      <span
                        className="text-2xl font-black text-slate-800 block"
                        style={{ transition: "color 0.2s" }}
                      >
                        {activeSegment === "delivered"
                          ? `${stats.deliveredPercent.toFixed(1)}%`
                          : activeSegment === "inTransit"
                            ? `${stats.inTransitPercent.toFixed(1)}%`
                            : activeSegment === "pending"
                              ? `${stats.pendingPercent.toFixed(1)}%`
                              : `${stats.deliveredPercent.toFixed(1)}%`}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider block mt-0.5 ${
                          activeSegment === "delivered"
                            ? "text-emerald-500"
                            : activeSegment === "inTransit"
                              ? "text-amber-500"
                              : activeSegment === "pending"
                                ? "text-slate-400"
                                : "text-slate-400"
                        }`}
                      >
                        {activeSegment === "delivered"
                          ? "DELIVERED"
                          : activeSegment === "inTransit"
                            ? "IN TRANSIT"
                            : activeSegment === "pending"
                              ? "PENDING"
                              : "FULFILLED"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                        {activeSegment === "delivered"
                          ? `${stats.totalDelivered.toLocaleString()} Bundles`
                          : activeSegment === "inTransit"
                            ? `${stats.totalInTransit.toLocaleString()} Bundles`
                            : activeSegment === "pending"
                              ? `${stats.pendingDispatch.toLocaleString()} Bundles`
                              : `${stats.totalDelivered.toLocaleString()} / ${stats.totalAllocated.toLocaleString()} Bundles`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 w-full">
                    {/* Delivered row */}
                    <button
                      onMouseEnter={() => setActiveSegment("delivered")}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() =>
                        setActiveSegment(
                          activeSegment === "delivered" ? null : "delivered",
                        )
                      }
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                        activeSegment === "delivered"
                          ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300"
                          : "bg-slate-50 border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                        <span className="font-semibold text-slate-700">
                          Delivered &amp; Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>
                          {stats.totalDelivered.toLocaleString()} (
                          {stats.deliveredPercent.toFixed(1)}%)
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold">
                          &gt;
                        </span>
                      </div>
                    </button>

                    {/* In Transit row */}
                    <button
                      onMouseEnter={() => setActiveSegment("inTransit")}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() =>
                        setActiveSegment(
                          activeSegment === "inTransit" ? null : "inTransit",
                        )
                      }
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                        activeSegment === "inTransit"
                          ? "bg-amber-50 border-amber-400 ring-1 ring-amber-300"
                          : "bg-slate-50 border-slate-200/60 hover:border-amber-300 hover:bg-amber-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                        <span className="font-semibold text-slate-700">
                          In Transit
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>
                          {stats.totalInTransit.toLocaleString()} (
                          {stats.inTransitPercent.toFixed(1)}%)
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold">
                          &gt;
                        </span>
                      </div>
                    </button>

                    {/* Pending row */}
                    <button
                      onMouseEnter={() => setActiveSegment("pending")}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() =>
                        setActiveSegment(
                          activeSegment === "pending" ? null : "pending",
                        )
                      }
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                        activeSegment === "pending"
                          ? "bg-slate-100 border-slate-400 ring-1 ring-slate-300"
                          : "bg-slate-50 border-slate-200/60 hover:border-slate-400 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
                        <span className="font-semibold text-slate-700">
                          Pending Dispatch
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>
                          {stats.pendingDispatch.toLocaleString()} (
                          {stats.pendingPercent.toFixed(1)}%)
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold">
                          &gt;
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Supply Status */}
              <Card>
                <div className="p-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Supply Status
                  </p>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2
                            className="text-emerald-500"
                            size={14}
                          />
                          Total Allocated
                        </span>
                        <span className="font-black text-slate-800">
                          {stats.totalAllocated.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-400"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Activity className="text-blue-500" size={14} />
                          Total Dispatched
                        </span>
                        <span className="font-black text-slate-800">
                          {stats.totalDispatched.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: `${stats.totalAllocated > 0 ? (stats.totalDispatched / stats.totalAllocated) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2
                            className="text-emerald-500"
                            size={14}
                          />
                          Successfully Delivered
                        </span>
                        <span className="font-black text-slate-800">
                          {stats.totalDelivered.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${stats.deliveredPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Clock className="text-amber-500" size={14} />
                          Currently In Transit
                        </span>
                        <span className="font-black text-slate-800">
                          {stats.totalInTransit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${stats.inTransitPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4 mt-6 text-[10px] font-bold text-slate-400">
                    <span>
                      Data updates automatically as vehicles deliver and PODs
                      are submitted
                    </span>
                    <span className="text-emerald-600 font-extrabold uppercase tracking-wider">
                      100% Verified Data
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Block-wise Grid */}
            <Card>
              <GridPanel
                title="BLOCK-WISE DELIVERY SUMMARY"
                data={blockSummary}
                searchFields={["block"]}
                columns={[
                  {
                    field: "block",
                    header: "BLOCK",
                    sortable: true,
                    cell: (row) => (
                      <span className="font-bold text-slate-800">
                        {row.block}
                      </span>
                    ),
                  },
                  {
                    field: "totalBundles",
                    header: "TOTAL BUNDLES",
                    sortable: true,
                    align: "center",
                    cell: (row) => (
                      <span className="font-semibold text-slate-700">
                        {row.totalBundles.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    field: "dispatchedCount",
                    header: "DISPATCHED",
                    sortable: true,
                    align: "center",
                    cell: (row) => (
                      <span className="font-extrabold text-blue-600">
                        {row.dispatchedCount}
                      </span>
                    ),
                  },
                  {
                    field: "deliveredCount",
                    header: "DELIVERED",
                    sortable: true,
                    align: "center",
                    cell: (row) => (
                      <span className="font-extrabold text-emerald-600">
                        {row.deliveredCount}
                      </span>
                    ),
                  },
                  {
                    field: "inTransitCount",
                    header: "IN TRANSIT",
                    sortable: true,
                    align: "center",
                    cell: (row) => (
                      <span className="font-extrabold text-amber-500">
                        {row.inTransitCount}
                      </span>
                    ),
                  },
                  {
                    field: "delayedCount",
                    header: "DELAYED",
                    sortable: true,
                    align: "center",
                    cell: (row) => (
                      <span
                        className={`font-extrabold ${row.delayedCount > 0 ? "text-red-500" : "text-slate-400"}`}
                      >
                        {row.delayedCount}
                      </span>
                    ),
                  },
                  {
                    field: "completionPercent",
                    header: "COMPLETION %",
                    sortable: true,
                    align: "center",
                    cell: (row) => {
                      const pct = row.completionPercent;
                      return (
                        <div className="flex items-center gap-3 justify-center min-w-[120px]">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800 text-xs w-10 text-right">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      );
                    },
                  },
                  {
                    field: "status",
                    header: "STATUS",
                    sortable: true,
                    align: "center",
                    cell: (row) => {
                      const s = row.status;
                      const style =
                        s === "ON SCHEDULE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : s === "DELAYED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200";
                      return (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${style}`}
                        >
                          {s}
                        </span>
                      );
                    },
                  },
                ]}
              />
            </Card>
          </>
        )}

        {/* ── VEHICLES SUB-TAB ── */}
        {subTab === "vehicles" && (
          <>
            <div className="flex justify-end items-center mb-4">
              <Button
                label="Back to Dashboard"
                icon="arrow-left"
                onClick={() => setSubTab("overview")}
                variant="outlined"
                className="font-bold text-xs"
              />
            </div>
            <Card>
              <GridPanel
                title="Registered Vehicles Registry"
                data={vehicles}
                searchFields={["registrationNo", "vehicleCategory", "subType"]}
                columns={[
                  {
                    cell: (_, opt) => (
                      <span className="font-medium text-slate-600">
                        {opt.rowIndex + 1}
                      </span>
                    ),
                    header: "S.No.",
                    width: "60px",
                    align: "center",
                  },
                  {
                    field: "registrationNo",
                    header: "Vehicle Number",
                    sortable: true,
                  },
                  {
                    field: "category",
                    header: "Category Class",
                    sortable: true,
                    align: "center",
                  },
                  {
                    cell: (row) =>
                      row.vehicleCategory ||
                      (row.category === "Cat-1"
                        ? "Small Commercial (SCV)"
                        : row.category === "Cat-2"
                          ? "Medium Commercial (MCV)"
                          : "Heavy Commercial (HCV)"),
                    header: "Vehicle Class",
                    sortable: true,
                  },
                  {
                    cell: (row) => row.subType || row.model,
                    header: "Model Type",
                    sortable: true,
                  },
                  {
                    cell: (row) => (
                      <span className="font-semibold text-slate-700">
                        {row.capacity} MT
                      </span>
                    ),
                    field: "capacity",
                    header: "Capacity",
                    align: "center",
                  },
                  { field: "fuelType", header: "Fuel Type" },
                  {
                    cell: (row) => (
                      <span className="text-slate-600 font-semibold">
                        {formatISTDate(row.rcExpiry)}
                      </span>
                    ),
                    header: "RC Expiry",
                  },
                  {
                    cell: (row) => (
                      <span className="text-slate-600 font-semibold">
                        {formatISTDate(row.permitExpiry)}
                      </span>
                    ),
                    header: "Permit Expiry",
                  },
                  {
                    cell: (row) => (
                      <span className="text-slate-600 font-semibold">
                        {formatISTDate(row.insuranceExpiry)}
                      </span>
                    ),
                    header: "Insurance Expiry",
                  },
                  {
                    cell: (row) => (
                      <span className="text-slate-600 font-semibold">
                        {formatISTDate(row.fitnessExpiry)}
                      </span>
                    ),
                    header: "Fitness Expiry",
                  },
                  {
                    cell: (row) => (
                      <span className="text-slate-600 font-semibold">
                        {formatISTDate(row.pucExpiry)}
                      </span>
                    ),
                    header: "PUC Expiry",
                  },
                ]}
              />
            </Card>
          </>
        )}

        {/* ── TRANSPORTERS SUB-TAB ── */}
        {subTab === "transporters" && (
          <>
            <div className="flex justify-end items-center mb-4">
              <Button
                label="Back to Dashboard"
                icon="arrow-left"
                onClick={() => setSubTab("overview")}
                variant="outlined"
                className="font-bold text-xs"
              />
            </div>
            <Card>
              <GridPanel
                title="Registered Transporter Registry"
                data={transporters}
                searchFields={[
                  "transporterName",
                  "registrationNo",
                  "ownerName",
                  "district",
                ]}
                columns={[
                  {
                    cell: (_, opt) => (
                      <span className="font-medium text-slate-600">
                        {opt.rowIndex + 1}
                      </span>
                    ),
                    header: "S.No.",
                    width: "60px",
                    align: "center",
                  },
                  {
                    field: "registrationNo",
                    header: "Registration No",
                    sortable: true,
                  },
                  {
                    field: "transporterName",
                    header: "Transporter / Company Name",
                    sortable: true,
                  },
                  { field: "transporterType", header: "Type" },
                  { field: "district", header: "District", sortable: true },
                  { field: "ownerName", header: "Owner Name" },
                  { field: "mobile", header: "Mobile Number" },
                  {
                    cell: (row) => (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusClass(row.technicalStatus)}`}
                      >
                        {row.technicalStatus}
                      </span>
                    ),
                    header: "Status",
                    align: "center",
                  },
                ]}
              />
            </Card>
          </>
        )}
      </div>
    </Page>
  );
}
