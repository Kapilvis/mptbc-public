import { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { mockTenders } from "../../commercial-bid/data";
import type { Tender } from "../../commercial-bid/data";
import { MapPin, Calendar, CheckCircle2, Clock, X } from "lucide-react";

// ─── Local mutable reference to mockTenders ───
const tenders = mockTenders;

const DISTRICTS = [
  "Indore",
  "Bhopal",
  "Gwalior",
  "Jabalpur",
  "Ujjain",
  "Sagar",
  "Rewa",
  "Satna",
  "Chhindwara",
  "Ratlam",
];

function generateTenderId(district: string): string {
  const code = district.substring(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const next = tenders.filter((t) => t.district === district).length + 1;
  return `TBC/TRANS/${code}/${year}/${String(next).padStart(3, "0")}`;
}

interface FormState {
  district: string;
  title: string;
  lastDate: string;
  openingDate: string;
}

const emptyForm: FormState = {
  district: "",
  title: "",
  lastDate: "",
  openingDate: "",
};

export function TenderManagement() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  // Force re-render when tenders change
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const refresh = () => forceUpdate();

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.district) e.district = "District required";
    if (!form.title.trim()) e.title = "Tender title required";
    if (!form.lastDate) e.lastDate = "Last submission date required";
    if (!form.openingDate) e.openingDate = "Bid opening date required";
    if (form.lastDate && form.openingDate && form.openingDate <= form.lastDate)
      e.openingDate = "Opening date must be after last submission date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const existing = tenders.find(
      (t) => t.district === form.district && t.status === "Active",
    );
    if (existing) {
      ToastService.error(
        `An active tender for ${form.district} already exists (${existing.tenderId}).`,
      );
      return;
    }

    const newTender: Tender = {
      tenderId: generateTenderId(form.district),
      title: form.title.trim(),
      district: form.district,
      lastDate: form.lastDate,
      openingDate: form.openingDate,
      status: "Active",
    };

    tenders.push(newTender);
    ToastService.success(
      `Tender ${newTender.tenderId} published successfully!`,
    );
    setForm(emptyForm);
    setErrors({});
    setShowForm(false);
    refresh();
  };

  const handleClose = (tenderId: string) => {
    const t = tenders.find((t) => t.tenderId === tenderId);
    if (t) {
      t.status = "Closed";
      ToastService.success(`Tender ${tenderId} has been closed.`);
      refresh();
    }
  };

  const activeTenders = tenders.filter((t) => t.status === "Active");
  const closedTenders = tenders.filter((t) => t.status === "Closed");

  return (
    <Page
      header="Tender Management"
      subHeader="Manage zone-wise transportation tenders and bidder allocations."
      showHeaderActions
    >
      {/* Action Bar */}
      <div className="flex justify-end mb-4">
        <Button
          label="Create New Tender"
          icon="plus"
          variant="primary"
          onClick={() => {
            setForm(emptyForm);
            setErrors({});
            setShowForm(true);
          }}
        />
      </div>

      {/* Create Tender Form */}
      {showForm && (
        <Card title="Create New Tender">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Target District <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.district ? "border-red-400" : "border-gray-300"
                }`}
                value={form.district}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    district: e.target.value,
                    title: e.target.value
                      ? `${e.target.value} Division Textbook Distribution Tender`
                      : "",
                  }))
                }
              >
                <option value="">-- Select District --</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-xs mt-1">{errors.district}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tender Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.title ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="e.g. Indore Division Textbook Distribution Tender"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Last Submission Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Submission Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lastDate ? "border-red-400" : "border-gray-300"
                }`}
                value={form.lastDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastDate: e.target.value }))
                }
              />
              {errors.lastDate && (
                <p className="text-red-500 text-xs mt-1">{errors.lastDate}</p>
              )}
            </div>

            {/* Opening Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Bid Opening Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.openingDate ? "border-red-400" : "border-gray-300"
                }`}
                value={form.openingDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, openingDate: e.target.value }))
                }
              />
              {errors.openingDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.openingDate}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          {form.district && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-green-700 mb-1">
                Tender ID Preview
              </p>
              <p className="text-sm font-mono text-green-800 font-bold">
                {generateTenderId(form.district)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                This ID will be auto-generated and assigned upon creation.
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              label="Cancel"
              icon="times"
              variant="outlined"
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
                setErrors({});
              }}
            />
            <Button
              label="Publish Tender"
              icon="check"
              variant="primary"
              onClick={handleCreate}
            />
          </div>
        </Card>
      )}

      {/* Active Tenders */}
      <Card title={`Active Tenders (${activeTenders.length})`}>
        <GridPanel
          toolbarPlacement="page"
          data={activeTenders}
          searchFields={["tenderId", "district", "title"]}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "60px",
              align: "center",
              header: "S.No.",
            },
            {
              field: "tenderId",
              header: "Tender ID",
              sortable: true,
              cell: (item: Tender) => (
                <span className="font-mono text-xs text-[#008a45] font-semibold">
                  {item.tenderId}
                </span>
              ),
            },
            { field: "title", header: "Title", sortable: true },
            {
              field: "district",
              header: "District",
              sortable: true,
              cell: (item: Tender) => (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#008a45]">
                  <MapPin className="w-3 h-3" />
                  {item.district}
                </span>
              ),
            },
            {
              field: "lastDate",
              header: "Last Date",
              sortable: true,
              cell: (item: Tender) => (
                <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  {item.lastDate}
                </span>
              ),
            },
            {
              field: "openingDate",
              header: "Opening Date",
              sortable: true,
              cell: (item: Tender) => (
                <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {item.openingDate}
                </span>
              ),
            },
            {
              field: "status",
              header: "Status",
              sortable: true,
              cell: () => (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              ),
            },
            {
              header: "Action",
              cell: (item: Tender) => (
                <div className="flex gap-2">
                  <button
                    className="text-xs text-blue-600 hover:underline font-medium"
                    onClick={() => navigate("/transport/commercial-bid")}
                  >
                    View Bids
                  </button>
                  <button
                    className="text-xs text-red-500 hover:underline font-medium"
                    onClick={() => handleClose(item.tenderId)}
                  >
                    Close
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Closed Tenders */}
      {closedTenders.length > 0 && (
        <Card title={`Closed Tenders (${closedTenders.length})`}>
          <GridPanel
            toolbarPlacement="page"
            data={closedTenders}
            searchFields={["tenderId", "district", "title"]}
            columns={[
              {
                cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                width: "60px",
                align: "center",
                header: "S.No.",
              },
              {
                field: "tenderId",
                header: "Tender ID",
                sortable: true,
                cell: (item: Tender) => (
                  <span className="font-mono text-xs text-gray-500">
                    {item.tenderId}
                  </span>
                ),
              },
              { field: "district", header: "District", sortable: true },
              { field: "lastDate", header: "Last Date", sortable: true },
              {
                field: "status",
                header: "Status",
                cell: () => (
                  <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                    <X className="w-3 h-3" />
                    Closed
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}
    </Page>
  );
}
