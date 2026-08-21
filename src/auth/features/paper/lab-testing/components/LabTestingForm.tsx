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
import { usePaperLabTestingForm } from "./form.hook";
import {
  fixedLabParameters,
  testingAgencies,
  defaultPaperTypes,
  defaultGsmOptions,
  computeParameterEvaluation,
  generateSampleId,
  type PaperLabTestingRecord,
} from "../data";

interface LabTestingFormProps {
  onSubmit: (data: PaperLabTestingRecord) => Promise<void>;
  initialData?: Partial<PaperLabTestingRecord>;
  isSaving?: boolean;
  mode?: "create" | "receive" | "edit";
  onCancel: () => void;
}

export default function LabTestingForm({
  onSubmit,
  initialData,
  isSaving = false,
  mode = "create",
  onCancel,
}: LabTestingFormProps) {
  const isCreateStage = mode === "create";

  // Generate initial Sample ID if new
  const defaultSampleId = useMemo(() => {
    return initialData?.sampleId || generateSampleId(0);
  }, [initialData]);

  const defaultReportNo = useMemo(() => {
    return (
      initialData?.testReportNo ||
      `TBC/PQT/${new Date().getFullYear()}/${defaultSampleId.split("-").pop()}`
    );
  }, [initialData, defaultSampleId]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { handleSubmit, control, watch, setValue, reset } =
    usePaperLabTestingForm(onSubmit, {
      sampleId: defaultSampleId,
      supplierVendor: "ABC Paper Mills",
      paperType: "Book Printing Paper",
      gsm: "80 GSM",
      batchLotNo: "LOT-45821",
      testedBy: "R. K. Singh",
      testingAgency: testingAgencies[0].name,
      testReportNo: defaultReportNo,
      sentDate: todayStr,
      receivedDate: todayStr,
      testingDate: todayStr,
      overallResult: isCreateStage ? "SENT" : "PASS",
      approvalStatus: isCreateStage
        ? "Sent for Lab Testing"
        : "Approved for Use",
      parameters: fixedLabParameters.map((p) => {
        const initialVal =
          p.target ??
          (p.type === "max" ? (p.max ? p.max - 5 : 25) : p.min) ??
          80;
        const evalRes = computeParameterEvaluation(p, initialVal);
        return {
          parameterId: p.id,
          parameterName: p.name,
          requiredSpecification: p.requiredSpecification,
          actualResult: initialVal,
          deviation: evalRes.deviation,
          status: evalRes.status,
        };
      }),
      ...initialData,
    });

  const { fields } = useFieldArray({
    control,
    name: "parameters",
  });

  const watchedParameters = watch("parameters") || [];

  // Recalculate deviation and status per parameter on actualResult change
  useEffect(() => {
    if (isCreateStage) return;
    watchedParameters.forEach((paramItem, idx) => {
      const config = fixedLabParameters.find(
        (p) => p.id === paramItem.parameterId,
      );
      if (config) {
        const evalResult = computeParameterEvaluation(
          config,
          paramItem.actualResult,
        );
        if (paramItem.deviation !== evalResult.deviation) {
          setValue(`parameters.${idx}.deviation`, evalResult.deviation, {
            shouldValidate: true,
          });
        }
        if (paramItem.status !== evalResult.status) {
          setValue(`parameters.${idx}.status`, evalResult.status, {
            shouldValidate: true,
          });
        }
      }
    });
  }, [watchedParameters, setValue, isCreateStage]);

  // Overall pass/fail status
  const isOverallPass = useMemo(() => {
    if (!watchedParameters || watchedParameters.length === 0) return true;
    return watchedParameters.every((p) => p.status === "PASS");
  }, [watchedParameters]);

  useEffect(() => {
    if (isCreateStage) {
      setValue("overallResult", "SENT");
      setValue("approvalStatus", "Sent for Lab Testing");
    } else {
      setValue("overallResult", isOverallPass ? "PASS" : "FAIL");
      setValue(
        "approvalStatus",
        isOverallPass ? "Approved for Use" : "Rejected / Out of Spec",
      );
    }
  }, [isOverallPass, setValue, isCreateStage]);

  const testingAgencyOptions = useMemo(() => {
    return testingAgencies.map((a) => ({ text: a.name, value: a.name }));
  }, []);

  const paperTypeOptions = useMemo(() => {
    return defaultPaperTypes.map((t) => ({ text: t, value: t }));
  }, []);

  const gsmOptions = useMemo(() => {
    return defaultGsmOptions.map((g) => ({ text: g, value: g }));
  }, []);

  const vendorOptions = [
    { text: "ABC Paper Mills", value: "ABC Paper Mills" },
    { text: "Sunrise Paper Ltd.", value: "Sunrise Paper Ltd." },
    { text: "MPP Paper Industries", value: "MPP Paper Industries" },
    { text: "Shree Ganesh Paper", value: "Shree Ganesh Paper" },
    { text: "Narmada Paper Mills", value: "Narmada Paper Mills" },
    { text: "Shivam Paper Works", value: "Shivam Paper Works" },
    { text: "Maa Paper Industries", value: "Maa Paper Industries" },
    { text: "Bharat Paper Mills", value: "Bharat Paper Mills" },
    { text: "Galaxy Paper Ltd.", value: "Galaxy Paper Ltd." },
    { text: "Shakti Paper Mills", value: "Shakti Paper Mills" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── STAGE 1: SAMPLE & TESTING AGENCY INFO (READ-ONLY SUMMARY ON RECEIVE PAGE) ──── */}
      {mode === "receive" ? (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm font-semibold flex-1">
              <div>
                <span className="text-slate-500 block uppercase text-xs font-bold tracking-wider mb-1">
                  Sample ID
                </span>
                <span className="font-mono text-blue-600 font-black text-base">
                  {watch("sampleId")}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block uppercase text-xs font-bold tracking-wider mb-1">
                  Supplier / Vendor
                </span>
                <span className="font-bold text-slate-800 text-base">
                  {watch("supplierVendor")}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block uppercase text-xs font-bold tracking-wider mb-1">
                  Testing Agency
                </span>
                <span className="font-semibold text-slate-800 text-sm block">
                  {watch("testingAgency")}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block uppercase text-xs font-bold tracking-wider mb-1">
                  Batch / Lot No.
                </span>
                <span className="font-bold font-mono text-slate-800 text-base">
                  {watch("batchLotNo")}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block uppercase text-xs font-bold tracking-wider mb-1">
                  Sample Sent Date
                </span>
                <span className="font-bold font-mono text-slate-800 text-base">
                  {watch("sentDate") || watch("testingDate") || todayStr}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase shrink-0">
              <i className="pi pi-send text-[10px]" /> SENT FOR TESTING
            </span>
          </div>

          {/* Report Received Date Picker Card */}
          <Card className="p-5 border border-slate-100 shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <DatePicker
                label="Report Received Date *"
                name="receivedDate"
                control={control}
                required
                placeholder="Select Date Report Was Received"
              />

              <TextBox
                label="Tested By (Tester / Inspector Name)"
                name="testedBy"
                control={control}
                required
                placeholder="Enter tester / inspector name"
              />
            </div>
          </Card>
        </div>
      ) : (
        <Card
          className="p-6 border border-slate-100 shadow-sm"
          title="Sample & Testing Agency Information"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample ID (Disabled Read-Only Field) */}
            <TextBox
              label="Sample ID"
              name="sampleId"
              control={control}
              disabled
              placeholder="Auto-generated Sample ID"
            />

            <DropDownList
              data={vendorOptions}
              textField="text"
              optionValue="value"
              name="supplierVendor"
              control={control}
              label="Supplier / Vendor"
              required
              disabled={!isCreateStage && mode !== "edit"}
              placeholder="Select Supplier / Vendor"
            />

            <DropDownList
              data={paperTypeOptions}
              textField="text"
              optionValue="value"
              name="paperType"
              control={control}
              label="Paper Type"
              required
              disabled={!isCreateStage && mode !== "edit"}
              placeholder="Select Paper Type"
            />

            <DropDownList
              data={gsmOptions}
              textField="text"
              optionValue="value"
              name="gsm"
              control={control}
              label="GSM Specification"
              required
              disabled={!isCreateStage && mode !== "edit"}
              placeholder="Select GSM"
            />

            <TextBox
              label="Batch / Lot No."
              name="batchLotNo"
              control={control}
              required
              disabled={!isCreateStage && mode !== "edit"}
              placeholder="e.g. LOT-45821"
            />

            <DropDownList
              data={testingAgencyOptions}
              textField="text"
              optionValue="value"
              name="testingAgency"
              control={control}
              label="Testing Agency (Third-Party / Lab)"
              required
              disabled={!isCreateStage && mode !== "edit"}
              placeholder="Select Testing Agency"
            />

            {/* Tested By Input Field */}
            <TextBox
              label="Tested By"
              name="testedBy"
              control={control}
              required
              placeholder="Enter tester person's name (e.g. R. K. Singh)"
            />

            {/* Test Report No (Disabled Read-Only Field) */}
            <TextBox
              label="Test Report No."
              name="testReportNo"
              control={control}
              disabled
              placeholder="Auto-generated Test Report No."
            />

            <DatePicker
              label="Sample Sent Date *"
              name="sentDate"
              control={control}
              required
              placeholder="Select Sample Sent Date"
            />
          </div>
        </Card>
      )}

      {/* ─── STAGE 2: LAB PARAMETERS EVALUATION GRID CARD (ENABLED ON RECEIVE / EDIT) ─── */}
      {!isCreateStage && (
        <Card
          className="p-6 border border-slate-100 shadow-sm"
          title="Lab Testing Parameters (10 Key Quality Indicators)"
        >
          <div className="mb-4 p-4 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Overall Test Result Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold ${
                    isOverallPass
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  <i
                    className={`pi ${
                      isOverallPass ? "pi-check-circle" : "pi-times-circle"
                    }`}
                  />
                  {isOverallPass
                    ? "PASSED (Approved for Use)"
                    : "FAILED (Rejected / Out of Spec)"}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  (Calculated automatically based on 10 lab parameter
                  evaluations)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Key Parameters
              </span>
              <div className="text-lg font-black text-slate-900">
                10 Parameters
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="bg-slate-800 text-white font-bold uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No.</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Parameter Name</th>
                  <th className="py-3.5 px-4 min-w-[200px]">
                    Required Specification
                  </th>
                  <th className="py-3.5 px-4 min-w-[180px]">
                    Actual Result (Agency Input)
                  </th>
                  <th className="py-3.5 px-4 min-w-[140px] text-center">
                    Deviation (Auto)
                  </th>
                  <th className="py-3.5 px-4 min-w-[120px] text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-semibold">
                {fields.map((field, idx) => {
                  const config = fixedLabParameters[idx];
                  const currentStatus =
                    watchedParameters[idx]?.status || "PASS";
                  const currentDeviation =
                    watchedParameters[idx]?.deviation || "-";
                  const isParamPass = currentStatus === "PASS";

                  return (
                    <tr
                      key={field.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                        {idx + 1}
                      </td>

                      {/* Column 1: Parameter Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {config?.name || watchedParameters[idx]?.parameterName}
                      </td>

                      {/* Column 2: Required Specification */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 font-mono bg-slate-50/50">
                        {config?.requiredSpecification ||
                          watchedParameters[idx]?.requiredSpecification}
                      </td>

                      {/* Column 3: Actual Result Input */}
                      <td className="py-2.5 px-3">
                        <NumberBox
                          name={`parameters.${idx}.actualResult`}
                          control={control}
                          maxFractionDigits={2}
                          placeholder={`Enter actual ${config?.unit || ""}`}
                        />
                      </td>

                      {/* Column 4: Auto-calculated Deviation */}
                      <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-800">
                        {currentDeviation}
                      </td>

                      {/* Column 5: Auto-calculated Pass/Fail Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            isParamPass
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-rose-100 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <i
                            className={`pi ${
                              isParamPass ? "pi-check" : "pi-times"
                            } text-[9px]`}
                          />
                          {isParamPass ? "PASSED" : "FAILED"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ─── ACTION BUTTONS (FLUSH RIGHT ALIGNED) ─────────────────────────────── */}
      <div className="flex justify-end items-center gap-3 pt-2 w-full">
        <Button
          label={
            isCreateStage
              ? "Send Sample for Testing"
              : mode === "receive"
                ? "Save Lab Test Report"
                : "Update Lab Report"
          }
          type="submit"
          isLoading={isSaving}
          disabled={isSaving}
          icon={isCreateStage ? "pi pi-send" : "pi pi-save"}
        />
        <Button
          type="button"
          label={mode === "create" ? "Clear" : "Reset"}
          icon="pi pi-refresh"
          onClick={() => reset()}
          disabled={isSaving}
        />
        <Button
          type="button"
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary"
          onClick={onCancel}
          disabled={isSaving}
        />
      </div>
    </form>
  );
}
