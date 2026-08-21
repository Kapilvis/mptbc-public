import { Modal } from "shared/components/popups";
import { Button } from "shared/components/buttons";
import type { PaperLabTestingRecord } from "../data";
import "./ViewReport.css";

interface ViewReportProps {
  record: PaperLabTestingRecord | null;
  visible: boolean;
  onClose: () => void;
}

export default function ViewReport({
  record,
  visible,
  onClose,
}: ViewReportProps) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPass = record.overallResult === "PASS";
  const passedParamsCount = record.parameters.filter(
    (p) => p.status === "PASS",
  ).length;
  const totalParamsCount = record.parameters.length || 10;
  const scorePercentage = (
    (passedParamsCount / totalParamsCount) *
    100
  ).toFixed(2);

  const qualityGrade =
    Number(scorePercentage) >= 90
      ? "EXCELLENT"
      : Number(scorePercentage) >= 75
        ? "GOOD"
        : "POOR";

  return (
    <Modal
      visible={visible}
      onHide={onClose}
      header="Quality Assessment Details"
      size="large"
    >
      <div className="flex justify-end gap-2 no-print mb-4">
        <Button
          label="Print Quality Sheet"
          icon="pi pi-print"
          size="small"
          onClick={handlePrint}
          className="font-bold shadow-sm"
        />
      </div>

      <div id="printable-inspection-report" className="space-y-6 p-2">
        {/* Printable Title Block */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-wide uppercase">
            Madhya Pradesh Textbook Corporation (MPTBC)
          </h1>
          <h2 className="text-base font-semibold text-slate-700 mt-1">
            TBC Quality Testing Laboratory - Paper Quality Test Report
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test Report Reference: {record.testReportNo} | Date:{" "}
            {record.testingDate}
          </p>
        </div>

        {/* ─── FULL WIDTH SAMPLE INFORMATION CARD (FONT UP 1-2 POINTS + TEXT WRAP) ─── */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 w-full shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
            <i className="pi pi-info-circle text-blue-600 text-base" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Sample Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3.5 gap-x-6 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Sample ID:
              </span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {record.sampleId}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Supplier / Vendor:
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {record.supplierVendor}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Paper Type:
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {record.paperType}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                GSM Specification:
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {record.gsm}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Batch / Lot No.:
              </span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {record.batchLotNo}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Tested By:
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {record.testedBy}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm shrink-0">
                Testing Agency:
              </span>
              <span
                className="font-bold text-slate-900 text-sm whitespace-normal break-words max-w-[220px] text-right"
                title={record.testingAgency}
              >
                {record.testingAgency}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Test Report No.:
              </span>
              <span className="font-bold text-blue-700 font-mono text-sm">
                {record.testReportNo}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-600 font-semibold text-sm">
                Testing Date:
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {record.testingDate}
              </span>
            </div>
          </div>
        </div>

        {/* ─── MIDDLE SECTION: TEST RESULTS (10 KEY PARAMETERS) TABLE (FONT UP 1-2 POINTS) ─── */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <i className="pi pi-list text-blue-400" />
              Test Results (10 Key Parameters)
            </h3>
            <span className="text-[11px] text-slate-300">
              Evaluated per BIS / MPTBC Lab Specifications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No.</th>
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Required Specification</th>
                  <th className="py-3 px-4">Actual Result</th>
                  <th className="py-3 px-4 text-center">Deviation</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {record.parameters.map((param, index) => {
                  const isParamPass = param.status === "PASS";
                  return (
                    <tr
                      key={param.parameterId || index}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        {param.parameterName}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-mono text-sm font-medium">
                        {param.requiredSpecification}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 font-mono text-sm">
                        {param.actualResult}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-800 font-bold text-sm">
                        {param.deviation}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            isParamPass
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
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
        </div>

        {/* ─── BOTTOM KPI SUMMARY CARDS (IMAGE 3 SPECIFICATION) ──────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Total Score Obtained
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {passedParamsCount} / {totalParamsCount}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Calculated Percentage
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {scorePercentage}%
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Assessed Quality Grade
            </span>
            <div
              className={`text-lg font-extrabold ${
                qualityGrade === "EXCELLENT" || qualityGrade === "GOOD"
                  ? "text-emerald-700"
                  : "text-rose-700"
              }`}
            >
              {qualityGrade}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-center flex flex-col justify-center items-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Inspection Status
            </span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                isPass
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-rose-100 text-rose-700 border border-rose-300"
              }`}
            >
              <i
                className={`pi ${isPass ? "pi-check" : "pi-times"} text-[10px]`}
              />
              {isPass ? "PASSED" : "FAILED"}
            </span>
          </div>
        </div>

        {/* ─── BOTTOM SECTION: CERTIFICATE & AUTHORIZATION ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Test Certificate Card */}
          <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-4 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
              <i className="pi pi-award text-base" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Test Certificate
            </h4>
            <p className="text-[10px] text-slate-600 leading-tight">
              This is to certify that the paper sample mentioned above has been
              tested and evaluated as per approved specifications.
            </p>
            <div className="mt-2 text-xs font-bold text-emerald-700 uppercase border border-emerald-300 bg-emerald-50 px-3 py-1 rounded">
              FINAL DECISION: {isPass ? "APPROVED FOR PRINTING" : "REJECTED"}
            </div>
          </div>

          {/* Authorization Block */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Authorization & Signatures
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div>
                <div className="h-10 border-b border-slate-300 flex items-end justify-center italic text-slate-500 font-serif pb-1">
                  {record.testedBy || "R. K. Singh"}
                </div>
                <div className="font-bold text-slate-800 mt-1">Tested By</div>
                <div className="text-slate-400 text-[9px]">Lab Technician</div>
              </div>
              <div>
                <div className="h-10 border-b border-slate-300 flex items-end justify-center italic text-slate-500 font-serif pb-1">
                  Neha Sharma
                </div>
                <div className="font-bold text-slate-800 mt-1">Verified By</div>
                <div className="text-slate-400 text-[9px]">Quality Officer</div>
              </div>
              <div>
                <div className="h-10 border-b border-slate-300 flex items-end justify-center italic text-slate-500 font-serif pb-1">
                  Amit Singh
                </div>
                <div className="font-bold text-slate-800 mt-1">Approved By</div>
                <div className="text-slate-400 text-[9px]">
                  Authorized Officer
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400 italic">
          Note: Results are valid for the tested sample only. This report shall
          not be reproduced except in full, without written approval of the
          laboratory.
        </div>
      </div>
    </Modal>
  );
}
