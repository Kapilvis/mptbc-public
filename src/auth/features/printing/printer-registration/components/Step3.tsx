import { useState, useEffect } from "react";
import { Button } from "shared/components/buttons";
import { GridPanel } from "shared/components/panels";
import { ToastService } from "services";

const machineTypeOptions = [
  { label: "Sheetfed Offset", value: "sheetfed" as const },
  { label: "Web Offset", value: "web" as const },
];

const colorOptions = [
  { id: "single", text: "Single Color" },
  { id: "double", text: "Double Color" },
  { id: "multi", text: "Multi Color (4+ Colors)" },
];

const cpcOptions = [
  { id: "cpc", text: "CPC" },
  { id: "automatic", text: "Automatic" },
  { id: "manual", text: "Manual" },
];

type MachineType = Printer.MachineDetail["machineType"];

const EMPTY_MACHINE = (): Omit<Printer.MachineDetail, "id"> => ({
  machineType: "sheetfed",
  size: "",
  cutoff: "",
  yearOfManufacture: undefined as unknown as number,
  ageOfMachine: 0,
  colorConfiguration: undefined as unknown as "single",
  sidCapacity120Days: undefined as unknown as number,
  cpcAutomatic: undefined,
  calculatedCapacity1Color: undefined,
  calculatedCapacity2Color: undefined,
  calculatedCapacity4Color: undefined,
  remark: "",
});

interface MachineFormState {
  id?: string;
  machineType: MachineType;
  size: string;
  cutoff: string;
  yearOfManufacture: string;
  ageOfMachine: string;
  colorConfiguration: "single" | "double" | "multi";
  sidCapacity120Days: string;
  cpcAutomatic?: "cpc" | "automatic" | "manual";
  calculatedCapacity1Color: string;
  calculatedCapacity2Color: string;
  calculatedCapacity4Color: string;
  remark: string;
}

interface MachineErrors {
  machineType?: string;
  size?: string;
  cutoff?: string;
  yearOfManufacture?: string;
  colorConfiguration?: string;
  sidCapacity120Days?: string;
  cpcAutomatic?: string;
}

