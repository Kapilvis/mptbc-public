import { Modal } from "shared/components/popups";
import { Button } from "shared/components/buttons";
import type { PrinterQualityInspection } from "../data";
import "./ViewReport.css";

interface ViewReportProps {
  inspection: PrinterQualityInspection | null;
  visible: boolean;
  onHide: () => void;
}

export default function ViewReport({
  inspection,
  visible,
  onHide,
}: ViewReportProps) {
  if (!inspection) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "Passed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Quality Assessment Sheet Details"
      size="large"
    >
      <div className="flex justify-end gap-2 no-print mb-4">
        <Button
          label="Print Quality Sheet"
          icon="print"
          variant="primary"
          onClick={handlePrint}
          className="text-xs font-bold shadow-sm"
        />
      </div>

      <div id="printable-inspection-report" className="space-y-6 p-4">
        {/* REPORT HEADER */}
        <div className="text-center border-b-2 border-slate-800 pb-4">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
            Madhya Pradesh Textbook Corporation (MPTBC)
          </h2>
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mt-0.5">
            Quality Inspection Report
          </h3>
        </div>

        {/* BASIC INFORMATION SECTION */}
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 border-l-4 border-green-600 pl-2">
            Basic Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 block">Printer Name</span>
              <span className="font-bold text-slate-800">
                {inspection.printerName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Inspection Date</span>
              <span className="font-bold text-slate-800">
                {formatDate(inspection.inspectionDate)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Academic Year</span>
              <span className="font-bold text-slate-800">
                {inspection.academicYear}
              </span>
            </div>
          </div>
        </div>

        {/* SCORE SHEET LIST TABLE */}
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 border-l-4 border-green-600 pl-2">
            Quality Parameters Score Sheet
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3 text-center w-12">No.</th>
                  <th className="p-3">Name of Title</th>
                  <th className="p-3 text-center w-20">Class</th>
                  <th className="p-3 text-right w-24">Total Books</th>
                  <th className="p-3 text-center w-36">
                    Registration, colour scheme & Printing Quality
                    <br />
                    <span className="text-[10px] text-black font-bold">
                      (Max: 1)
                    </span>
                  </th>
                  <th className="p-3 text-center w-36">
                    Registration, colour, Quality of Ink, Scum, Pin mark &
                    imposition
                    <br />
                    <span className="text-[10px] text-black font-bold">
                      (Max: 7)
                    </span>
                  </th>
                  <th className="p-3 text-center w-36">
                    Stitching/Perfect Binding, scheme, Evenness of Ink, Cover
                    Pasting & Trimming
                    <br />
                    <span className="text-[10px] text-black font-bold">
                      (Max: 2)
                    </span>
                  </th>
                  <th className="p-3">Others</th>
                  <th className="p-3 text-center w-24">
                    Total Score
                    <br />
                    <span className="text-[10px] text-black font-bold">
                      (Max: 10)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {inspection.items?.map((item, index) => {
                  const screenScore = Number(item.screenPrintingScore || 0);
                  const inkScore = Number(item.inkQualityScore || 0);
                  const bindingScore = Number(item.bindingScore || 0);
                  const rowSum = Number(
                    (screenScore + inkScore + bindingScore).toFixed(2),
                  );

                  return (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center text-slate-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        {item.titleName}
                      </td>
                      <td className="p-3 text-center font-bold">
                        {item.className}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {item.totalBooks?.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-bold">
                        {screenScore}
                      </td>
                      <td className="p-3 text-center font-bold">{inkScore}</td>
                      <td className="p-3 text-center font-bold">
                        {bindingScore}
                      </td>
                      <td className="p-3 text-slate-600 italic">
                        {item.otherScore || "-"}
                      </td>
                      <td className="p-3 text-center font-black text-slate-800 font-mono">
                        {rowSum}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border-t border-slate-200 pt-4">
          <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">
              Total Score Obtained
            </span>
            <span className="text-lg font-black text-slate-800 font-mono">
              {inspection.totalScore} / {inspection.maximumScore}
            </span>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">
              Calculated Percentage
            </span>
            <span className="text-lg font-black text-slate-800 font-mono">
              {inspection.percentage}%
            </span>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">
              Assessed Quality Grade
            </span>
            <span className="text-sm font-black text-emerald-800 uppercase tracking-wide">
              {inspection.grade}
            </span>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-0.5">
              Inspection Status
            </span>
            <span
              className={`inline-block px-3 py-0.5 text-xs font-bold border rounded-full uppercase tracking-wider ${getStatusBadgeClass(
                inspection.status,
              )}`}
            >
              {inspection.status}
            </span>
          </div>
        </div>

        {/* REMARKS SECTION */}
        {inspection.remarks && (
          <div className="space-y-1 text-xs border-t border-slate-200 pt-4">
            <span className="block font-black text-slate-700 uppercase tracking-widest">
              Officer General Remarks & Observations:
            </span>
            <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
              {inspection.remarks}
            </p>
          </div>
        )}

        {/* SIGNATURE SECTION FOR PRINT */}
        <div className="grid grid-cols-2 pt-12 text-center text-xs font-bold text-slate-600 mt-8 border-t border-dashed border-slate-300">
          <div>
            <div className="h-10"></div>
            <span>_______________________________</span>
            <span className="block text-[10px] text-slate-400 mt-1">
              Authorized Press Signatory
            </span>
          </div>
          <div>
            <div className="h-10"></div>
            <span>_______________________________</span>
            <span className="block text-[10px] text-slate-400 mt-1">
              Inspection Officer / MPTBC Officer
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
