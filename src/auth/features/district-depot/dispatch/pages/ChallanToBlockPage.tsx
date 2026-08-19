import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { challanToBlockData, type ChallanToBlockItem } from "../data";
import {
  depotDropdownItems,
  academicYears,
  blockList,
  titleList,
} from "../../data";

const schemes = [
  { id: "rsk", text: "Free Textbook (RSK)" },
  { id: "cpi", text: "CPI Demand" },
  { id: "bookseller", text: "Bookseller Supply" },
];

const emptyForm = {
  scheme: "",
  academicYear: "2026-2027",
  depotCode: "",
  block: "",
  brcCentre: "",
  titleId: "",
  issuedQty: "",
  vehicleNo: "",
  receiverName: "",
  receiverMobile: "",
};

function StatusBadge({ status }: { status: ChallanToBlockItem["status"] }) {
  const cls = {
    Acknowledged: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Dispatched: "bg-blue-50 text-blue-700 border-blue-200",
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

export default function ChallanToBlockPage() {
  const pageTitle = usePageTitle();
  const [challans, setChallans] =
    useState<ChallanToBlockItem[]>(challanToBlockData);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = challans.filter(
    (c) =>
      !search ||
      c.challanNo.toLowerCase().includes(search.toLowerCase()) ||
      c.block.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicleNo.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.scheme || !form.depotCode || !form.block || !form.titleId) {
      ToastService.error("Please fill all required fields");
      return;
    }
    const title = titleList.find((t) => t.id === form.titleId);
    const block = blockList.find((b) => b.id === form.block);
    const scheme = schemes.find((s) => s.id === form.scheme);
    const newItem: ChallanToBlockItem = {
      id: challans.length + 1,
      scheme: scheme?.text ?? form.scheme,
      academicYear: form.academicYear,
      depotCode: form.depotCode,
      block: block?.text ?? form.block,
      brcCentre: form.brcCentre || `Block ${block?.text ?? ""}`,
      title: title?.text ?? form.titleId,
      allottedQty: 0,
      issuedQty: parseInt(form.issuedQty) || 0,
      challanNo: `CHL/2026/${String(challans.length + 1).padStart(4, "0")}`,
      vehicleNo: form.vehicleNo,
      receiverName: form.receiverName,
      receiverMobile: form.receiverMobile,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Dispatched",
    };
    setChallans((prev) => [newItem, ...prev]);
    setForm(emptyForm);
    ToastService.success("Dispatch challan created successfully!");
  };

  return (
    <Page
      header={pageTitle || "Challan to Block"}
      subHeader="विकासखंड पुस्तक प्रेषण — Issue books from depot to block centres with challan."
      showHeaderActions
    >
      {/* Form */}
      <Card className="mb-4">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <i className="pi pi-send text-emerald-600" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Create Dispatch Challan
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Scheme *",
              field: "scheme",
              type: "select",
              options: schemes,
            },
            {
              label: "Academic Year",
              field: "academicYear",
              type: "select",
              options: academicYears,
            },
            {
              label: "Depot *",
              field: "depotCode",
              type: "select",
              options: depotDropdownItems,
            },
            {
              label: "Block *",
              field: "block",
              type: "select",
              options: blockList,
            },
            {
              label: "Block Centre",
              field: "brcCentre",
              type: "text",
              placeholder: "Block centre name",
            },
            {
              label: "Title *",
              field: "titleId",
              type: "select",
              options: titleList,
            },
            {
              label: "Issued Qty",
              field: "issuedQty",
              type: "number",
              placeholder: "Books to issue",
            },
            {
              label: "Vehicle No",
              field: "vehicleNo",
              type: "text",
              placeholder: "e.g. MP04GA4120",
            },
            {
              label: "Receiver Name",
              field: "receiverName",
              type: "text",
              placeholder: "Block coordinator name",
            },
            {
              label: "Receiver Mobile",
              field: "receiverMobile",
              type: "text",
              placeholder: "10-digit mobile",
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
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
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
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <Button
            onClick={handleSave}
            label="Create Challan"
            icon="pi pi-send"
            variant="success"
          />
          <Button
            onClick={() => setForm(emptyForm)}
            label="Reset"
            variant="outlined"
          />
        </div>
      </Card>

      {/* List */}
      <Card>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <i className="pi pi-list text-emerald-600" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Dispatch Challan List
            </span>
            <span className="ml-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="relative">
            <i className="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search challan, block, vehicle..."
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
                  "Scheme",
                  "Depot",
                  "Block",
                  "Title",
                  "Issued Qty",
                  "Vehicle No",
                  "Receiver",
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
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-colors"
                >
                  <td className="px-3 py-2.5 text-gray-400">{row.id}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-gray-800 dark:text-gray-200">
                    {row.challanNo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                    {row.date}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                    {row.scheme}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-gray-300">
                    {row.depotCode}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-gray-800 dark:text-gray-200">
                    {row.block}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 min-w-[140px]">
                    {row.title}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {row.issuedQty.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                    {row.vehicleNo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                    {row.receiverName}
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
