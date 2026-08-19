import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import {
  transportOrderData,
  type TransportOrderItem,
  vendorList,
} from "../data";
import { depotDropdownItems, blockList } from "../../data";

const emptyForm = {
  vendorName: "",
  depotCode: "",
  routeTo: "",
  vehicleNo: "",
  qtyTon: "",
  payableAmount: "",
  orderDate: "",
};

function StatusBadge({ status }: { status: TransportOrderItem["status"] }) {
  const cls = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Transit": "bg-blue-50 text-blue-700 border-blue-200",
    Assigned: "bg-amber-50 text-amber-700 border-amber-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

export default function TransportOrdersPage() {
  const [orders, setOrders] =
    useState<TransportOrderItem[]>(transportOrderData);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      !search ||
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      o.vehicleNo.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.vendorName || !form.depotCode || !form.vehicleNo) {
      ToastService.error("Please fill all required fields");
      return;
    }
    const vendor = vendorList.find((v) => v.id === form.vendorName);
    const depot = depotDropdownItems.find((d) => d.id === form.depotCode);
    const block = blockList.find((b) => b.id === form.routeTo);

    const newItem: TransportOrderItem = {
      id: orders.length + 1,
      orderNo: `TRP/2026/${String(orders.length + 1).padStart(3, "0")}`,
      orderDate:
        form.orderDate ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      vendorName: vendor?.text ?? form.vendorName,
      depotCode: form.depotCode,
      routeFrom: `${depot?.text.split("(")[0].trim() || form.depotCode} Depot`,
      routeTo: `${block?.text || form.routeTo} Block`,
      vehicleNo: form.vehicleNo,
      qtyTon: parseFloat(form.qtyTon) || 0,
      payableAmount: parseFloat(form.payableAmount) || 0,
      status: "Assigned",
    };
    setOrders((prev) => [newItem, ...prev]);
    setForm(emptyForm);
    ToastService.success("Transport order created successfully!");
  };

  return (
    <Page
      header="Transport Orders"
      subHeader="परिवहन आदेश — Manage transport vendor assignments and delivery routes."
      showHeaderActions
    >
      <Card className="mb-4">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <i className="pi pi-plus-circle text-purple-600" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Create Transport Order
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Transport Vendor *",
              field: "vendorName",
              type: "select",
              options: vendorList,
            },
            { label: "Order Date", field: "orderDate", type: "date" },
            {
              label: "From Depot *",
              field: "depotCode",
              type: "select",
              options: depotDropdownItems,
            },
            {
              label: "To Block (Route) *",
              field: "routeTo",
              type: "select",
              options: blockList,
            },
            {
              label: "Vehicle No *",
              field: "vehicleNo",
              type: "text",
              placeholder: "e.g. MP04GA4120",
            },
            {
              label: "Quantity (Ton)",
              field: "qtyTon",
              type: "number",
              placeholder: "Weight in Ton",
            },
            {
              label: "Payable Amount (₹)",
              field: "payableAmount",
              type: "number",
              placeholder: "0.00",
            },
          ].map(({ label, field, type, placeholder, options }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {label}
              </label>
              {type === "select" ? (
                <select
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <Button
            onClick={handleSave}
            label="Save Order"
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
            <i className="pi pi-list text-purple-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Order List
            </span>
            <span className="ml-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="relative">
            <i className="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-56"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
                {[
                  "#",
                  "Order No",
                  "Date",
                  "Vendor Name",
                  "Depot",
                  "Route",
                  "Vehicle No",
                  "Qty (Ton)",
                  "Amount (₹)",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap"
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
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-colors"
                >
                  <td className="px-3 py-2.5 text-gray-400">{row.id}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-gray-800 dark:text-gray-200">
                    {row.orderNo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                    {row.orderDate}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-gray-800 dark:text-gray-200 min-w-[140px]">
                    {row.vendorName}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-gray-300">
                    {row.depotCode}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 min-w-[160px]">
                    {row.routeFrom} → {row.routeTo}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                    {row.vehicleNo}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-purple-700 dark:text-purple-400">
                    {row.qtyTon.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-gray-800 dark:text-gray-200">
                    ₹{row.payableAmount.toLocaleString()}
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
