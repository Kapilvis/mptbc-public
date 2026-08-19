import { useMemo, useState } from "react";
import { depotWiseDistrictTextbookSupplyStatusData } from "../data/depotWiseDistrictTextbookSupplyStatusData";

interface FiltersProps {
  onFilterChange: (
    filtered: Report.DepotWiseDistrictTextbookSupplyStatusRow[],
  ) => void;
}

const SUPPLY_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "100% Supply", value: "100" },
  { label: "Below 100%", value: "below100" },
  { label: "Above 100%", value: "above100" },
];

export default function DepotWiseDistrictTextbookSupplyStatusFilters({
  onFilterChange,
}: FiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [supplyStatus, setSupplyStatus] = useState("");

  const depotOptions = useMemo(() => {
    return Array.from(
      new Set(
        depotWiseDistrictTextbookSupplyStatusData
          .filter(
            (r) =>
              r.depotName !== "All Depots" &&
              r.depotName !== "Previous Day Supply" &&
              r.depotName !== "Today Difference",
          )
          .map((r) => r.depotName),
      ),
    );
  }, []);

  const districtOptions = useMemo(() => {
    return Array.from(
      new Set(
        depotWiseDistrictTextbookSupplyStatusData
          .filter(
            (r) =>
              r.districtName !== "Depots Total" &&
              r.depotName !== "All Depots" &&
              r.depotName !== "Previous Day Supply" &&
              r.depotName !== "Today Difference",
          )
          .map((r) => r.districtName),
      ),
    );
  }, []);

  const handleApply = () => {
    let filtered = [...depotWiseDistrictTextbookSupplyStatusData];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.depotName.toLowerCase().includes(q) ||
          r.districtName.toLowerCase().includes(q),
      );
    }
    if (selectedDepot)
      filtered = filtered.filter((r) => r.depotName === selectedDepot);
    if (selectedDistrict)
      filtered = filtered.filter((r) => r.districtName === selectedDistrict);
    if (supplyStatus === "100")
      filtered = filtered.filter((r) => Number(r.totalSupplyPercent) === 100);
    else if (supplyStatus === "below100")
      filtered = filtered.filter((r) => Number(r.totalSupplyPercent) < 100);
    else if (supplyStatus === "above100")
      filtered = filtered.filter((r) => Number(r.totalSupplyPercent) > 100);
    onFilterChange(filtered);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedDepot("");
    setSelectedDistrict("");
    setSupplyStatus("");
    onFilterChange(depotWiseDistrictTextbookSupplyStatusData);
  };

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="min-w-45 flex-1">
          <label
            htmlFor="dw-search"
            className="mb-1 block text-xs font-semibold text-gray-600"
          >
            Search
          </label>
          <div className="relative">
            <i className="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
            <input
              id="dw-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search depot or district…"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs transition-all focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* Depot */}
        <div className="min-w-37.5">
          <label
            htmlFor="dw-depot"
            className="mb-1 block text-xs font-semibold text-gray-600"
          >
            Depot
          </label>
          <select
            id="dw-depot"
            value={selectedDepot}
            onChange={(e) => setSelectedDepot(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs transition-all focus:outline-none focus:ring-2"
          >
            <option value="">All Depots</option>
            {depotOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="min-w-37.5">
          <label
            htmlFor="dw-district"
            className="mb-1 block text-xs font-semibold text-gray-600"
          >
            District
          </label>
          <select
            id="dw-district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs transition-all focus:outline-none focus:ring-2"
          >
            <option value="">All Districts</option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Supply Status */}
        <div className="min-w-37.5">
          <label
            htmlFor="dw-supply-status"
            className="mb-1 block text-xs font-semibold text-gray-600"
          >
            Supply Status
          </label>
          <select
            id="dw-supply-status"
            value={supplyStatus}
            onChange={(e) => setSupplyStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs transition-all focus:outline-none focus:ring-2"
          >
            {SUPPLY_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2 pb-0.5">
          <button
            id="dw-apply-filter"
            type="button"
            onClick={handleApply}
            className="bg-primary-btn inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <i className="pi pi-filter text-xs" />
            Apply
          </button>
          <button
            id="dw-reset-filter"
            type="button"
            onClick={handleReset}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-200"
          >
            <i className="pi pi-refresh text-xs" />
            Reset
          </button>
          <button
            id="dw-export-btn"
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-(--primary-border) bg-(--primary-light-bg) px-4 py-2 text-xs font-semibold text-(--primary-color) transition-all hover:opacity-85"
          >
            <i className="pi pi-download text-xs" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
