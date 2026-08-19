import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { blockList } from "../../data";

interface BookTitleRow {
  id: string;
  selected: boolean;
  title: string;
  classGroup: string;
  demandQty: number;
  bundleCount: number;
  dispatchQty: number;
}

const initialBookTitles: BookTitleRow[] = [
  {
    id: "b1",
    selected: true,
    title:
      "2026-27 हेतु एफएलएन अभ्यास पुस्तिका (तीन चरणों में) (कक्षा 1 से 4)-अभ्यास पुस्तिका गणित व पर्यावरण अध्ययन (तृतीय चरण)(कक्षा 3)",
    classGroup: "Class 3",
    demandQty: 1474,
    bundleCount: 14,
    dispatchQty: 1474,
  },
  {
    id: "b2",
    selected: true,
    title:
      "2026-27 हेतु एटग्रेड अभ्यास पुस्तिका (कक्षा 5 से 8)-एटग्रेड अभ्यास पुस्तिका कक्षा 7 (विज्ञान)",
    classGroup: "Class 7",
    demandQty: 2100,
    bundleCount: 15,
    dispatchQty: 2100,
  },
  {
    id: "b3",
    selected: true,
    title:
      "2026-27 हेतु एटग्रेड अभ्यास पुस्तिका (कक्षा 5 से 8)-एटग्रेड अभ्यास पुस्तिका कक्षा 8 (अंग्रेजी)",
    classGroup: "Class 8",
    demandQty: 2218,
    bundleCount: 12,
    dispatchQty: 2218,
  },
  {
    id: "b4",
    selected: true,
    title: "आसपास भाग 3-5",
    classGroup: "Class 3-5",
    demandQty: 1027,
    bundleCount: 12,
    dispatchQty: 1027,
  },
  {
    id: "b5",
    selected: true,
    title: "गणित का जादू - 5",
    classGroup: "Class 5",
    demandQty: 1027,
    bundleCount: 12,
    dispatchQty: 1027,
  },
  {
    id: "b6",
    selected: true,
    title: "गणित प्रकाश - 7",
    classGroup: "Class 7",
    demandQty: 1211,
    bundleCount: 14,
    dispatchQty: 1195,
  },
  {
    id: "b7",
    selected: true,
    title: "जिज्ञासा - 7",
    classGroup: "Class 7",
    demandQty: 1211,
    bundleCount: 19,
    dispatchQty: 1195,
  },
  {
    id: "b8",
    selected: true,
    title: "भाषा भारती - 6",
    classGroup: "Class 6",
    demandQty: 1425,
    bundleCount: 14,
    dispatchQty: 1405,
  },
  {
    id: "b9",
    selected: true,
    title: "विज्ञान - 8",
    classGroup: "Class 8",
    demandQty: 1303,
    bundleCount: 16,
    dispatchQty: 1301,
  },
];

const bookTypes = [
  { id: "free", text: "Free Textbook (RSK)" },
  { id: "fln", text: "FLN Workbook" },
  { id: "atgrade", text: "At-Grade Workbook" },
  { id: "general", text: "General Textbook" },
];

const mediums = [
  { id: "hindi", text: "Hindi" },
  { id: "english", text: "English" },
  { id: "urdu", text: "Urdu" },
  { id: "marathi", text: "Marathi" },
];

const classGroups = [
  { id: "c18", text: "Class 1 to 8" },
  { id: "c912", text: "Class 9 to 12" },
];

const depotList = [
  { id: "BPL", text: "Bhopal (101)" },
  { id: "SAGAR", text: "Sagar (102)" },
  { id: "GWL", text: "Gwalior (103)" },
  { id: "IND", text: "Indore (104)" },
  { id: "JBP", text: "Jabalpur (105)" },
];