interface Step3Props {
  machinesList: Printer.MachineDetail[];
  appendMachine: (value: Printer.MachineDetail) => void;
  removeMachine: (index: number) => void;
  updateMachine: (index: number, value: Printer.MachineDetail) => void;
  errorMessage?: string;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; text: string }[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.text}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  placeholder,
  readonly,
}: {
  label: string;
  value: string | number | undefined;
  onChange?: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  readonly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readonly}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 ${
          readonly
            ? "bg-slate-50 text-slate-500 cursor-not-allowed"
            : "bg-white"
        } ${error ? "border-red-400" : "border-slate-200"}`}
      />
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white resize-none"
      />
    </div>
  );
}

function MachineCard({
  machine,
  index,
  onEdit,
  onRemove,
}: {
  machine: Printer.MachineDetail;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const label =
    machine.machineType === "sheetfed" ? "Sheetfed Offset" : "Web Offset";
  const num = index + 1;

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
            {num}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {label} #{num}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              {machine.machineType === "sheetfed"
                ? `Size: ${machine.size || "—"}`
                : `Cutoff: ${machine.cutoff || "—"}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <i className="pi pi-pencil text-[10px]" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
            title="Remove"
          >
            <i className="pi pi-trash text-[10px]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600">
        <div>
          <span className="text-slate-400 block">Year</span>
          <span className="font-medium">{machine.yearOfManufacture}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Age</span>
          <span className="font-medium">{machine.ageOfMachine} yrs</span>
        </div>
        <div>
          <span className="text-slate-400 block">SID Capacity</span>
          <span className="font-medium">
            {machine.sidCapacity120Days?.toLocaleString() ?? "—"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Color Config</span>
          <span className="font-medium capitalize">
            {machine.colorConfiguration}
          </span>
        </div>
        {machine.machineType === "sheetfed" && (
          <div>
            <span className="text-slate-400 block">CPC</span>
            <span className="font-medium capitalize">
              {machine.cpcAutomatic ?? "—"}
            </span>
          </div>
        )}
        <div>
          <span className="text-slate-400 block">Cap. 1 Color</span>
          <span className="font-medium">
            {machine.calculatedCapacity1Color?.toLocaleString() ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

function MachineForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: Partial<Printer.MachineDetail>;
  onSave: (machine: Printer.MachineDetail) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<MachineFormState>(() => ({
    id: initialData.id,
    machineType: initialData.machineType ?? "sheetfed",
    size: initialData.size ?? "",
    cutoff: initialData.cutoff ?? "",
    yearOfManufacture:
      initialData.yearOfManufacture !== undefined
        ? String(initialData.yearOfManufacture)
        : "",
    ageOfMachine:
      initialData.ageOfMachine !== undefined
        ? String(initialData.ageOfMachine)
        : "",
    colorConfiguration: initialData.colorConfiguration ?? "single",
    sidCapacity120Days:
      initialData.sidCapacity120Days !== undefined
        ? String(initialData.sidCapacity120Days)
        : "",
    cpcAutomatic: initialData.cpcAutomatic,
    calculatedCapacity1Color:
      initialData.calculatedCapacity1Color !== undefined
        ? String(initialData.calculatedCapacity1Color)
        : "",
    calculatedCapacity2Color:
      initialData.calculatedCapacity2Color !== undefined
        ? String(initialData.calculatedCapacity2Color)
        : "",
    calculatedCapacity4Color:
      initialData.calculatedCapacity4Color !== undefined
        ? String(initialData.calculatedCapacity4Color)
        : "",
    remark: initialData.remark ?? "",
  }));
  const [errors, setErrors] = useState<MachineErrors>({});

  const machineType: MachineType = form.machineType;

  // Recalculate age when year changes
  useEffect(() => {
    const year = Number(form.yearOfManufacture);
    if (year && year >= 1000 && year <= new Date().getFullYear()) {
      const age = new Date().getFullYear() - year;
      setForm((prev) => ({
        ...prev,
        ageOfMachine: String(age >= 0 ? age : 0),
      }));
    } else {
      setForm((prev) => ({ ...prev, ageOfMachine: "" }));
    }
  }, [form.yearOfManufacture]);

  // Clear machine-type-specific fields on type change
  const handleTypeChange = (t: string) => {
    setForm((prev) => ({
      ...prev,
      machineType: t as MachineType,
      size: "",
      cutoff: "",
      cpcAutomatic: undefined,
    }));
  };

  const set = (key: keyof MachineFormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: MachineErrors = {};
    if (!form.machineType) errs.machineType = "Machine Type is required";
    if (machineType === "sheetfed" && !form.size?.trim())
      errs.size = "Size is required";
    if (machineType === "web" && !form.cutoff?.trim())
      errs.cutoff = "Cutoff is required";

    const year = Number(form.yearOfManufacture);
    if (
      !form.yearOfManufacture ||
      isNaN(year) ||
      year < 1800 ||
      year > new Date().getFullYear()
    ) {
      errs.yearOfManufacture = "Enter a valid 4-digit Year of Manufacture";
    }

    if (!form.colorConfiguration)
      errs.colorConfiguration = "Color Configuration is required";

    const cap = Number(form.sidCapacity120Days);
    if (!form.sidCapacity120Days || isNaN(cap) || cap < 0) {
      errs.sidCapacity120Days = "Enter a valid SID Capacity";
    }

    if (machineType === "sheetfed" && !form.cpcAutomatic)
      errs.cpcAutomatic = "CPC / Automatic is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      ToastService.error("Please fill all required machine fields.");
      return;
    }

    const detail: Printer.MachineDetail = {
      id: form.id,
      machineType: form.machineType,
      size: form.machineType === "sheetfed" ? form.size : undefined,
      cutoff: form.machineType === "web" ? form.cutoff : undefined,
      yearOfManufacture: Number(form.yearOfManufacture),
      ageOfMachine: form.ageOfMachine ? Number(form.ageOfMachine) : 0,
      colorConfiguration: form.colorConfiguration,
      sidCapacity120Days: Number(form.sidCapacity120Days),
      cpcAutomatic:
        form.machineType === "sheetfed" ? form.cpcAutomatic : undefined,
      calculatedCapacity1Color: form.calculatedCapacity1Color
        ? Number(form.calculatedCapacity1Color)
        : undefined,
      calculatedCapacity2Color: form.calculatedCapacity2Color
        ? Number(form.calculatedCapacity2Color)
        : undefined,
      calculatedCapacity4Color: form.calculatedCapacity4Color
        ? Number(form.calculatedCapacity4Color)
        : undefined,
      remark: form.remark,
    };

    onSave(detail);
  };

  return (
    <div className="border border-green-200 rounded-xl bg-green-50/30 p-5">
      <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-4">
        {initialData.id ? "Edit Machine" : "Add Machine"}
      </h4>

      {/* Machine Type Selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-600 mb-2">
          Machine Type <span className="text-red-500">*</span>
        </p>
        <div className="flex gap-3">
          {machineTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleTypeChange(opt.value)}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg border-2 transition-all ${
                machineType === opt.value
                  ? "border-green-600 bg-green-600 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:border-green-300"
              }`}
            >
              <i
                className={`pi pi-cog mr-2 ${machineType === opt.value ? "text-white" : "text-slate-400"}`}
              />
              {opt.label}
            </button>
          ))}
        </div>
        {errors.machineType && (
          <span className="text-[10px] text-red-500">{errors.machineType}</span>
        )}
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sheetfed-specific */}
        {machineType === "sheetfed" && (
          <InputField
            label="Size"
            required
            value={form.size}
            onChange={(v) => set("size", v)}
            placeholder="e.g. 20x30 inch"
            error={errors.size}
          />
        )}

        {/* Web-specific */}
        {machineType === "web" && (
          <InputField
            label="Cutoff"
            required
            value={form.cutoff}
            onChange={(v) => set("cutoff", v)}
            placeholder="e.g. 630mm"
            error={errors.cutoff}
          />
        )}

        {/* Common fields */}
        <InputField
          label="Year of Manufacture"
          required
          value={form.yearOfManufacture}
          onChange={(v) => {
            const digits = v.replace(/\D/g, "").slice(0, 4);
            set("yearOfManufacture", digits);
          }}
          placeholder={`${new Date().getFullYear() - 5}`}
          error={errors.yearOfManufacture}
        />
        <InputField
          label="Age of Machine (years)"
          value={form.ageOfMachine}
          readonly
        />
        <SelectField
          label="Color Configuration"
          required
          value={form.colorConfiguration ?? ""}
          onChange={(v) => set("colorConfiguration", v)}
          options={colorOptions}
          error={errors.colorConfiguration}
        />
        <InputField
          label="SID Capacity for 120 Days"
          required
          value={form.sidCapacity120Days}
          onChange={(v) => {
            const digits = v.replace(/\D/g, "");
            set("sidCapacity120Days", digits);
          }}
          placeholder="e.g. 500000"
          error={errors.sidCapacity120Days}
        />

        {/* CPC / Automatic — Sheetfed ONLY */}
        {machineType === "sheetfed" && (
          <SelectField
            label="CPC / Automatic"
            required
            value={form.cpcAutomatic ?? ""}
            onChange={(v) =>
              set("cpcAutomatic", v as Printer.MachineDetail["cpcAutomatic"])
            }
            options={cpcOptions}
            error={errors.cpcAutomatic}
          />
        )}

        <InputField
          label="Calculated Capacity 1 Color"
          value={form.calculatedCapacity1Color}
          onChange={(v) => {
            const digits = v.replace(/\D/g, "");
            set("calculatedCapacity1Color", digits);
          }}
          placeholder="e.g. 150000"
        />
        <InputField
          label="Calculated Capacity 2 Color"
          value={form.calculatedCapacity2Color}
          onChange={(v) => {
            const digits = v.replace(/\D/g, "");
            set("calculatedCapacity2Color", digits);
          }}
          placeholder="e.g. 120000"
        />
        <InputField
          label="Calculated Capacity 4 Color"
          value={form.calculatedCapacity4Color}
          onChange={(v) => {
            const digits = v.replace(/\D/g, "");
            set("calculatedCapacity4Color", digits);
          }}
          placeholder="e.g. 100000"
        />

        <div className="md:col-span-3">
          <TextareaField
            label="Remark"
            value={form.remark}
            onChange={(v) => set("remark", v)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          label="Cancel"
          variant="outlined"
          onClick={onCancel}
          size="small"
        />
        <Button
          type="button"
          label={initialData.id ? "Update Machine" : "Add Machine"}
          icon="plus"
          variant="primary"
          onClick={handleSave}
          size="small"
        />
      </div>
    </div>
  );
}

export default function Step3({
  machinesList,
  appendMachine,
  removeMachine,
  updateMachine,
  errorMessage,
}: Step3Props) {
  const [showForm, setShowForm] = useState(machinesList.length === 0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] =
    useState<Partial<Printer.MachineDetail>>(EMPTY_MACHINE());

  const sheetfedMachines = machinesList.filter(
    (m) => m.machineType === "sheetfed",
  );
  const webMachines = machinesList.filter((m) => m.machineType === "web");

  const [viewMode, setViewMode] = useState<"grid" | "mosaic">("grid");

  const handleSaveMachine = (machine: Printer.MachineDetail) => {
    if (editingIndex !== null) {
      updateMachine(editingIndex, {
        ...machine,
        id: machinesList[editingIndex]?.id ?? crypto.randomUUID(),
      });
      setEditingIndex(null);
    } else {
      appendMachine({ ...machine, id: crypto.randomUUID() });
    }
    setFormData(EMPTY_MACHINE());
    setShowForm(false);
    ToastService.success(
      editingIndex !== null
        ? "Machine updated successfully."
        : "Machine added successfully.",
    );
  };

  const handleEdit = (index: number) => {
    setFormData({ ...machinesList[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(EMPTY_MACHINE());
    setEditingIndex(null);
    setShowForm(machinesList.length === 0);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <i className="pi pi-cog text-green-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">
              Machine & Equipment Infrastructure
            </p>
            <p className="text-xs text-slate-400">
              Add all printing machines. At least 1 required.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {machinesList.length > 0 && (
            <div className="grid-view-toggle mr-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                title="Table Grid View"
              >
                <i className="pi pi-table" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("mosaic")}
                className={`toggle-btn ${viewMode === "mosaic" ? "active" : ""}`}
                title="Mosaic Card View"
              >
                <i className="pi pi-th-large" />
              </button>
            </div>
          )}
          {!showForm && (
            <Button
              type="button"
              label="Add Machine"
              icon="plus"
              variant="primary"
              size="small"
              onClick={() => {
                setFormData(EMPTY_MACHINE());
                setEditingIndex(null);
                setShowForm(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          <i className="pi pi-exclamation-triangle" />
          {errorMessage}
        </div>
      )}

      {/* Machine Form */}
      {showForm && (
        <MachineForm
          initialData={formData}
          onSave={handleSaveMachine}
          onCancel={handleCancel}
        />
      )}

      {/* Sheetfed Offset Infrastructure Grid */}
      {sheetfedMachines.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="border-l-4 border-l-green-600 pl-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sheetfed Offset Infrastructure
            </h3>
          </div>
          <GridPanel
            data={sheetfedMachines}
            loading={false}
            searchBox={false}
            showExport={false}
            mode={viewMode}
            defaultMode="grid"
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-slate-600 font-medium">
                    {option.rowIndex + 1}
                  </span>
                ),
                width: "60px",
                align: "center",
                header: "S.No.",
              },
              {
                field: "size",
                header: "Size",
              },
              {
                field: "yearOfManufacture",
                header: "Year",
                align: "center",
              },
              {
                field: "ageOfMachine",
                header: "Age",
                align: "center",
                cell: (item: Printer.MachineDetail) =>
                  `${item.ageOfMachine} yrs`,
              },
              {
                field: "colorConfiguration",
                header: "Color Config",
                align: "center",
                cell: (item: Printer.MachineDetail) => (
                  <span className="capitalize">{item.colorConfiguration}</span>
                ),
              },
              {
                field: "sidCapacity120Days",
                header: "SID Capacity",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.sidCapacity120Days?.toLocaleString() ?? "—",
              },
              {
                field: "cpcAutomatic",
                header: "CPC / Automatic",
                align: "center",
                cell: (item: Printer.MachineDetail) => (
                  <span className="capitalize">{item.cpcAutomatic ?? "—"}</span>
                ),
              },
              {
                field: "calculatedCapacity1Color",
                header: "Cap. 1 Color",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.calculatedCapacity1Color?.toLocaleString() ?? "—",
              },
              {
                field: "calculatedCapacity2Color",
                header: "Cap. 2 Color",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.calculatedCapacity2Color?.toLocaleString() ?? "—",
              },
              {
                field: "calculatedCapacity4Color",
                header: "Cap. 4 Color",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.calculatedCapacity4Color?.toLocaleString() ?? "—",
              },
              {
                field: "remark",
                header: "Remark",
                cell: (item: Printer.MachineDetail) => item.remark || "—",
              },
              {
                header: "Actions",
                align: "center",
                width: "120px",
                cell: (item: Printer.MachineDetail) => {
                  const globalIndex = machinesList.findIndex(
                    (m) => m.id === item.id,
                  );
                  return (
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(globalIndex)}
                        className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <i className="pi pi-pencil text-[10px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeMachine(globalIndex);
                          if (machinesList.length === 1) setShowForm(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        title="Remove"
                      >
                        <i className="pi pi-trash text-[10px]" />
                      </button>
                    </div>
                  );
                },
              },
            ]}
            renderContent={(item: Printer.MachineDetail) => {
              const globalIndex = machinesList.findIndex(
                (m) => m.id === item.id,
              );
              return (
                <MachineCard
                  machine={item}
                  index={globalIndex >= 0 ? globalIndex : 0}
                  onEdit={() => handleEdit(globalIndex >= 0 ? globalIndex : 0)}
                  onRemove={() => {
                    removeMachine(globalIndex);
                    if (machinesList.length === 1) setShowForm(true);
                  }}
                />
              );
            }}
          />
        </div>
      )}

      {/* Web Offset Infrastructure Grid */}
      {webMachines.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="border-l-4 border-l-green-600 pl-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Web Offset Infrastructure
            </h3>
          </div>
          <GridPanel
            data={webMachines}
            loading={false}
            searchBox={false}
            showExport={false}
            mode={viewMode}
            defaultMode="grid"
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-slate-600 font-medium">
                    {option.rowIndex + 1}
                  </span>
                ),
                width: "60px",
                align: "center",
                header: "S.No.",
              },
              {
                field: "cutoff",
                header: "Cutoff",
              },
              {
                field: "yearOfManufacture",
                header: "Year",
                align: "center",
              },
              {
                field: "ageOfMachine",
                header: "Age",
                align: "center",
                cell: (item: Printer.MachineDetail) =>
                  `${item.ageOfMachine} yrs`,
              },
              {
                field: "colorConfiguration",
                header: "Color Config",
                align: "center",
                cell: (item: Printer.MachineDetail) => (
                  <span className="capitalize">{item.colorConfiguration}</span>
                ),
              },
              {
                field: "sidCapacity120Days",
                header: "SID Capacity",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.sidCapacity120Days?.toLocaleString() ?? "—",
              },
              {
                field: "calculatedCapacity1Color",
                header: "Cap. 1 Color",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.calculatedCapacity1Color?.toLocaleString() ?? "—",
              },
              {
                field: "calculatedCapacity2Color",
                header: "Cap. 2 Color",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.calculatedCapacity2Color?.toLocaleString() ?? "—",
              },
              {
                field: "calculatedCapacity4Color",
                header: "Cap. 4 Color",
                align: "right",
                cell: (item: Printer.MachineDetail) =>
                  item.calculatedCapacity4Color?.toLocaleString() ?? "—",
              },
              {
                field: "remark",
                header: "Remark",
                cell: (item: Printer.MachineDetail) => item.remark || "—",
              },
              {
                header: "Actions",
                align: "center",
                width: "120px",
                cell: (item: Printer.MachineDetail) => {
                  const globalIndex = machinesList.findIndex(
                    (m) => m.id === item.id,
                  );
                  return (
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(globalIndex)}
                        className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <i className="pi pi-pencil text-[10px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeMachine(globalIndex);
                          if (machinesList.length === 1) setShowForm(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        title="Remove"
                      >
                        <i className="pi pi-trash text-[10px]" />
                      </button>
                    </div>
                  );
                },
              },
            ]}
            renderContent={(item: Printer.MachineDetail) => {
              const globalIndex = machinesList.findIndex(
                (m) => m.id === item.id,
              );
              return (
                <MachineCard
                  machine={item}
                  index={globalIndex >= 0 ? globalIndex : 0}
                  onEdit={() => handleEdit(globalIndex >= 0 ? globalIndex : 0)}
                  onRemove={() => {
                    removeMachine(globalIndex);
                    if (machinesList.length === 1) setShowForm(true);
                  }}
                />
              );
            }}
          />
        </div>
      )}

      {machinesList.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <i className="pi pi-inbox text-4xl mb-3" />
          <p className="text-sm font-medium">No machines added yet</p>
          <p className="text-xs">Click "Add Machine" to get started</p>
        </div>
      )}
    </div>
  );
}
