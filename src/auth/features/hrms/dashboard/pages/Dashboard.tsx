import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { Modal } from "shared/components/popups";
import Grid from "shared/components/grid/Grid";
import { DropDownList } from "shared/components/forms";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useHrmsKpiMetricsQuery,
  useEmployeeDirectoryQuery,
  useDepotDeploymentStatsQuery,
  usePendingHrActionsQuery,
  useRetirementPipelineQuery,
  useProcessHrActionMutation,
} from "../queries";
import {
  initialPayMatrixBreakdown,
  type HrmsEmployee,
  type DepotDeploymentStat,
  type PayMatrixLevelBreakdown,
} from "../data";

const academicYearOptions = [
  { label: "2026 - 2027", value: "2026-2027" },
  { label: "2025 - 2026", value: "2025-2026" },
  { label: "2024 - 2025", value: "2024-2025" },
];

const cadreFilterOptions = [
  { label: "All Cadres & Types", value: "ALL" },
  { label: "Permanent Staff", value: "REGULAR" },
  { label: "Samvida Cadre", value: "SAMVIDA" },
  { label: "Contractual Staff", value: "CONTRACTUAL" },
  { label: "Outsourced Support", value: "OUTSOURCED" },
];

const locationFilterOptions = [
  { label: "All Locations / Depots", value: "ALL" },
  { label: "Bhopal HQ Apex", value: "Bhopal HQ Apex" },
  { label: "Indore District Depot", value: "Indore District Depot" },
  { label: "Ujjain District Depot", value: "Ujjain District Depot" },
  { label: "Khandwa District Depot", value: "Khandwa District Depot" },
  { label: "Jabalpur District Depot", value: "Jabalpur District Depot" },
  { label: "Gwalior Press Cell", value: "Gwalior Press Cell" },
  { label: "Sagar District Depot", value: "Sagar District Depot" },
  { label: "Rewa District Depot", value: "Rewa District Depot" },
  { label: "Mandideep Central Depot", value: "Mandideep Central Depot" },
];

