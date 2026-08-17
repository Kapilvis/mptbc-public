import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { printerChallanData, type PrinterChallanItem } from "../data";
import {
  depotDropdownItems,
  printerList,
  titleList,
  warehouseList,
} from "../../data";
import { ChallanReceiptModal } from "../components/ChallanReceiptModal";

function StatusBadge({ status }: { status: PrinterChallanItem["status"] }) {
  const cls = {
    Received: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Shortage: "bg-rose-50 text-rose-700 border-rose-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

const emptyForm = {
  depotCode: "",
  receiptDate: "",
  printerCode: "",
  challanNo: "",
  challanDate: "",
  vehicleNo: "",
  driverName: "",
  driverMobile: "",
  titleId: "",
  dispatchedQty: "",
  receivedQty: "",
  shortage: "",
  warehouse: "",
  remark: "",
};

export default function PrinterChallanReceivedPage() {
  const [challans, setChallans] =
    useState<PrinterChallanItem[]>(printerChallanData);
  const [form, setForm] = useState(emptyForm);
  const [receiptItem, setReceiptItem] = useState<PrinterChallanItem | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const filtered = challans.filter(
    (c) =>
      !search ||
      c.challanNo.toLowerCase().includes(search.toLowerCase()) ||
      c.printerName.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicleNo.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "dispatchedQty" || field === "receivedQty") {
        const d = parseInt(updated.dispatchedQty) || 0;
        const r = parseInt(updated.receivedQty) || 0;
        updated.shortage = String(Math.max(0, d - r));
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!form.depotCode || !form.challanNo || !form.printerCode) {
      ToastService.error("Please fill all required fields");
      return;
    }
    const printer = printerList.find((p) => p.id === form.printerCode);
    const title = titleList.find((t) => t.id === form.titleId);
    const shortage = parseInt(form.shortage) || 0;
    const newItem: PrinterChallanItem = {
      id: challans.length + 1,
      challanNo: form.challanNo,
      challanDate: form.challanDate,
      receiptDate: form.receiptDate,
      depotCode: form.depotCode,
      printerName: printer?.text ?? form.printerCode,
      printerCode: form.printerCode,
      vehicleNo: form.vehicleNo,
      driverName: form.driverName,
      driverMobile: form.driverMobile,
      title: title?.text ?? form.titleId,
      dispatchedQty: parseInt(form.dispatchedQty) || 0,
      receivedQty: parseInt(form.receivedQty) || 0,
      shortage,
      warehouse:
        warehouseList.find((w) => w.id === form.warehouse)?.text ??
        form.warehouse,
      status: shortage > 0 ? "Shortage" : "Received",
    };
    setChallans((prev) => [newItem, ...prev]);
    setForm(emptyForm);
    ToastService.success("Challan receipt recorded successfully!");
  };

  return (
    <Page
      header="Printer Challan Received"
      subHeader="मुद्रक से डिपो पर प्राप्त चालान — Record and view challans received from printers at depot."
      showHeaderActions
    >
      {/* Form Card */}
      <Card className="mb-4">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <i className="pi pi-plus-circle text-blue-600" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Record New Challan Receipt
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Depot *",
              field: "depotCode",
              type: "select",
              options: depotDropdownItems,
            },
            { label: "Receipt Date *", field: "receiptDate", type: "date" },
            {
              label: "Printer *",
              field: "printerCode",
              type: "select",
              options: printerList,
            },
            {
              label: "Challan No *",
              field: "challanNo",
              type: "text",
              placeholder: "e.g. PR-CHL/2026/1001",
            },
            { label: "Challan Date", field: "challanDate", type: "date" },
            {
              label: "Vehicle No",
              field: "vehicleNo",
              type: "text",
              placeholder: "e.g. MP20HB9633",
            },
            {
              label: "Driver Name",
              field: "driverName",
              type: "text",
              placeholder: "Driver name",
            },
            {
              label: "Driver Mobile",
              field: "driverMobile",
              type: "text",
              placeholder: "10-digit mobile",
            },
            {
              label: "Title",
              field: "titleId",
              type: "select",
              options: titleList,
            },
            {
              label: "Dispatched Qty",
              field: "dispatchedQty",
              type: "number",
              placeholder: "0",
            },
            {
              label: "Received Qty",
              field: "receivedQty",
              type: "number",
              placeholder: "0",
            },
            {
              label: "Shortage (auto)",
              field: "shortage",
              type: "number",
              placeholder: "0",
              readonly: true,
            },
            {
              label: "Warehouse",
              field: "warehouse",
              type: "select",
              options: warehouseList,
            },
            {
              label: "Remark",
              field: "remark",
              type: "text",
              placeholder: "Optional remarks",
            },
          ].map(({ label, field, type, placeholder, options, readonly }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {label}
              </label>
              {type === "select" ? (
                <select
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                  readOnly={readonly}
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className={`px-3 py-2 text-xs border rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    readonly
                      ? "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <Button
            onClick={handleSave}
            label="Save Receipt"
            icon="pi pi-save"
            variant="primary"
          />
          <Button
            onClick={() => setForm(emptyForm)}
            label="Reset"
            variant="outlined"
          />
        </div>
      </Card>

      {/* List Card */}
      <Card>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <i className="pi pi-list text-blue-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Challan Receipt History
            </span>
            <span className="ml-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="relative">
            <i className="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search challan, printer, vehicle..."
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
                  "Challan No",
                  "Date",
                  "Depot",
                  "Printer",
                  "Title",
                  "Dispatched",
                  "Received",
                  "Shortage",
                  "Warehouse",
                  "Status",
                  "Receipt",
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
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors"
                >
                  <td className="px-3 py-2.5 text-gray-400">{row.id}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {row.challanNo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {row.receiptDate}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-gray-300">
                    {row.depotCode}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 min-w-[160px]">
                    {row.printerName}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 min-w-[140px]">
                    {row.title}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-blue-700 dark:text-blue-400">
                    {row.dispatchedQty.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                    {row.receivedQty.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-bold ${row.shortage > 0 ? "text-rose-700 dark:text-rose-400" : "text-gray-400"}`}
                  >
                    {row.shortage > 0 ? row.shortage.toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                    {row.warehouse}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Button
                      onClick={() => setReceiptItem(row)}
                      label="View"
                      icon="pi pi-file-pdf"
                      size="small"
                      variant="info"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Modal */}
      {receiptItem && (
        <ChallanReceiptModal
          challan={receiptItem}
          onClose={() => setReceiptItem(null)}
        />
      )}
    </Page>
  );
}
