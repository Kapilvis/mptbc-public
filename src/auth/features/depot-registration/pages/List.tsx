import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Card, GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Button } from "shared/components/buttons";
import StatusButton from "shared/components/buttons/StatusButton";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useDepotRegistrationsQuery,
  useDepotRegistrationStatusMutation,
} from "../data";
import { getDepots } from "auth/features/master/depot/data";
import { mockDistricts } from "auth/features/master/district/data";

export default function List() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();

  // Queries & Mutations
  const { data: listData = [], isLoading } = useDepotRegistrationsQuery();
  const statusMutation = useDepotRegistrationStatusMutation();

  // Filters State
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [depotFilter, setDepotFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Resolving filter options
  const districtOptions = useMemo(() => mockDistricts.map((d) => d.name), []);
  const depotOptions = useMemo(() => getDepots().map((d) => d.name), []);
  const typeOptions = ["Central", "Regional", "District", "SubDepot"];

  const handleResetFilters = () => {
    setSearch("");
    setDistrictFilter("");
    setDepotFilter("");
    setTypeFilter("");
    setStatusFilter("");
  };

  // Client Side Filtering on top of Mock data
  const filteredData = useMemo(() => {
    return listData.filter((item) => {
      const matchesSearch =
        !search ||
        item.dptName.toLowerCase().includes(search.toLowerCase()) ||
        item.incharge.toLowerCase().includes(search.toLowerCase()) ||
        item.mobile.includes(search) ||
        (item.email && item.email.toLowerCase().includes(search.toLowerCase()));

      const matchesDistrict =
        !districtFilter || item.districtName === districtFilter;
      const matchesDepot = !depotFilter || item.depotName === depotFilter;
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "Active" && item.isActive) ||
        (statusFilter === "Inactive" && !item.isActive);

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesDepot &&
        matchesType &&
        matchesStatus
      );
    });
  }, [listData, search, districtFilter, depotFilter, typeFilter, statusFilter]);

  // Handlers
  const handleToggleStatus = async (item: DepotRegistration.Registration) => {
    try {
      await statusMutation.mutateAsync({
        id: item.depotRegistrationId,
        isActive: !item.isActive,
      });
      ToastService.success("Depot active status toggled successfully.");
    } catch {
      ToastService.error("Failed to update status.");
    }
  };

  return (
    <Page
      header={pageTitle || "Depot Registration"}
      subHeader="Configure textbook warehouses, storage capacities, incharge contacts, and distribution linkages."
      showHeaderActions
    >
      <div className="space-y-4">
        {/* Filter Panel */}
        <Card className="p-5 border border-slate-100 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Global Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, manager, mobile..."
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                District Filter
              </label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Districts</option>
                {districtOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Depot Filter
              </label>
              <select
                value={depotFilter}
                onChange={(e) => setDepotFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Depots</option>
                {depotOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Type Filter
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Types</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === "SubDepot" ? "Sub Depot" : t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <Button
                type="button"
                label="Reset"
                icon="refresh"
                variant="outlined"
                onClick={handleResetFilters}
                className="w-full text-xs font-bold border-slate-200 hover:bg-slate-50"
              />
            </div>
          </div>
        </Card>

        {/* Data Grid Card */}
        <Card className="border border-slate-100 shadow-xs">
          <GridPanel
            toolbarPlacement="page"
            data={filteredData}
            loading={isLoading}
            searchBox={false}
            exportFilename="mptbc_depot_registrations.xls"
            toolbar={
              <Button
                label="Add"
                icon="plus"
                onClick={() => navigate("./add")}
                variant="primary"
                className="shadow-sm font-bold text-xs"
              />
            }
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-slate-500 font-medium">
                    {option.rowIndex + 1}
                  </span>
                ),
                width: "60px",
                align: "center",
                header: "Sr. No.",
              },
              {
                field: "dptName",
                header: "DPT Name",
                sortable: true,
              },
              {
                field: "depotName",
                header: "Depot",
                sortable: true,
              },
              {
                field: "subDepotName",
                header: "Sub DPT",
                cell: (item: DepotRegistration.Registration) =>
                  item.subDepotName || (
                    <span className="text-slate-400">—</span>
                  ),
              },
              {
                field: "districtName",
                header: "District",
                sortable: true,
              },
              {
                field: "type",
                header: "Type",
                cell: (item: DepotRegistration.Registration) =>
                  item.type === "SubDepot" ? "Sub Depot" : item.type,
              },
              {
                field: "incharge",
                header: "Incharge",
              },
              {
                field: "mobile",
                header: "Mobile",
                align: "center",
              },
              {
                field: "capacity",
                header: "Capacity",
                align: "right",
                cell: (item: DepotRegistration.Registration) =>
                  item.capacity ? item.capacity.toLocaleString() : "0",
              },
              {
                field: "godowns",
                header: "Godowns",
                align: "center",
                cell: (item: DepotRegistration.Registration) =>
                  item.godowns !== undefined && item.godowns !== null
                    ? item.godowns
                    : "0",
              },
              {
                field: "isActive",
                header: "Status",
                align: "center",
                cell: (item: DepotRegistration.Registration) => (
                  <StatusButton
                    value={item.isActive}
                    onClick={() => handleToggleStatus(item)}
                  />
                ),
              },
            ]}
          />
        </Card>
      </div>
    </Page>
  );
}