export default function ChallanToBlockPage() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();

  const [form, setForm] = useState({
    academicYear: "2026-2027",
    depotCode: "BPL",
    block: "Jabera",
    bookType: "free",
    medium: "hindi",
    classGroup: "c18",
    vehicleNo: "MP20HB9633",
    brcCentre: "BRC JABERA (231206OBS02)",
    receiverName: "Block Coordinator",
    receiverMobile: "9876543210",
  });

  const [titles, setTitles] = useState<BookTitleRow[]>(initialBookTitles);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleCheck = (id: string, checked: boolean) => {
    setTitles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: checked } : t)),
    );
  };

  const handleTitleQtyChange = (
    id: string,
    field: "bundleCount" | "dispatchQty",
    value: number,
  ) => {
    setTitles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const selectedTitles = titles.filter((t) => t.selected);
  const totalBundles = selectedTitles.reduce(
    (s, t) => s + (t.bundleCount || 0),
    0,
  );
  const totalDispatch = selectedTitles.reduce(
    (s, t) => s + (t.dispatchQty || 0),
    0,
  );

  const handleSave = () => {
    if (!form.block) {
      ToastService.error("Please select a block.");
      return;
    }
    if (selectedTitles.length === 0) {
      ToastService.error("Please select at least one book title to dispatch.");
      return;
    }

    ToastService.success(
      "Dispatch challan order to block created successfully!",
    );
    navigate("/district-depot/dispatch/history");
  };

  return (
    <Page
      header={pageTitle || "Create Dispatch Order to Block"}
      subHeader="विकासखंड पुस्तक प्रेषण — Issue books from depot to block centres with challan."
      showHeaderActions
    >
      {/* 1. Dispatch Order Configuration Form */}
      <Card className="mb-5 shadow-xs border border-slate-200/80 dark:border-slate-800">
        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <i className="pi pi-send text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                Dispatch Order Details
              </h2>
              <p className="text-[11px] text-slate-500">
                Select block, book type, medium and vehicle information.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/district-depot/dispatch/history")}
            label="Back to Dispatch History"
            icon="pi pi-arrow-left"
            variant="outlined"
            size="small"
          />
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Academic Year */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Academic Session
            </label>
            <select
              value={form.academicYear}
              onChange={(e) => handleChange("academicYear", e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            >
              <option value="2026-2027">2026-2027 (Current FY)</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          {/* Depot (Default selected) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Depot Name (Default)
            </label>
            <select
              value={form.depotCode}
              onChange={(e) => handleChange("depotCode", e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
            >
              {depotList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.text}
                </option>
              ))}
            </select>
          </div>

          {/* Block */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Block <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.block}
              onChange={(e) => handleChange("block", e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            >
              <option value="">-- Select Block --</option>
              {blockList.map((b) => (
                <option key={b.id} value={b.text}>
                  {b.text}
                </option>
              ))}
            </select>
          </div>

          {/* Book Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Book Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.bookType}
              onChange={(e) => handleChange("bookType", e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            >
              {bookTypes.map((bt) => (
                <option key={bt.id} value={bt.id}>
                  {bt.text}
                </option>
              ))}
            </select>
          </div>

          {/* Medium */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Medium <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.medium}
              onChange={(e) => handleChange("medium", e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            >
              {mediums.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.text}
                </option>
              ))}
            </select>
          </div>

          {/* Class Group */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Class Group <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.classGroup}
              onChange={(e) => handleChange("classGroup", e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            >
              {classGroups.map((cg) => (
                <option key={cg.id} value={cg.id}>
                  {cg.text}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle / Truck No */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Vehicle / Truck No <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.vehicleNo}
              onChange={(e) => handleChange("vehicleNo", e.target.value)}
              placeholder="e.g. MP20HB9633"
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>

          {/* BRC Centre / Receiving Office */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Receiving Office / BRC Centre
            </label>
            <input
              type="text"
              value={form.brcCentre}
              onChange={(e) => handleChange("brcCentre", e.target.value)}
              placeholder="e.g. BRC JABERA (231206OBS02)"
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>
      </Card>

      {/* 2. Multi-Title Book Selection Table */}
      <Card className="mb-5 shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="pi pi-list text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Challan Books Selection & Quantities ({selectedTitles.length}{" "}
              Selected)
            </h3>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Total Books:{" "}
            <span className="text-emerald-600 font-extrabold">
              {totalDispatch.toLocaleString()}
            </span>{" "}
            | Bundles:{" "}
            <span className="text-blue-600 font-extrabold">
              {totalBundles.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={titles.every((t) => t.selected)}
                    onChange={(e) =>
                      setTitles((prev) =>
                        prev.map((t) => ({ ...t, selected: e.target.checked })),
                      )
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="p-3 text-center w-12">S.No</th>
                <th className="p-3 min-w-[320px]">
                  Title (Book Name in Hindi)
                </th>
                <th className="p-3 text-center w-28">Class</th>
                <th className="p-3 text-center w-28">Demand Books</th>
                <th className="p-3 text-center w-28">Bundle Count</th>
                <th className="p-3 text-center w-32">Dispatch Books</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {titles.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                    row.selected
                      ? "bg-white dark:bg-slate-900"
                      : "bg-slate-50/30 opacity-60"
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={(e) =>
                        handleTitleCheck(row.id, e.target.checked)
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-3 text-center font-medium text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {row.title}
                  </td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                    {row.classGroup}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                    {row.demandQty.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      disabled={!row.selected}
                      value={row.bundleCount || ""}
                      onChange={(e) =>
                        handleTitleQtyChange(
                          row.id,
                          "bundleCount",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 text-center px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      disabled={!row.selected}
                      value={row.dispatchQty || ""}
                      onChange={(e) =>
                        handleTitleQtyChange(
                          row.id,
                          "dispatchQty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-24 text-center px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-extrabold focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/90 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-700">
                <td
                  colSpan={4}
                  className="p-3.5 text-right uppercase text-[11px] tracking-wider"
                >
                  Total Dispatch Quantity ({selectedTitles.length} Titles):
                </td>
                <td className="p-3.5 text-center text-slate-700">
                  {titles
                    .filter((t) => t.selected)
                    .reduce((s, t) => s + t.demandQty, 0)
                    .toLocaleString()}
                </td>
                <td className="p-3.5 text-center text-blue-700 dark:text-blue-400 text-sm">
                  {totalBundles.toLocaleString()}
                </td>
                <td className="p-3.5 text-center text-emerald-700 dark:text-emerald-400 text-sm">
                  {totalDispatch.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Footer Submit Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Ready to generate dispatch challan for block{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {form.block || "—"}
          </span>{" "}
          with{" "}
          <span className="font-bold text-emerald-600">
            {totalDispatch.toLocaleString()} books
          </span>
          .
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/district-depot/dispatch/history")}
            label="Cancel"
            variant="outlined"
          />
          <Button
            onClick={handleSave}
            label="Save & Generate Challan"
            icon="pi pi-check-circle"
            variant="success"
          />
        </div>
      </div>
    </Page>
  );
}
