import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import DatePicker from "shared/components/forms/DatePicker";
import { ToastService } from "services";
import { ClipboardList, Calendar, Hourglass } from "lucide-react";

const milestoneNames = [
  "Demand Submission (Books)",
  "Demand Approval",
  "Paper Tender",
  "Printer Tender",
  "Paper Work Allocation",
  "Printer Work Allocation",
  "Paper Distribution to Central Depot",
  "Lab Testing (Paper)",
  "Central Depot to Printer (Paper)",
  "Printer to Depot (Books)",
  "Depot to Block Distribution (Books)",
];

// Default durations for testing/UX preview (offsets relative to base date)
const initialDurations = [0, 5, 15, 22, 25, 29, 44, 54, 74, 86, 101];

const formatDateStr = (date: Date | null): string => {
  if (!date) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getDayOfWeek = (date: Date | null): string => {
  if (!date) return "";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

const calculateDates = (
  baseDate: Date | null,
  durations: number[],
): (Date | null)[] => {
  if (!baseDate) return Array(11).fill(null);
  const dates: Date[] = [];
  // Milestone 1 (Demand Submission) is the base date itself
  dates.push(new Date(baseDate));

  for (let i = 1; i < 11; i++) {
    const daysFromBase = durations[i] || 0;
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + daysFromBase);
    dates.push(targetDate);
  }
  return dates;
};

export const AddProductionTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Form states
  const [productionYear, setProductionYear] = useState("2026-27");
  const [baseDate, setBaseDate] = useState<Date | null>(new Date(2026, 3, 1));
  const [durations, setDurations] = useState<number[]>(initialDurations);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  // Recalculated expected dates
  const calculatedDates = useMemo(() => {
    return calculateDates(baseDate, durations);
  }, [baseDate, durations]);

  // Duration difference details for summary card
  const summaryDetails = useMemo(() => {
    // In relative-to-base calculation, the final milestone offset represents the total duration from start
    const totalDuration = durations[10] || 0;
    const startDateStr = baseDate ? formatDateStr(baseDate) : "-";
    const finalDate = calculatedDates[10];
    const finalExpectedDateStr = finalDate ? formatDateStr(finalDate) : "-";

    return {
      totalDuration,
      startDateStr,
      finalExpectedDateStr,
    };
  }, [baseDate, calculatedDates, durations]);

  const handleDurationChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, ""); // Allow numeric whole numbers only
    const num = cleanVal === "" ? 0 : parseInt(cleanVal, 10);

    const updated = [...durations];
    updated[index] = num;
    setDurations(updated);

    // Clear error
    if (errors[`duration-${index}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`duration-${index}`];
      setErrors(updatedErrors);
    }
  };

  const handleSave = () => {
    const validationErrors: Record<string, string> = {};

    if (!baseDate) {
      validationErrors.baseDate = "Start Date is required.";
    }

    durations.forEach((d, idx) => {
      if (idx > 0 && (d === undefined || d === null || isNaN(d))) {
        validationErrors[`duration-${idx}`] = "Duration is required.";
      }
      if (idx > 0 && d < 0) {
        validationErrors[`duration-${idx}`] = "Duration cannot be negative.";
      }
      if (idx > 0 && d < durations[idx - 1]) {
        validationErrors[`duration-${idx}`] =
          "Days must be greater than or equal to the previous milestone.";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      ToastService.error("Please correct the validation errors in the form.");
      return;
    }

    // Prepare structure to save
    try {
      const savedTrackers = sessionStorage.getItem("mptbc_production_trackers");
      const currentTrackers = savedTrackers ? JSON.parse(savedTrackers) : {};

      // Map milestone array back into the app format
      const formattedMilestones = milestoneNames.map((name, idx) => {
        const date = calculatedDates[idx]!;
        // Determine Days Diff styling
        let daysDiffText = "Completed on Time";
        let daysDiffType: "remaining" | "on-time" | "overdue" = "on-time";
        let scheduleStatus: "Upcoming" | "On Time" | "Overdue" | "In Progress" =
          "Upcoming";

        if (idx === 0) {
          daysDiffText = "Completed on Time";
          daysDiffType = "on-time";
          scheduleStatus = "On Time";
        } else {
          const daysFromBase = durations[idx];
          daysDiffText = `${daysFromBase} Days Remaining`;
          daysDiffType = "remaining";
          scheduleStatus = "Upcoming";
        }

        return {
          id: idx + 1,
          name,
          description: `Timeline milestone step for textbook production: ${name}`,
          deadlineDate: formatDateStr(date),
          dayOfWeek: getDayOfWeek(date),
          completionDate: "-",
          daysDiffText,
          daysDiffType,
          scheduleStatus,
          completionStatus: "Pending",
          progress: 0,
        };
      });

      // Keyed by selected year and active cycle (default cycle-2)
      const key = `${productionYear}_cycle-2`;
      currentTrackers[key] = formattedMilestones;

      sessionStorage.setItem(
        "mptbc_production_trackers",
        JSON.stringify(currentTrackers),
      );
      ToastService.success(
        `Production tracker configuration for AY ${productionYear} saved successfully.`,
      );
      navigate("/timeline");
    } catch {
      ToastService.error("Failed to save production tracker.");
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button
        label="Back"
        icon="arrow-left"
        variant="outlined"
        onClick={() => navigate("/timeline")}
        className="font-bold text-xs"
      />
    </div>
  );

  return (
    <Page
      header="Textbook Printing Cycle"
      subHeader="Configure milestone timelines relative to the Demand Submission (Books) start date."
      showHeaderActions
    >
      {portalTarget && createPortal(headerActions, portalTarget)}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Milestones */}
        <div
          className="flex items-center gap-3.5 p-4 rounded-2xl shadow-2xs border transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: "#f0f9ff",
            borderColor: "#bae6fd",
            borderWidth: "1.5px",
          }}
        >
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: "#0284c7" }}
          >
            <ClipboardList size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-extrabold text-black uppercase tracking-wider">
              Total Milestones
            </span>
            <span className="text-base font-black text-black mt-0.5">11</span>
          </div>
        </div>

        {/* Start Date */}
        <div
          className="flex items-center gap-3.5 p-4 rounded-2xl shadow-2xs border transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: "#f0fdf4",
            borderColor: "#bbf7d0",
            borderWidth: "1.5px",
          }}
        >
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm bg-(--primary-color,#008a45)">
            <Calendar size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-extrabold text-black uppercase tracking-wider">
              Start Date
            </span>
            <span className="text-base font-black text-black mt-0.5">
              {summaryDetails.startDateStr}
            </span>
          </div>
        </div>

        {/* Final Expected Date */}
        <div
          className="flex items-center gap-3.5 p-4 rounded-2xl shadow-2xs border transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: "#eff6ff",
            borderColor: "#bfdbfe",
            borderWidth: "1.5px",
          }}
        >
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm bg-[#2563eb]">
            <Calendar size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-extrabold text-black uppercase tracking-wider">
              Final Expected Date
            </span>
            <span className="text-base font-black text-black mt-0.5">
              {summaryDetails.finalExpectedDateStr}
            </span>
          </div>
        </div>

        {/* Total Duration */}
        <div
          className="flex items-center gap-3.5 p-4 rounded-2xl shadow-2xs border transition-all duration-300 hover:shadow-md bg-(--primary-light-bg,#eaf5ea)/55 border-(--primary-border,#c2d8be)"
          style={{ borderWidth: "1.5px" }}
        >
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm bg-(--primary-color,#008a45)">
            <Hourglass size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-extrabold text-black uppercase tracking-wider">
              Total Duration
            </span>
            <span className="text-base font-black text-black mt-0.5">
              {summaryDetails.totalDuration} Days
            </span>
          </div>
        </div>
      </div>

      {/* Main Configuration Card (Full Width) */}
      <Card className="p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Configure Milestone Durations
            </h3>
          </div>

          {/* Year Select Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-550 shrink-0">
              Production Year:
            </span>
            <select
              value={productionYear}
              onChange={(e) => setProductionYear(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
            </select>
          </div>
        </div>

        {/* Form Table */}
        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-3 px-2 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider w-10 text-center">
                  #
                </th>
                <th className="py-3 px-3 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                  Milestone
                </th>
                <th className="py-3 px-3 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider w-40">
                  Duration
                </th>
                <th className="py-3 px-3 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider w-36">
                  Expected Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-355">
              {milestoneNames.map((name, index) => {
                const isFirst = index === 0;
                const dateVal = calculatedDates[index];
                const dateStr = dateVal ? formatDateStr(dateVal) : "-";

                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10"
                  >
                    {/* Number */}
                    <td className="relative w-10 text-center py-0">
                      {/* Connecting Line */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-(--primary-color,#008a45) z-0 ${
                          index === 0
                            ? "top-1/2 bottom-0"
                            : index === 10
                              ? "top-0 bottom-1/2"
                              : "top-0 bottom-0"
                        }`}
                      />
                      <span className="relative z-10 mx-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--primary-light-bg,#eaf5ea) border-2 border-(--primary-color,#008a45) text-xs font-mono font-black text-black">
                        {index + 1}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 text-xs md:text-sm">
                      {name}
                    </td>

                    {/* Input duration */}
                    <td className="py-3 px-3">
                      {isFirst ? (
                        <div className="w-36">
                          <DatePicker
                            value={baseDate}
                            onChange={(val) => setBaseDate(val)}
                            required
                            errorMessage={errors.baseDate}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 w-24">
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 focus-within:ring-2 focus-within:ring-emerald-500">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={durations[index]}
                              onChange={(e) =>
                                handleDurationChange(index, e.target.value)
                              }
                              className="w-full bg-transparent text-slate-900 dark:text-white font-bold text-xs border-none outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-[10px] font-bold text-slate-400">
                              Days
                            </span>
                          </div>
                          {errors[`duration-${index}`] && (
                            <span className="text-[10px] text-rose-600 font-medium pl-1">
                              {errors[`duration-${index}`]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Calculated Dates */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {dateStr}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Form actions footer block */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-150 pt-5 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate("/timeline")}
            className="font-bold text-xs"
          />
          <Button
            label="Save Tracker"
            icon="pi pi-save"
            onClick={handleSave}
            className="bg-(--primary-color,#008a45) hover:bg-(--primary-hover,#00753a) text-white font-bold text-xs"
          />
        </div>
      </Card>
    </Page>
  );
};

export default AddProductionTrackerPage;
