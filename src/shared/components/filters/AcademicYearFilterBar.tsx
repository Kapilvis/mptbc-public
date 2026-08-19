import { Calendar, Filter } from "lucide-react";
import { DropDownList } from "../forms";

export interface AcademicYearFilterBarProps {
  academicYear: string;
  onChange: (year: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const ACADEMIC_YEAR_OPTIONS = [
  { label: "2026-2027 (Current FY)", value: "2026-2027" },
  { label: "2025-2026 (Prior FY)", value: "2025-2026" },
  { label: "2024-2025 (Archived)", value: "2024-2025" },
];

export default function AcademicYearFilterBar({
  academicYear,
  onChange,
  title = "Academic ",
  subtitle,
  className = "",
}: AcademicYearFilterBarProps) {
  const getBadgeClass = (year: string) => {
    switch (year) {
      case "2026-2027":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "2025-2026":
        return "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "2024-2025":
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
          <Calendar size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {title}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold border ${getBadgeClass(academicYear)}`}
            >
              Session: {academicYear}
            </span>
          </div>
          <span className="text-[15px] font-medium text-slate-800 dark:text-slate-400 block mt-0.5">
            {subtitle ||
              `Filter real-time operational data, supply chain metrics, and reports by academic year (${academicYear}).`}
          </span>
        </div>
      </div>

      <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
        <Filter size={16} className="text-slate-400 shrink-0" />
        <div className="flex-1">
          <DropDownList
            data={ACADEMIC_YEAR_OPTIONS}
            value={academicYear}
            onChange={(val) => onChange(String(val ?? "2026-2027"))}
            textField="label"
            optionValue="value"
          />
        </div>
      </div>
    </div>
  );
}
