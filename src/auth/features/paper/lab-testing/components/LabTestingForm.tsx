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

  // Helper submitters for manual decision buttons
  const handleDecisionSubmit = (result: "PASS" | "FAIL") => {
    setValue("overallResult", result);
    setValue(
      "approvalStatus",
      result === "PASS" ? "Approved for Use" : "Rejected / Out of Spec",
    );
    handleSubmit();
  };

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

      {/* ─── STAGE 2: LAB PARAMETERS EVALUATION GRID CARD (INSTANT REAL-TIME RED HIGHLIGHTING) ─── */}
      {!isCreateStage && (
        <Card
          className="p-6 border border-slate-100 shadow-sm"
          title="Lab Testing Parameters (10 Key Quality Indicators)"
        >
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-semibold">
                {fields.map((field, idx) => {
                  const config = fixedLabParameters[idx];
                  const actualVal = watchedParameters[idx]?.actualResult;
                  const evalRes = config
                    ? computeParameterEvaluation(config, actualVal)
                    : { deviation: "-", status: "PASS" as const };

                  const isOut = evalRes.status === "FAIL";

                  return (
                    <tr
                      key={field.id}
                      className={
                        isOut
                          ? "bg-rose-50/90 border-l-4 border-rose-500 font-bold text-rose-900 transition-all duration-150"
                          : "hover:bg-slate-50/80 transition-colors"
                      }
                    >
                      <td
                        className={`py-3.5 px-4 text-center font-bold ${
                          isOut ? "text-rose-700" : "text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </td>

                      {/* Column 1: Parameter Name */}
                      <td
                        className={`py-3.5 px-4 font-bold ${
                          isOut ? "text-rose-900" : "text-slate-800"
                        }`}
                      >
                        {config?.name || watchedParameters[idx]?.parameterName}
                      </td>

                      {/* Column 2: Required Specification */}
                      <td
                        className={`py-3.5 px-4 font-semibold font-mono ${
                          isOut
                            ? "bg-rose-100/60 text-rose-900"
                            : "bg-slate-50/50 text-slate-800"
                        }`}
                      >
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
                      <td
                        className={`py-3.5 px-4 text-center font-mono font-black ${
                          isOut ? "text-rose-700" : "text-slate-800"
                        }`}
                      >
                        {evalRes.deviation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ─── ACTION BUTTONS (PASS & FAIL EXPLICIT DECISION BUTTONS) ─────────────────────────────── */}
      <div className="flex justify-end items-center gap-3 pt-2 w-full">
        {isCreateStage ? (
          <>
            <Button
              label="Send Sample for Testing"
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              icon="pi pi-send"
            />
            <Button
              type="button"
              label="Clear"
              icon="pi pi-refresh"
              onClick={() => reset()}
              disabled={isSaving}
            />
          </>
        ) : (
          <>
            {/* Pass Report & Approve Button */}
            <Button
              type="button"
              label="Pass Report & Approve"
              icon="pi pi-check-circle"
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow-sm"
              isLoading={isSaving}
              disabled={isSaving}
              onClick={() => handleDecisionSubmit("PASS")}
            />

            {/* Fail Report & Reject Button */}
            <Button
              type="button"
              label="Fail Report & Reject"
              icon="pi pi-times-circle"
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg shadow-sm border-none"
              isLoading={isSaving}
              disabled={isSaving}
              onClick={() => handleDecisionSubmit("FAIL")}
            />
          </>
        )}

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
