import { useEffect, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import {
  TextBox,
  NumberBox,
  DropDownList,
  DatePicker,
} from "shared/components/forms";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { useQualityInspectionForm } from "./form.hook";
import {
  calculateInspectionSummary,
  getPrintersDropdownData,
  getPrinterAllottedTitles,
  academicYears,
  type PrinterQualityInspection,
} from "../data";
import { initialPrinterRegistrationListData } from "../../printer-registration/data";

interface FormProps {
  onSubmit: (data: PrinterQualityInspection) => Promise<void>;
  initialData?: Partial<PrinterQualityInspection>;
  isSaving?: boolean;
  onCancel: () => void;
}

export default function QualityInspectionForm({
  onSubmit,
  initialData,
  isSaving = false,
  onCancel,
}: FormProps) {
  // Initialize Form Hook
  const { handleSubmit, control, watch, setValue, reset } =
    useQualityInspectionForm(onSubmit, initialData);

  // Field Array for dynamic textbook rows
  const { fields, replace } = useFieldArray({
    control,
    name: "items",
  });

  const printersList = useMemo(() => getPrintersDropdownData(), []);

  // Watch fields for autoloading
  const watchedPrinterCode = watch("printerCode");
  const watchedItems = watch("items") || [];

  // Autofill Printer Information and Autoload Titles
  useEffect(() => {
    if (watchedPrinterCode) {
      const printer = initialPrinterRegistrationListData.find(
        (p) => p.printerCode === watchedPrinterCode,
      );
      if (printer) {
        setValue("printerName", printer.printerName);
        setValue("printerId", printer.printerCode);
      }

      // Autoload allotted titles if in Create Mode (no items pre-populated)
      if (
        !initialData ||
        !initialData.items ||
        initialData.items.length === 0
      ) {
        const allotted = getPrinterAllottedTitles(watchedPrinterCode);
        replace(allotted);
      }
    } else {
      if (
        !initialData ||
        !initialData.items ||
        initialData.items.length === 0
      ) {
        replace([]);
      }
    }
  }, [watchedPrinterCode, setValue, replace, initialData]);

  // Sync default values on Edit Mode
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.items) {
        replace(initialData.items);
      }
    }
  }, [initialData, reset, replace]);

  // Real-time batch totals & percentage calculations
  const summary = useMemo(() => {
    return calculateInspectionSummary(watchedItems);
  }, [watchedItems]);

  // Sync computed fields with form state so they submit properly
  useEffect(() => {
    setValue("totalScore", summary.totalScore);
    setValue("maximumScore", summary.maximumScore);
    setValue("percentage", summary.percentage);
    setValue("grade", summary.grade);
    setValue("status", summary.status);
  }, [summary, setValue]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── BASIC INFORMATION CARD ───────────────────────────────────────── */}
      <Card className="p-6 border border-slate-100" title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DropDownList
            data={academicYears}
            textField="text"
            optionValue="id"
            name="academicYear"
            control={control}
            label="Academic Year"
            required
            placeholder="Select Academic Year"
          />

          <DropDownList
            data={printersList}
            textField="text"
            optionValue="code"
            name="printerCode"
            control={control}
            label="Printer Name"
            required
            placeholder="Search / Select Printer"
          />

          <DatePicker
            label="Inspection Date"
            name="inspectionDate"
            control={control}
            required
            disableFuture
            placeholder="Select Inspection Date"
          />
        </div>
      </Card>

      {/* ─── BATCH EVALUATION GRID CARD ───────────────────────────────────── */}
      <Card
        className="p-6 border border-slate-100"
        title="Quality Inspection Score Sheet"
      >
        {fields.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Please select a printer to load the allotted textbook titles.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 font-bold">
                  <th className="p-3 text-center w-12">No.</th>
                  <th className="p-3 min-w-50">Name of Title</th>
                  <th className="p-3 text-center w-20">Class</th>
                  <th className="p-3 text-right w-28">Total Books</th>
                  <th className="p-3 text-center w-36">
                    Registration, colour scheme & Printing Quality
                    <br />
                    <span className="text-[10px] text-emerald-600 font-normal">
                      (Max: 1)
                    </span>
                  </th>
                  <th className="p-3 text-center w-36">
                    Registration, colour, Quality of Ink, Scum, Pin mark &
                    imposition
                    <br />
                    <span className="text-[10px] text-emerald-600 font-normal">
                      (Max: 7)
                    </span>
                  </th>
                  <th className="p-3 text-center w-36">
                    Stitching/Perfect Binding, scheme, Evenness of Ink, Cover
                    Pasting & Trimming
                    <br />
                    <span className="text-[10px] text-emerald-600 font-normal">
                      (Max: 2)
                    </span>
                  </th>
                  <th className="p-3 min-w-37.5">Others</th>
                  <th className="p-3 text-center w-24">
                    Total
                    <br />
                    <span className="text-[10px] text-emerald-600 font-normal">
                      (Max: 10)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {fields.map((field, index) => {
                  const screenVal = Number(
                    watchedItems[index]?.screenPrintingScore || 0,
                  );
                  const inkVal = Number(
                    watchedItems[index]?.inkQualityScore || 0,
                  );
                  const bindingVal = Number(
                    watchedItems[index]?.bindingScore || 0,
                  );
                  const rowSum = Number(
                    (screenVal + inkVal + bindingVal).toFixed(2),
                  );

                  return (
                    <tr key={field.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center font-medium text-slate-500">
                        {index + 1}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        {field.titleName}
                      </td>
                      <td className="p-3 text-center font-bold">
                        {field.className}
                      </td>
                      <td className="p-3 text-right font-mono font-medium">
                        {field.totalBooks?.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <NumberBox
                          name={`items.${index}.screenPrintingScore`}
                          control={control}
                          min={0}
                          max={1}
                          required
                          className="w-full"
                          inputClassName="p-1 text-center font-bold text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <NumberBox
                          name={`items.${index}.inkQualityScore`}
                          control={control}
                          min={0}
                          max={7}
                          required
                          className="w-full"
                          inputClassName="p-1 text-center font-bold text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <NumberBox
                          name={`items.${index}.bindingScore`}
                          control={control}
                          min={0}
                          max={2}
                          required
                          className="w-full"
                          inputClassName="p-1 text-center font-bold text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <TextBox
                          name={`items.${index}.otherScore`}
                          control={control}
                          placeholder="e.g. Minor scuff remarks"
                          className="w-full"
                        />
                      </td>
                      <td className="p-3 text-center font-black text-sm text-slate-800 font-mono">
                        {rowSum}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ─── ACTION BUTTONS ──────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <Button
          type="button"
          label="Cancel"
          onClick={onCancel}
          variant="outlined"
          className="px-6 font-bold text-xs"
        />
        <Button
          type="submit"
          label={isSaving ? "Saving..." : "Save Assessment Report"}
          disabled={isSaving}
          variant="primary"
          className="px-6 shadow-sm font-bold text-xs"
        />
      </div>
    </form>
  );
}