export default function HrmsDashboard() {
  const pageTitle = usePageTitle();
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCadreFilter, setSelectedCadreFilter] = useState<string>("ALL");
  const [selectedLocationFilter, setSelectedLocationFilter] =
    useState<string>("ALL");
  const [selectedEmployee, setSelectedEmployee] = useState<HrmsEmployee | null>(
    null,
  );
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2026-2027");
  const [activeMasterTab, setActiveMasterTab] = useState<
    "HEATMAP" | "DIRECTORY"
  >("DIRECTORY");

  // Queries
  const { data: kpis } = useHrmsKpiMetricsQuery();
  const { data: employees = [] } = useEmployeeDirectoryQuery();
  const { data: depotStats = [] } = useDepotDeploymentStatsQuery();
  const { data: pendingActions = [] } = usePendingHrActionsQuery();
  const { data: retirements = [] } = useRetirementPipelineQuery();

  // Mutations
  const processActionMutation = useProcessHrActionMutation();

  // Filtered Depot Stats by Division
  const filteredDepotStats = useMemo(() => {
    if (selectedDivision === "ALL") return depotStats;
    return depotStats.filter((d) =>
      d.division.toUpperCase().includes(selectedDivision.toUpperCase()),
    );
  }, [depotStats, selectedDivision]);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q) ||
        emp.postingLocation.toLowerCase().includes(q) ||
        emp.financials.ifmisId.toLowerCase().includes(q);

      const matchesCadre =
        selectedCadreFilter === "ALL" ||
        emp.cadreType.toUpperCase().includes(selectedCadreFilter.toUpperCase());

      const matchesLocation =
        selectedLocationFilter === "ALL" ||
        emp.postingLocation
          .toLowerCase()
          .includes(selectedLocationFilter.toLowerCase());

      return matchesSearch && matchesCadre && matchesLocation;
    });
  }, [employees, searchQuery, selectedCadreFilter, selectedLocationFilter]);

  const handleActionDecision = (
    actionId: string,
    decision: "APPROVED" | "REJECTED",
    empName: string,
  ) => {
    processActionMutation.mutate(
      { actionId, decision },
      {
        onSuccess: () => {
          setActionSuccessMsg(
            `HR Action for ${empName} has been successfully ${decision}.`,
          );
          setTimeout(() => setActionSuccessMsg(null), 4000);
        },
      },
    );
  };

  // Grid Columns for Depot-wise Staffing Matrix
  const depotColumns: Controls.ColumnProps<DepotDeploymentStat>[] = useMemo(
    () => [
      {
        field: "division",
        header: "REGIONAL DEPOT",
        width: "180px",
        cell: (item) => (
          <span className="font-bold text-[#006A38]">{item.division}</span>
        ),
      },
      {
        field: "depotCount",
        header: "DISTRICTS COVERED",
        width: "150px",
        cell: (item) => (
          <span className="font-bold text-slate-800">
            {item.depotCount} Districts
          </span>
        ),
      },
      {
        field: "regularStaff",
        header: "PERMANENT",
        width: "110px",
        cell: (item) => (
          <span className="font-semibold text-emerald-800">
            {item.regularStaff}
          </span>
        ),
      },
      {
        field: "samvidaStaff",
        header: "SAMVIDA",
        width: "100px",
        cell: (item) => (
          <span className="font-semibold text-indigo-800">
            {item.samvidaStaff || 0}
          </span>
        ),
      },
      {
        field: "contractualStaff",
        header: "CONTRACTUAL",
        width: "110px",
        cell: (item) => (
          <span className="font-semibold text-blue-800">
            {item.contractualStaff}
          </span>
        ),
      },
      {
        field: "outsourcedStaff",
        header: "OUTSOURCED",
        width: "110px",
        cell: (item) => (
          <span className="font-semibold text-slate-700">
            {item.outsourcedStaff}
          </span>
        ),
      },
      {
        field: "totalStaff",
        header: "TOTAL DEPLOYED",
        width: "130px",
        cell: (item) => (
          <span className="font-bold text-slate-900 text-sm">
            {item.totalStaff}
          </span>
        ),
      },
      {
        field: "managerPresent",
        header: "DEPOT MANAGER",
        width: "140px",
        cell: () => (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <i className="pi pi-check-circle text-[9px]" /> 100% Posted
          </span>
        ),
      },
      {
        field: "biometricCompliancePct",
        header: "BIOMETRIC COMPLIANCE",
        width: "160px",
        cell: (item) => (
          <span className="font-bold text-emerald-700">
            {item.biometricCompliancePct}%
          </span>
        ),
      },
    ],
    [],
  );

  // Grid Columns for Pay Matrix
  const payMatrixColumns: Controls.ColumnProps<PayMatrixLevelBreakdown>[] =
    useMemo(
      () => [
        {
          field: "levelGroup",
          header: "PAY MATRIX LEVEL",
          width: "140px",
          cell: (item) => (
            <span className="font-bold text-slate-900">{item.levelGroup}</span>
          ),
        },
        {
          field: "cadreCovered",
          header: "CADRE COVERED",
          width: "180px",
          cell: (item) => (
            <span className="font-semibold text-slate-700">
              {item.cadreCovered}
            </span>
          ),
        },
        {
          field: "payScaleRange",
          header: "PAY SCALE RANGE",
          width: "160px",
          cell: (item) => (
            <span className="font-semibold text-slate-800">
              {item.payScaleRange}
            </span>
          ),
        },
        {
          field: "headcount",
          header: "HEADCOUNT",
          width: "100px",
          cell: (item) => (
            <span className="font-bold text-slate-900">{item.headcount}</span>
          ),
        },
        {
          field: "basicPay",
          header: "BASIC PAY",
          width: "120px",
          cell: (item) => (
            <span className="font-semibold text-slate-800">
              {item.basicPay}
            </span>
          ),
        },
        {
          field: "allowances",
          header: "DA & ALLOWANCES",
          width: "130px",
          cell: (item) => (
            <span className="font-semibold text-slate-800">
              {item.allowances}
            </span>
          ),
        },
        {
          field: "totalExpenditure",
          header: "TOTAL EXPENDITURE",
          width: "140px",
          cell: (item) => (
            <span className="font-extrabold text-[#006A38]">
              {item.totalExpenditure}
            </span>
          ),
        },
      ],
      [],
    );

  // Grid Columns for Staff Directory
  const employeeColumns: Controls.ColumnProps<HrmsEmployee>[] = useMemo(
    () => [
      {
        field: "employeeId",
        header: "EMP ID",
        width: "150px",
        cell: (emp) => (
          <span className="font-bold text-[#006A38]">{emp.employeeId}</span>
        ),
      },
      {
        field: "fullName",
        header: "EMPLOYEE NAME",
        width: "180px",
        cell: (emp) => (
          <span className="font-bold text-slate-900">{emp.fullName}</span>
        ),
      },
      {
        field: "designation",
        header: "DESIGNATION",
        width: "170px",
        cell: (emp) => (
          <span className="font-semibold text-slate-800">
            {emp.designation}
          </span>
        ),
      },
      {
        field: "cadreType",
        header: "CADRE TYPE",
        width: "140px",
        cell: (emp) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {emp.cadreType}
          </span>
        ),
      },
      {
        field: "postingLocation",
        header: "POSTING LOCATION",
        width: "180px",
        cell: (emp) => (
          <span className="font-semibold text-slate-800">
            {emp.postingLocation}
          </span>
        ),
      },
      {
        field: "attendanceToday",
        header: "ATTENDANCE TODAY",
        width: "150px",
        cell: (emp) => (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              emp.attendanceToday.status === "PRESENT"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            <i
              className={`pi ${
                emp.attendanceToday.status === "PRESENT"
                  ? "pi-check"
                  : "pi-clock"
              } text-[8px]`}
            />
            {emp.attendanceToday.status}
          </span>
        ),
      },
      {
        field: "financials",
        header: "IFMIS PAY LEVEL",
        width: "165px",
        cell: (emp) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-xs">
              {emp.cadreType.includes("Class I")
                ? "Level 13 (₹ 1,23,100)"
                : emp.cadreType.includes("Class II")
                  ? "Level 11 (₹ 56,100)"
                  : emp.cadreType.includes("Class III")
                    ? "Level 7 (₹ 28,700)"
                    : emp.cadreType.includes("Contractual")
                      ? "Consolidated ₹ 45,000"
                      : "Min Wage (Class IV)"}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {emp.financials.ifmisId}
            </span>
          </div>
        ),
      },
      {
        field: "employeeId",
        header: "ACTION",
        width: "130px",
        cell: (emp) => (
          <Button
            icon="pi pi-eye"
            label="View Profile"
            size="small"
            variant="outlined"
            onClick={() => setSelectedEmployee(emp)}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Page
      header={`${pageTitle || "HRMS Dashboard"}`}
      subHeader="Madhya Pradesh Textbook Corporation — Enterprise Human Resource Management & IFMIS Staff Deployment Platform."
      showHeaderActions
    >
      {/* ─── TOP NAVBAR WITH SEARCH AND ACADEMIC YEAR FILTER ──────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Emp ID, Name, Depot..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#006A38]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <i className="pi pi-calendar text-[#006A38] text-sm" />
            Academic Year:
          </label>
          <div className="w-44">
            <DropDownList
              data={academicYearOptions}
              value={selectedYear}
              onChange={(val) => setSelectedYear(String(val ?? "2026-2027"))}
              textField="label"
              optionValue="value"
              filter={false}
            />
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <i className="pi pi-check-circle text-emerald-600 text-base" />
          {actionSuccessMsg}
        </div>
      )}

      {/* ─── 4 EXECUTIVE KPI CARDS (CLEAN ICONLESS 4-COLUMN GRID) ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1: Workforce Deployment */}
        <div className="bg-[#f0f7ff] border border-[#bcd7ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                1. WORKFORCE DEPLOYMENT
              </span>
              <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full border border-blue-300">
                {kpis?.totalWorkforce || 85} Total
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 w-full text-left mt-2">
              <div>
                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                  PERMANENT
                </span>
                <div className="text-lg font-black text-slate-900">
                  {kpis?.regularCount || 30}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-wider block truncate">
                  SAMVIDA
                </span>
                <div className="text-lg font-black text-slate-900">
                  {kpis?.samvidaCount || 20}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-blue-800 uppercase tracking-wider block truncate">
                  CONTRACT
                </span>
                <div className="text-lg font-black text-slate-900">
                  {kpis?.contractualCount || 15}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider block truncate">
                  OUTSOURCE
                </span>
                <div className="text-lg font-black text-slate-900">
                  {kpis?.outsourcedCount || 20}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-700 mt-3 pt-2 border-t border-[#bfdbfe]">
            Staff Deployed:{" "}
            <strong className="text-slate-900 font-bold">
              {kpis?.totalWorkforce || 85} Active
            </strong>
          </div>
        </div>

        {/* KPI 2: Today's Attendance */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                2. TODAY'S ATTENDANCE
              </span>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">
                {kpis?.attendancePct || 91.8}% Synced
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full text-left mt-2">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  PRESENT
                </span>
                <div className="text-xl font-black text-slate-900">
                  {kpis?.presentCount || 78}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  ON LEAVE
                </span>
                <div className="text-xl font-black text-slate-900">
                  {kpis?.onLeaveCount || 7}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-700 mt-3 pt-2 border-t border-[#bbf7d0]">
            Biometric Attendance:{" "}
            <strong className="text-emerald-900 font-bold">
              {kpis?.attendancePct || 91.8}%
            </strong>
          </div>
        </div>

        {/* KPI 3: Monthly Payroll Budget */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                3. MONTHLY PAYROLL
              </span>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                {kpis?.monthlyPayrollBudget || "₹ 20.00 Lakhs"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full text-left mt-2">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  SANCTIONED
                </span>
                <div className="text-xl font-black text-slate-900">
                  {kpis?.monthlyPayrollBudget || "₹ 20.00 Lakhs"}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  DISBURSED
                </span>
                <div className="text-xl font-black text-slate-900">
                  {kpis?.disbursedPayroll || "₹ 19.65 Lakhs"}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-700 mt-3 pt-2 border-t border-[#fde68a]">
            IFMIS Bank Transfer:{" "}
            <strong className="text-slate-900 font-bold">
              {kpis?.ifmisDisbursedPct || 98.3}% Complete
            </strong>
          </div>
        </div>

        {/* KPI 4: Pending HR Actions */}
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                4. PENDING HR ACTIONS
              </span>
              <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-1 rounded-full border border-rose-300">
                6 Pending
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 w-full text-left mt-2">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  LEAVE
                </span>
                <div className="text-xl font-black text-slate-900">3</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  TRANSFER
                </span>
                <div className="text-xl font-black text-slate-900">2</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                  APAR
                </span>
                <div className="text-xl font-black text-slate-900">1</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-700 mt-3 pt-2 border-t border-[#bae6fd]">
            Total Files Pending:{" "}
            <strong className="text-rose-700 font-bold">
              6 Action Required
            </strong>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: INTERACTIVE ANALYTICS CHARTS ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Visual 1: Staff Breakdown by Employee Category & Office */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-[#006A38] text-base font-extrabold uppercase tracking-wider flex items-center gap-2">
                <i className="pi pi-chart-bar text-[#006A38]" />
                Staff Breakdown by Employee Category & Office
              </h3>
              <p className="text-xs text-slate-800 font-bold mt-0.5">
                Total 85 Employees working across Permanent (30), Samvida (20),
                Contractual (15), and Outsourced (20) Roles.
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#006A38] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
              Sanctioned Staff
            </span>
          </div>

          <div className="space-y-4">
            {/* Bar 1: Permanent Staff */}
            <div>
              <div className="flex justify-between text-sm font-extrabold mb-1 text-slate-900">
                <span>
                  Permanent Officers & Staff (GMs, Depot Managers, Regular
                  Cadre)
                </span>
                <span className="text-slate-900">30 (35.3%)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#006A38] h-full rounded-full"
                  style={{ width: "35.3%" }}
                />
              </div>
            </div>

            {/* Bar 2: Samvida Cadre Staff */}
            <div>
              <div className="flex justify-between text-sm font-extrabold mb-1 text-slate-900">
                <span>
                  Samvida Personnel (Depot Cadre & Technical Inspectors)
                </span>
                <span className="text-slate-900">20 (23.5%)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: "23.5%" }}
                />
              </div>
            </div>

            {/* Bar 3: Contractual Personnel */}
            <div>
              <div className="flex justify-between text-sm font-extrabold mb-1 text-slate-900">
                <span>
                  Contractual Personnel (Depot Assistants, IT Data Analysts)
                </span>
                <span className="text-slate-900">15 (17.6%)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: "17.6%" }}
                />
              </div>
            </div>

            {/* Bar 4: Outsourced Helpers & Security */}
            <div>
              <div className="flex justify-between text-sm font-extrabold mb-1 text-slate-900">
                <span>
                  Outsourced Warehouse Helpers & Depot Security (Mandideep &
                  Depots)
                </span>
                <span className="text-slate-900">20 (23.5%)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: "23.5%" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-800 font-extrabold block text-xs">
                HEAD OFFICE
              </span>
              <strong className="text-slate-900 font-black text-sm">
                12 Staff
              </strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-800 font-extrabold block text-xs">
                51 DEPOTS
              </span>
              <strong className="text-slate-900 font-black text-sm">
                55 Staff
              </strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-800 font-extrabold block text-xs">
                MANDIDEEP WAREHOUSE
              </span>
              <strong className="text-slate-900 font-black text-sm">
                10 Staff
              </strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-800 font-extrabold block text-xs">
                QUALITY WING
              </span>
              <strong className="text-slate-900 font-black text-sm">
                8 Staff
              </strong>
            </div>
          </div>
        </div>

        {/* Visual 2: Daily Staff Attendance Summary - Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i className="pi pi-chart-pie text-[#006A38]" />
                Daily Staff Attendance Summary
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Today: 91.8% Synced
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              {/* SVG Interactive Donut Chart */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Segment 1: Present (91.8%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#1e9b61ff"
                    strokeWidth="14"
                    strokeDasharray="219.1 238.7"
                    strokeDashoffset="0"
                    fill="transparent"
                    className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  />
                  {/* Segment 2: On Leave (8.2%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f32c25ff"
                    strokeWidth="14"
                    strokeDasharray="19.6 238.7"
                    strokeDashoffset="-219.1"
                    fill="transparent"
                    className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  />
                </svg>

                {/* Center Badge Text */}
                <div className="absolute text-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 block tracking-tight">
                    91.8%
                  </span>
                  <span className="text-[10px] font-extrabold text-[#006A38] uppercase tracking-wider block">
                    78 Present
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-3 w-full flex-1">
                <div className="flex items-center justify-between text-xs bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#006A38] shrink-0" />
                    <span className="font-bold text-slate-900">
                      Present Today
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="text-slate-900 font-extrabold block">
                      78
                    </strong>
                    <span className="text-[10px] text-emerald-800 font-bold">
                      91.8%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-bold text-slate-900">On Leave</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-slate-900 font-extrabold block">
                      7
                    </strong>
                    <span className="text-[10px] text-rose-800 font-bold">
                      8.2%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Module Summary Highlights */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50/80 border border-emerald-200/80 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">
                  AVG CHECK-IN
                </span>
                <strong className="text-slate-900 font-extrabold text-xs block mt-0.5">
                  09:24 AM
                </strong>
              </div>
              <div className="bg-blue-50/80 border border-blue-200/80 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-blue-800 block uppercase tracking-wider">
                  BIOMETRIC SYNC
                </span>
                <strong className="text-slate-900 font-extrabold text-xs block mt-0.5">
                  58 Devices
                </strong>
              </div>
              <div className="bg-amber-50/80 border border-amber-200/80 p-2 rounded-xl">
                <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wider">
                  APPROVED LEAVES
                </span>
                <strong className="text-slate-900 font-extrabold text-xs block mt-0.5">
                  3 Staff
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: EXECUTIVE HR ACTION CENTER & RETIREMENT PIPELINE ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 Cols: Executive HR Action & Approval Center */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i className="pi pi-check-square text-rose-600" />
                Action & Approval Center (6 Requests Pending)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official Leave Approvals, Transfer Requests, and Annual APAR
                Verification Queue.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              High Priority Action
            </span>
          </div>

          <div className="space-y-3.5">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        action.type === "LEAVE"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : action.type === "TRANSFER"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-indigo-100 text-indigo-800 border border-indigo-300"
                      }`}
                    >
                      {action.type}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {action.employeeName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      ({action.employeeId})
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      {action.designation}
                    </strong>{" "}
                    • {action.location}
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{action.requestDetails}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  {action.status === "PENDING" ? (
                    <>
                      <Button
                        label="Reject"
                        icon="pi pi-times"
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleActionDecision(
                            action.id,
                            "REJECTED",
                            action.employeeName,
                          )
                        }
                        className="text-xs font-bold"
                      />
                      <Button
                        label="Approve"
                        icon="pi pi-check"
                        size="small"
                        variant="primary"
                        onClick={() =>
                          handleActionDecision(
                            action.id,
                            "APPROVED",
                            action.employeeName,
                          )
                        }
                        className="text-xs font-bold bg-[#006A38] border-[#006A38] hover:bg-[#00522b]"
                      />
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        action.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {action.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Staff Retiring This Year (2026-27) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="pi pi-user-minus text-[#006A38]" />
              Staff Retiring This Year (2026-27)
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              Pension Status
            </span>
          </div>

          <div className="space-y-3">
            {retirements.map((ret, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      {ret.employeeName}
                    </h4>
                    <p className="text-xs text-slate-700 font-bold mt-0.5">
                      {ret.designation} • {ret.postingLocation}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Retiring in {ret.daysRemaining} Days
                  </span>
                </div>
                <div className="mt-2.5 flex justify-between items-center text-xs text-slate-800 border-t border-slate-200/80 pt-2 font-bold">
                  <span>
                    Retirement Date:{" "}
                    <strong className="font-extrabold text-slate-900">
                      {ret.superannuationDate}
                    </strong>
                  </span>
                  <span className="text-slate-700">{ret.pensionNo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 4: PAYROLL (LEFT 60/40) & APAR / GRIEVANCES DESK (RIGHT 40) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 Cols (Bigger Side): Monthly Staff Payroll & Salary Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-wallet text-[#006A38]" />
                  Monthly Staff Payroll & Salary Breakdown
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  7th Pay Commission Matrix levels, DA (50%), HRA, NPS/GPF
                  deductions & Treasury bills.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-300 shrink-0">
                IFMIS Voucher Status: Approved & Disbursed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  GROSS SALARY
                </span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  ₹ 20,00,000
                </div>
                <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                  Monthly Commitment
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  NPS / GPF DEDUCTION
                </span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  ₹ 2,00,000
                </div>
                <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                  Remitted to Treasury
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  OUTSOURCED EPF
                </span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  ₹ 90,000
                </div>
                <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                  18 Support Staff
                </span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">
                  NET DISBURSED
                </span>
                <div className="text-base font-black text-emerald-900 mt-0.5">
                  ₹ 17,10,000
                </div>
                <span className="text-[10px] font-bold text-emerald-800 block mt-0.5">
                  100% Bank Credit
                </span>
              </div>
            </div>

            <div className="p-1">
              <Grid
                data={initialPayMatrixBreakdown}
                columns={payMatrixColumns}
                paginator={false}
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col (Shorter Side): Annual Performance Appraisal (APAR) & Grievances Desk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i className="pi pi-file text-[#006A38]" />
                APAR & Grievances Desk
              </h3>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                FY25-26: 94% Done
              </span>
            </div>

            {/* APAR Progress Bars */}
            <div className="space-y-3 mb-5">
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
                APAR FILING REVIEW STATUS
              </h4>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Submitted by Employee:</span>
                  <span className="text-slate-900 font-extrabold">97%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: "97%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Reviewed by Officer:</span>
                  <span className="text-slate-900 font-extrabold">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Approved by MD:</span>
                  <span className="text-slate-900 font-extrabold">77%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: "77%" }}
                  />
                </div>
              </div>
            </div>

            {/* Grievance Tickets Summary */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
                EMPLOYEE GRIEVANCE REDRESSAL
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-amber-50/60 border border-amber-200 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 block uppercase">
                    OPEN TICKETS
                  </span>
                  <div className="text-base font-black text-amber-900 mt-0.5">
                    2 Tickets
                  </div>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                    RESOLVED MONTH
                  </span>
                  <div className="text-base font-black text-emerald-900 mt-0.5">
                    4 Tickets
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-[#006A38]">
                    GRV-2026-881
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    IN PROGRESS
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  Rajeshwar Tiwari • Ujjain Depot
                </p>
                <p className="text-[11px] text-slate-600 font-medium">
                  Service Book Increment Anomaly
                </p>
              </div>
            </div>
          </div>

          <div className="text-[13px] text-slate-600 font-medium text-center border-t border-slate-100 pt-3 mt-3">
            Avg Resolution SLA:{" "}
            <strong className="text-slate-900 font-bold">3.2 Days</strong>{" "}
            (Target: &lt; 5 Days)
          </div>
        </div>
      </div>

      {/* ─── SECTION 6: TABBED MASTER DIRECTORY & DEPOT HEATMAP ──────────────── */}
      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="pi pi-briefcase text-[#006A38]" />
              Staff Master Directory & Depot Deployment
            </h3>
          </div>

          {/* Master View Tabs Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveMasterTab("DIRECTORY")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeMasterTab === "DIRECTORY"
                  ? "bg-[#006A38] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <i className="pi pi-users text-xs" />
              Master Employee Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveMasterTab("HEATMAP")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeMasterTab === "HEATMAP"
                  ? "bg-[#006A38] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <i className="pi pi-building text-xs" />
              District Depots Deployment
            </button>
          </div>
        </div>

        {/* TAB 1: DISTRICT DEPOTS DEPLOYMENT MATRIX */}
        {activeMasterTab === "HEATMAP" && (
          <div>
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  District Depots Staff Deployment Heatmap
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Sanctioned vs Working Strength across MP State Administrative
                  Divisions & 8 Regional Depots.
                </p>
              </div>

              {/* Division Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  "ALL",
                  "BHOPAL",
                  "INDORE",
                  "GWALIOR",
                  "JABALPUR",
                  "SAGAR",
                  "UJJAIN",
                  "REWA",
                ].map((div) => (
                  <button
                    key={div}
                    type="button"
                    onClick={() => setSelectedDivision(div)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedDivision === div
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    {div}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2">
              <Grid
                data={filteredDepotStats}
                columns={depotColumns}
                paginator={false}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MASTER EMPLOYEE SERVICE DIRECTORY */}
        {activeMasterTab === "DIRECTORY" && (
          <div>
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Master Employee Directory (85 Personnel)
                </h4>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {filteredEmployees.length} Officers Listed
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <div className="w-48">
                  <DropDownList
                    data={cadreFilterOptions}
                    value={selectedCadreFilter}
                    onChange={(val) =>
                      setSelectedCadreFilter(String(val ?? "ALL"))
                    }
                    textField="label"
                    optionValue="value"
                    filter={false}
                  />
                </div>

                <div className="w-52">
                  <DropDownList
                    data={locationFilterOptions}
                    value={selectedLocationFilter}
                    onChange={(val) =>
                      setSelectedLocationFilter(String(val ?? "ALL"))
                    }
                    textField="label"
                    optionValue="value"
                    filter={false}
                  />
                </div>

                <Button
                  label="Add Employee"
                  icon="pi pi-user-plus"
                  onClick={() => alert("New Employee Registration modal opens")}
                  variant="primary"
                  className="shadow-sm font-bold text-xs bg-[#006A38] border-[#006A38] hover:bg-[#00522b]"
                />
              </div>
            </div>

            <div className="p-2">
              <Grid
                data={filteredEmployees}
                columns={employeeColumns}
                paginator={true}
                rows={10}
                searchFields={[
                  "employeeId",
                  "fullName",
                  "designation",
                  "postingLocation",
                ]}
              />
            </div>
          </div>
        )}
      </Card>

      {/* ─── MODAL OVERLAY FOR EMPLOYEE BLUEPRINT DETAILS ──────────────────────── */}
      {selectedEmployee && (
        <Modal
          visible={!!selectedEmployee}
          onHide={() => setSelectedEmployee(null)}
          header={`Service Book Blueprint — ${selectedEmployee.fullName}`}
          size="medium"
        >
          <div className="space-y-4 text-xs p-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedEmployee.fullName}
                </h3>
                <p className="text-xs text-[#006A38] font-bold font-mono mt-0.5">
                  {selectedEmployee.employeeId} • {selectedEmployee.designation}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedEmployee.postingLocation} ({selectedEmployee.zone})
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {selectedEmployee.cadreType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="text-slate-500 font-semibold block mb-1">
                  Contact & Email
                </span>
                <div className="font-bold text-slate-900">
                  {selectedEmployee.contact.email}
                </div>
                <div className="font-mono text-slate-700">
                  {selectedEmployee.contact.phone}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="text-slate-500 font-semibold block mb-1">
                  IFMIS Payroll ID
                </span>
                <div className="font-bold text-slate-900 font-mono text-sm">
                  {selectedEmployee.financials.ifmisId}
                </div>
                <div className="text-slate-600 font-medium">
                  {selectedEmployee.financials.basicPayLevel}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] border-b pb-1">
                Official Service Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  Date of Joining:{" "}
                  <strong className="font-bold">
                    {selectedEmployee.serviceDetails.dateOfJoining}
                  </strong>
                </div>
                <div>
                  Superannuation Date:{" "}
                  <strong className="font-bold">
                    {selectedEmployee.serviceDetails.superannuationDate}
                  </strong>
                </div>
                <div>
                  APAR Verification:{" "}
                  <strong className="text-emerald-700 font-bold">
                    {selectedEmployee.serviceDetails.aparStatus}
                  </strong>
                </div>
                <div>
                  Digital Service Book:{" "}
                  <strong className="text-blue-700 font-bold">
                    Verified & Synced
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Page>
  );
}
