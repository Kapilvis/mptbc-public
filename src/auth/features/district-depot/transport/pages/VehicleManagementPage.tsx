import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { vehicleData, type VehicleItem } from "../data";
import { depotDropdownItems } from "../../data";

const emptyForm = {
  vehicleNo: "",
  type: "",
  makeModel: "",
  regDate: "",
  driverName: "",
  depotCode: "",
  insuranceCo: "",
  policyNo: "",
  insuranceValidTo: "",
  fitnessValidTo: "",
  pucValidTo: "",
};

function StatusBadge({ status }: { status: VehicleItem["status"] }) {
  const cls = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    Inactive: "bg-rose-50 text-rose-700 border-rose-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(vehicleData);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = vehicles.filter(
    (v) =>
      !search ||
      v.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.vehicleNo || !form.depotCode) {
      ToastService.error("Vehicle No and Depot are required");
      return;
    }
    const newItem: VehicleItem = {
      id: vehicles.length + 1,
      vehicleNo: form.vehicleNo.toUpperCase(),
      type: form.type || "Truck",
      makeModel: form.makeModel || "Unknown",
      regDate: form.regDate || new Date().toLocaleDateString("en-GB"),
      driverName: form.driverName || "Not Assigned",
      depotCode: form.depotCode,
      insuranceCo: form.insuranceCo || "N/A",
      policyNo: form.policyNo || "N/A",
      insuranceValidTo: form.insuranceValidTo || "N/A",
      fitnessValidTo: form.fitnessValidTo || "N/A",
      pucValidTo: form.pucValidTo || "N/A",
      status: "Active",
    };
    setVehicles((prev) => [newItem, ...prev]);
    setForm(emptyForm);
    ToastService.success("Vehicle registered successfully!");
  };

  return (
    <Page
      header="Vehicle Management"
      subHeader="वाहन प्रबंधन — Register and track depot vehicles, insurance, and fitness."
      showHeaderActions
    >
      <Card className="mb-4">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <i className="pi pi-car text-indigo-600" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Register Vehicle
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Vehicle No *",
              field: "vehicleNo",
              type: "text",
              placeholder: "e.g. MP04GA4120",
            },
            {
              label: "Depot *",
              field: "depotCode",
              type: "select",
              options: depotDropdownItems,
            },
            {
              label: "Vehicle Type",
              field: "type",
              type: "text",
              placeholder: "e.g. Truck, Mini Truck",
            },
            {
              label: "Make/Model",
              field: "makeModel",
              type: "text",
              placeholder: "e.g. Tata LPT",
            },
            { label: "Registration Date", field: "regDate", type: "date" },
            {
              label: "Driver Name",
              field: "driverName",
              type: "text",
              placeholder: "Assigned driver",
            },
            {
              label: "Insurance Company",
              field: "insuranceCo",
              type: "text",
              placeholder: "e.g. New India",
            },
            {
              label: "Policy No",
              field: "policyNo",
              type: "text",
              placeholder: "Policy number",
            },
            {
              label: "Insurance Valid To",
              field: "insuranceValidTo",
              type: "date",
            },
            {
              label: "Fitness Valid To",
              field: "fitnessValidTo",
              type: "date",
            },
            { label: "PUC Valid To", field: "pucValidTo", type: "date" },
          ].map(({ label, field, type, placeholder, options }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {label}
              </label>
              {type === "select" ? (
                <select
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="">-- Select --</option>
                  {options?.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.text}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/30"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <Button
            onClick={handleSave}
            label="Register Vehicle"
            icon="pi pi-check"
            variant="primary"
          />
          <Button
            onClick={() => setForm(emptyForm)}
            label="Reset"
            variant="outlined"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <i className="pi pi-list text-indigo-600" />
            <span className="text-sm font-bold">Vehicle Fleet</span>
            <span className="ml-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="relative">
            <i className="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles..."
              className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white w-56"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "#",
                  "Vehicle No",
                  "Depot",
                  "Type/Model",
                  "Driver",
                  "Insurance Exp.",
                  "Fitness Exp.",
                  "PUC Exp.",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 hover:bg-indigo-50/30"
                >
                  <td className="px-3 py-2.5 text-gray-400">{row.id}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-gray-800">
                    {row.vehicleNo}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-gray-700">
                    {row.depotCode}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-gray-800">
                      {row.type}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {row.makeModel}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {row.driverName}
                  </td>
                  <td className="px-3 py-2.5 text-rose-600 font-medium">
                    {row.insuranceValidTo}
                  </td>
                  <td className="px-3 py-2.5 text-amber-600 font-medium">
                    {row.fitnessValidTo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-medium">
                    {row.pucValidTo}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}
