import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Button } from "shared/components/buttons";
import {
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Check,
  CalendarDays,
  ListTodo,
} from "lucide-react";

import type { Milestone } from "./timelineMockData";
import { DEMAND_CYCLES, ALL_MILESTONES } from "./timelineMockData";

export const TimelineDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [selectedYear, setSelectedYear] = useState("2026-27");
  const [selectedCycle, setSelectedCycle] = useState("cycle-2");

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  // Filtered milestones based on the selected Demand Cycle
  const milestones: Milestone[] = useMemo(() => {
    const saved = sessionStorage.getItem("mptbc_production_trackers");
    if (saved) {
      const trackers = JSON.parse(saved);
      const key = `${selectedYear}_${selectedCycle}`;
      if (trackers[key]) {
        return trackers[key];
      }
    }
    return ALL_MILESTONES[selectedCycle] || [];
  }, [selectedCycle, selectedYear]);

  // Derived statistics for the KPI block
  const stats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(
      (m) => m.completionStatus === "Complete",
    ).length;
    const inProgress = milestones.filter(
      (m) =>
        m.scheduleStatus === "In Progress" && m.completionStatus !== "Complete",
    ).length;
    const upcoming = milestones.filter(
      (m) =>
        m.scheduleStatus === "Upcoming" && m.completionStatus !== "Complete",
    ).length;
    const overdue = milestones.filter(
      (m) =>
        m.scheduleStatus === "Overdue" && m.completionStatus !== "Complete",
    ).length;

    // Calculate percentage
    const completedPercent =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressPercent =
      total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const upcomingPercent =
      total > 0 ? Math.round((upcoming / total) * 100) : 0;
    const overduePercent = total > 0 ? Math.round((overdue / total) * 100) : 0;

    return {
      total,
      completed,
      completedPercent,
      inProgress,
      inProgressPercent,
      upcoming,
      upcomingPercent,
      overdue,
      overduePercent,
    };
  }, [milestones]);

  // CSS class helper for deadline diff badges
  const getBadgeClasses = (type: Milestone["daysDiffType"]) => {
    switch (type) {
      case "early":
      case "on-time":
        return "bg-[#eaf5ea] text-[#008a45] border-[#c2d8be] dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900";
      case "late":
      case "overdue":
        return "bg-rose-55 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900";
      case "remaining":
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900";
    }
  };

  // Schedule Status badge styling helper
  const getScheduleStatusBadge = (status: Milestone["scheduleStatus"]) => {
    switch (status) {
      case "On Time":
        return "bg-[#eaf5ea] text-[#008a45] dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-[#c2d8be] inline-block whitespace-nowrap text-center";
      case "In Progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200 inline-block whitespace-nowrap text-center";
      case "Overdue":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-rose-200 inline-block whitespace-nowrap text-center";
      case "Upcoming":
      default:
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-sky-200 inline-block whitespace-nowrap text-center";
    }
  };

  // Completion Status badge styling helper
  const getCompletionStatusBadge = (status: Milestone["completionStatus"]) => {
    if (status === "Complete") {
      return "bg-[#eaf5ea] text-[#008a45] dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-[#c2d8be] inline-block whitespace-nowrap text-center";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200 inline-block whitespace-nowrap text-center";
  };

  // CSS row background class helper based on schedule status
  const getRowBgClass = (status: Milestone["scheduleStatus"]) => {
    switch (status) {
      case "On Time":
        return "bg-emerald-50/20 dark:bg-emerald-950/10 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20";
      case "Overdue":
        return "bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50/40 dark:hover:bg-rose-950/20";
      case "In Progress":
        return "bg-amber-50/20 dark:bg-amber-900/5 hover:bg-amber-50/30 dark:hover:bg-amber-900/10";
      case "Upcoming":
      default:
        return "hover:bg-slate-50/50 dark:hover:bg-slate-850/40";
    }
  };

  return (
    <Page
      header="Deadline Tracker"
      subHeader={`Track all key milestones and deadlines for Academic Year ${selectedYear}`}
      showHeaderActions
    >
      {portalTarget &&
        createPortal(
          <Button
            label="Textbook Printing Cycle"
            icon="pi pi-plus"
            onClick={() => navigate("/timeline/add")}
            className="bg-[#008a45] hover:bg-[#00753a] text-white font-bold text-xs"
          />,
          portalTarget,
        )}
      {/* 1. Header Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Timeline Filter Center
          </h2>
          <p className="text-sm md:text-sm font-medium text-slate-700 dark:text-slate-350 mt-1">
            Detailed overview of milestones, deadlines, progress and periods of
            textbook production for selected year.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Academic Year Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Academic Year:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Total Milestones */}
        <div
          className="group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
          style={{
            backgroundColor: "#f0f9ff",
            border: "1.5px solid #bae6fd",
          }}
        >
          {/* Top Row: Title */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="text-[13.5px] font-extrabold uppercase tracking-wider leading-tight text-slate-900 dark:text-white">
              Total Milestones
            </span>
          </div>

          {/* Main Primary Metric & Subtitle */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="text-2xl font-black tracking-tight leading-snug text-black dark:text-white">
                {stats.total}
              </div>
            </div>

            {/* Bold Vibrant Icon Button */}
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#0284c7" }}
            >
              <CalendarDays size={20} />
            </span>
          </div>
        </div>

        {/* Completed */}
        <div
          className="group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
          style={{
            backgroundColor: "#f0fdf4",
            border: "1.5px solid #bbf7d0",
          }}
        >
          {/* Top Row: Title */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="text-[13.5px] font-extrabold uppercase tracking-wider leading-tight text-slate-900 dark:text-white">
              Milestones (Completed)
            </span>
          </div>

          {/* Main Primary Metric & Subtitle */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="text-2xl font-black tracking-tight leading-snug text-black dark:text-white">
                {stats.completed}
              </div>
            </div>

            {/* Bold Vibrant Icon Button */}
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#059669" }}
            >
              <CheckCircle2 size={20} />
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div
          className="group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
          style={{
            backgroundColor: "#eff6ff",
            border: "1.5px solid #bfdbfe",
          }}
        >
          {/* Top Row: Title */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="text-[13.5px] font-extrabold uppercase tracking-wider leading-tight text-slate-900 dark:text-white">
              Milestones (In Progress)
            </span>
          </div>

          {/* Main Primary Metric & Subtitle */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="text-2xl font-black tracking-tight leading-snug text-black dark:text-white">
                {stats.inProgress}
              </div>
            </div>

            {/* Bold Vibrant Icon Button */}
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#2563eb" }}
            >
              <Clock size={20} />
            </span>
          </div>
        </div>

        {/* Upcoming */}
        <div
          className="group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
          style={{
            backgroundColor: "#fffbeb",
            border: "1.5px solid #fde68a",
          }}
        >
          {/* Top Row: Title */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="text-[13.5px] font-extrabold uppercase tracking-wider leading-tight text-slate-900 dark:text-white">
              Milestones (Upcoming)
            </span>
          </div>

          {/* Main Primary Metric & Subtitle */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="text-2xl font-black tracking-tight leading-snug text-black dark:text-white">
                {stats.upcoming}
              </div>
            </div>

            {/* Bold Vibrant Icon Button */}
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#d97706" }}
            >
              <RotateCcw size={20} />
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div
          className="group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
          style={{
            backgroundColor: "#fff5f5",
            border: "1.5px solid #feb2b2",
          }}
        >
          {/* Top Row: Title */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="text-[13.5px] font-extrabold uppercase tracking-wider leading-tight text-slate-900 dark:text-white">
              Milestones (Overdue)
            </span>
          </div>

          {/* Main Primary Metric & Subtitle */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="text-2xl font-black tracking-tight leading-snug text-black dark:text-white">
                {stats.overdue}
              </div>
            </div>

            {/* Bold Vibrant Icon Button */}
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#e53e3e" }}
            >
              <AlertTriangle size={20} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Overall Progress & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Columns - Milestone Deadline Tracker & Flow */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Milestone Deadline Tracker Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ListTodo size={18} className="text-[#008a45]" />
                  Milestone Deadline Tracker
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800">
                    <th className="w-10"></th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider w-12 text-center">
                      #
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                      Planned Date
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                      Actual Date
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                      Days Left / Overdue
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                      Deviation
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                      Completion Status
                    </th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider w-28">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {milestones.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${getRowBgClass(item.scheduleStatus)}`}
                    >
                      <td className="relative w-10 text-center py-0">
                        {/* Connecting Line */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-[#008a45] z-0 ${
                            idx === 0
                              ? "top-1/2 bottom-0"
                              : idx === milestones.length - 1
                                ? "top-0 bottom-1/2"
                                : "top-0 bottom-0"
                          }`}
                        />

                        {/* Node Circle */}
                        <div
                          className={`relative z-10 mx-auto h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-xs border-2 border-white dark:border-slate-900 ${
                            item.scheduleStatus === "On Time"
                              ? "bg-(--primary-color,#008a45) text-white"
                              : item.scheduleStatus === "In Progress"
                                ? "bg-amber-500 text-white animate-pulse"
                                : item.scheduleStatus === "Overdue"
                                  ? "bg-rose-500 text-white"
                                  : "bg-slate-50 text-slate-400 dark:bg-slate-855 dark:text-slate-600 border-slate-200 dark:border-slate-855"
                          }`}
                        >
                          {item.scheduleStatus === "On Time" ? (
                            <Check size={12} strokeWidth={3} />
                          ) : item.scheduleStatus === "In Progress" ? (
                            <Clock size={12} strokeWidth={3} />
                          ) : item.scheduleStatus === "Overdue" ? (
                            <AlertTriangle size={12} strokeWidth={3} />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-350 dark:bg-slate-600" />
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          {item.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                          {item.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-855 dark:text-slate-255 text-xs">
                          {item.deadlineDate}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-xs text-slate-600 dark:text-slate-400">
                        {item.completionDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeClasses(item.daysDiffType)}`}
                        >
                          {item.daysDiffText}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={getScheduleStatusBadge(
                            item.scheduleStatus,
                          )}
                        >
                          {item.scheduleStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={getCompletionStatusBadge(
                            item.completionStatus,
                          )}
                        >
                          {item.completionStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.progress === 100 ? "bg-(--primary-color,#008a45)" : item.progress > 0 ? "bg-(--warning-color,#f59e0b)" : "bg-slate-350"}`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-455 font-mono w-8">
                            {item.progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Columns - Overall Progress & Demand Cycle Management */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Overall Progress Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider mb-4">
              Overall Progress
            </h3>

            <div className="flex flex-col items-center justify-center py-3">
              {/* Circular SVG Progress Bar */}
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="absolute transform -rotate-90 h-32 w-32">
                  {/* Track ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    fill="transparent"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    strokeDasharray={326.7}
                    strokeDashoffset={
                      326.7 - (326.7 * stats.completedPercent) / 100
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    className="text-(--primary-color,#008a45) transition-all duration-500"
                    fill="transparent"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 block">
                    {stats.completedPercent}%
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider mt-0.5">
                    Completed
                  </span>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {stats.completed} of {stats.total} Milestones Completed
                </p>
              </div>
            </div>
          </div>

          {/* Demand Cycle Management */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider">
                TEXTBOOK PRINTING CYCLE
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {DEMAND_CYCLES.map((cycle) => (
                <div
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedCycle === cycle.id
                      ? "border-(--primary-border,#c2d8be) bg-(--primary-light-bg,#f0fdf4)/50 dark:bg-emerald-950/10"
                      : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-855/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {cycle.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        cycle.status === "Active"
                          ? "bg-(--primary-light-bg,#eaf5ea) text-(--primary-color,#008a45) border-(--primary-border,#c2d8be) dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                          : cycle.status === "Completed"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
                            : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }`}
                    >
                      {cycle.statusText}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar
                      size={10}
                      className="text-slate-500 dark:text-slate-400"
                    />
                    {cycle.periodText}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center animate-pulse">
              <a
                href="#all-cycles"
                className="text-xs font-bold text-[#008a45] hover:text-[#00753a] inline-flex items-center gap-1 transition-colors"
              >
                View All Cycles
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default TimelineDashboardPage;
