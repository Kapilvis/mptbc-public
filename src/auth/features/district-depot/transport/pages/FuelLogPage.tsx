import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { fuelLogData, type FuelLogItem } from "../data";
import { depotDropdownItems } from "../../data";

const emptyForm = {
  vehicleNo: "",
  date: "",
  depotCode: "",
  fuelType: "Diesel",
  qtyLitre: "",
  ratePerLitre: "",
  meterReading: "",
  fuelStation: "",
  billNo: "",
  grantHead: "Transport Allocation",
};

export default function FuelLogPage() {
  const [logs, setLogs] = useState<FuelLogItem[]>(fuelLogData);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
      l.fuelStation.toLowerCase().includes(search.toLowerCase()) ||
      l.billNo.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (
      !form.vehicleNo ||
      !form.depotCode ||
      !form.qtyLitre ||
      !form.ratePerLitre
    ) {
      ToastService.error("Please fill all required fields");
      return;
    }
    const qty = parseFloat(form.qtyLitre) || 0;
    const rate = parseFloat(form.ratePerLitre) || 0;
    const newItem: FuelLogItem = {
      id: logs.length + 1,
      vehicleNo: form.vehicleNo.toUpperCase(),
      date: form.date || new Date().toLocaleDateString("en-GB"),
      depotCode: form.depotCode,
      fuelType: form.fuelType as FuelLogItem["fuelType"],
      qtyLitre: qty,
      ratePerLitre: rate,
      totalAmount: qty * rate,
      meterReading: parseInt(form.meterReading) || 0,
      fuelStation: form.fuelStation,
      billNo: form.billNo,
      grantHead: form.grantHead,
    };
    setLogs((prev) => [newItem, ...prev]);
    setForm(emptyForm);
    ToastService.success("Fuel log entry saved!");
  };

  const totalAmount = filtered.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <Page
      header="Vehicle Fuel & Grant Log"
      subHeader="ईंधन लॉग — Track daily fuel consumption and transport grant utilization."
      showHeaderActions
    >
      <Card className="mb-4">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <i className="pi pi-filter text-indigo-600" />
          <span className="text-sm font-bold text-gray-800">
            Add Fuel Entry
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
            { label: "Date", field: "date", type: "date" },
            {
              label: "Depot *",
              field: "depotCode",
              type: "select",
              options: depotDropdownItems,
            },
            {
              label: "Fuel Type",
              field: "fuelType",
              type: "select",
              options: [
                { id: "Diesel", text: "Diesel" },
                { id: "Petrol", text: "Petrol" },
                { id: "CNG", text: "CNG" },
              ],
            },
            {
              label: "Quantity (Litre) *",
              field: "qtyLitre",
              type: "number",
              placeholder: "0.00",
            },
            {
              label: "Rate per Litre (₹) *",
              field: "ratePerLitre",
              type: "number",
              placeholder: "0.00",
            },
            {
              label: "Meter Reading",
              field: "meterReading",
              type: "number",
              placeholder: "Current odometer",
            },
            {
              label: "Fuel Station",
              field: "fuelStation",
              type: "text",
              placeholder: "Pump name/location",
            },
            {
              label: "Bill / Receipt No",
              field: "billNo",
              type: "text",
              placeholder: "Bill number",
            },
            {
              label: "Grant Head",
              field: "grantHead",
              type: "text",
              placeholder: "e.g. Transport Allocation",
            },
          ].map(({ label, field, type, placeholder, options }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                {label}
              </label>
              {type === "select" ? (
                <select
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30"
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
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/30"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <Button
            onClick={handleSave}
            label="Save Log Entry"
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
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <i className="pi pi-list text-indigo-600" />
            <span className="text-sm font-bold">Fuel Consumption Log</span>
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
              placeholder="Search logs..."
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
                  "Date",
                  "Vehicle No",
                  "Depot",
                  "Fuel Type",
                  "Qty (L)",
                  "Rate",
                  "Total Amount",
                  "Meter Reading",
                  "Station/Bill",
                  "Grant Head",
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
                  <td className="px-3 py-2.5 text-gray-600">{row.date}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-gray-800">
                    {row.vehicleNo}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-gray-700">
                    {row.depotCode}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{row.fuelType}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-indigo-700">
                    {row.qtyLitre.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-600">
                    ₹{row.ratePerLitre.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-800">
                    ₹{row.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-500">
                    {row.meterReading.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-gray-800">{row.fuelStation}</div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      Bill: {row.billNo}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{row.grantHead}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                <td
                  colSpan={7}
                  className="px-3 py-2.5 text-gray-700 text-right"
                >
                  Total Fuel Expenditure
                </td>
                <td className="px-3 py-2.5 text-right text-indigo-800">
                  ₹{totalAmount.toLocaleString()}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </Page>
  );
}
