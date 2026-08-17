import { useState, useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextBox,
} from "shared/components/forms";
import { Card } from "shared/components/panels";
import GridPanel from "shared/components/panels/GridPanel";
import Page from "shared/components/panels/Page";
import { Modal } from "shared/components/popups";
import {
  usePaperTenderQuery,
  usePublishPaperTenderMutation,
  useSavePaperTenderDraftMutation,
} from "../queries";

export default function PaperTenderRaiseForm() {
  const { data: initialTender, isLoading } = usePaperTenderQuery();

  const [tenderForm, setTenderForm] = useState<Partial<PaperTender.Item>>({
    tenderRefNo: "MPTBC/PAPER/2026-27/P-1",
    academicYear: "2026-2027",
    tenderTitle:
      "Notice Inviting Tender for Procurement of Printing Maplitho & Art Card Cover Paper (Academic Year 2026-27)",
    tenderType: "Open Tender (Two Envelope System)",
    contractForm: "Item Wise Rate Contract",
    emdAmount: 1000000,
    tenderFee: 35400,
    processingFee: 295,
    bidValidityDays: 180,
    publishDate: "2026-08-20",
    docDownloadStartDate: "2026-08-21",
    preBidMeetingDate: "2026-08-28",
    preBidVenue:
      "Conference Hall, MPTBC Head Office, Arera Hills, Bhopal (M.P.)",
    bidSubmissionEndDate: "2026-09-10",
    techBidOpeningDate: "2026-09-12",
  });

  const [lots, setLots] = useState<PaperTender.TenderLotItem[]>([]);
  const [checklist, setChecklist] = useState<
    PaperTender.TenderComplianceItem[]
  >([]);
  const [showNitModal, setShowNitModal] = useState(false);

  useEffect(() => {
    if (initialTender) {
      setTenderForm(initialTender);
      setLots(initialTender.lots || []);
      setChecklist(initialTender.complianceChecklist || []);
    }
  }, [initialTender]);

  const { mutateAsync: saveDraft, isPending: isDraftPending } =
    useSavePaperTenderDraftMutation();

  const { mutateAsync: publishTender, isPending: isPublishPending } =
    usePublishPaperTenderMutation();

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
  ];

  const tenderTypeOptions = [
    {
      label: "Open Tender (Two Envelope System)",
      value: "Open Tender (Two Envelope System)",
    },
    {
      label: "Limited Tender (Pre-Qualified Mills)",
      value: "Limited Tender (Pre-Qualified Mills)",
    },
    { label: "Single Source Procurement", value: "Single Source Procurement" },
  ];

  const contractFormOptions = [
    { label: "Item Wise Rate Contract", value: "Item Wise Rate Contract" },
    {
      label: "Lump Sum Quantity Contract",
      value: "Lump Sum Quantity Contract",
    },
  ];

  const bisStandardOptions = [
    {
      label: "IS 1848:2007 (Min 80% Brightness)",
      value: "IS 1848:2007 (Min 80% Brightness)",
    },
    {
      label: "IS 1848:2007 (Min 82% Brightness)",
      value: "IS 1848:2007 (Min 82% Brightness)",
    },
    {
      label: "IS 4658:1988 (Coated Art Card)",
      value: "IS 4658:1988 (Coated Art Card)",
    },
    {
      label: "IS 4658:1988 (High Bulk Cover Card)",
      value: "IS 4658:1988 (High Bulk Cover Card)",
    },
  ];

  const handleLotBisChangeByCode = (gsmCode: string, val: string) => {
    setLots((prev) =>
      prev.map((lot) =>
        lot.gsmCode === gsmCode ? { ...lot, bisStandard: val } : lot,
      ),
    );
  };

  const handleChecklistToggle = (index: number, checked: boolean) => {
    const updated = [...checklist];
    updated[index].checked = checked;
    setChecklist(updated);
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft({
        ...tenderForm,
        lots,
        complianceChecklist: checklist,
      });
      ToastService.success("Paper Tender Draft saved successfully.");
    } catch {
      ToastService.error("Failed to save Tender Draft");
    }
  };

  const handlePublish = async () => {
    try {
      await publishTender({
        ...tenderForm,
        lots,
        complianceChecklist: checklist,
      });
      ToastService.success(
        `Tender ${tenderForm.tenderRefNo} published successfully! Pushed to e-Procurement Portal Queue.`,
      );
    } catch {
      ToastService.error("Failed to publish Tender");
    }
  };

  if (isLoading) {
    return (
      <Page header="Paper Tender Raise">Loading tender specifications...</Page>
    );
  }

  const totalGrossMt = lots.reduce((acc, l) => acc + l.quantityMt, 0);
  const totalBudgetCrores = (
    lots.reduce((acc, l) => acc + l.estimatedCostLakhs, 0) / 100
  ).toFixed(2);

  return (
    <Page
      header="Paper Tender - Notice Inviting Tender (NIT)"
      subHeader="Convert locked GSM paper demands into an official Notice Inviting Tender (NIT) draft for bulk procurement via e-Procurement/GeM portals."
      showHeaderActions
    >
      <div className="space-y-6">
        {/* CARD 1: Tender Basic Info */}
        <Card title="1. Tender Basic Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextBox
                  label="Tender Reference No."
                  value={tenderForm.tenderRefNo || ""}
                  disabled
                  icon="lock"
                />
              </div>
              <div>
                <DropDownList
                  label="Academic Year"
                  data={academicYearOptions}
                  value={tenderForm.academicYear}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      academicYear: String(val ?? "2026-2027"),
                    }))
                  }
                  textField="label"
                  optionValue="value"
                />
              </div>
            </div>

            <div>
              <TextBox
                label="Tender Title"
                value={tenderForm.tenderTitle || ""}
                onChange={(val) =>
                  setTenderForm((prev) => ({
                    ...prev,
                    tenderTitle: String(val ?? ""),
                  }))
                }
                placeholder="Enter Notice Inviting Tender Title..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DropDownList
                  label="Tender Type"
                  data={tenderTypeOptions}
                  value={tenderForm.tenderType}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      tenderType: String(val ?? ""),
                    }))
                  }
                  textField="label"
                  optionValue="value"
                />
              </div>

              <div>
                <DropDownList
                  label="Contract Form"
                  data={contractFormOptions}
                  value={tenderForm.contractForm}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      contractForm: String(val ?? ""),
                    }))
                  }
                  textField="label"
                  optionValue="value"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <NumberBox
                  label="EMD Amount (₹)"
                  value={tenderForm.emdAmount || 0}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      emdAmount: Number(val ?? 0),
                    }))
                  }
                />
              </div>
              <div>
                <NumberBox
                  label="Tender Fee (₹)"
                  value={tenderForm.tenderFee || 0}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      tenderFee: Number(val ?? 0),
                    }))
                  }
                />
              </div>
              <div>
                <NumberBox
                  label="Bid Validity (Days)"
                  value={tenderForm.bidValidityDays || 180}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      bidValidityDays: Number(val ?? 180),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 2: Key Schedule & Critical Dates */}
        <Card title="2. Key Schedule & Critical Dates">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DatePicker
                  label="Publish Date"
                  value={
                    tenderForm.publishDate
                      ? new Date(tenderForm.publishDate)
                      : null
                  }
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      publishDate: val ? val.toISOString().split("T")[0] : "",
                    }))
                  }
                />
              </div>
              <div>
                <DatePicker
                  label="Doc Download Start"
                  value={
                    tenderForm.docDownloadStartDate
                      ? new Date(tenderForm.docDownloadStartDate)
                      : null
                  }
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      docDownloadStartDate: val
                        ? val.toISOString().split("T")[0]
                        : "",
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DatePicker
                  label="Pre-Bid Meeting Date"
                  value={
                    tenderForm.preBidMeetingDate
                      ? new Date(tenderForm.preBidMeetingDate)
                      : null
                  }
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      preBidMeetingDate: val
                        ? val.toISOString().split("T")[0]
                        : "",
                    }))
                  }
                />
              </div>
              <div>
                <TextBox
                  label="Pre-Bid Venue"
                  value={tenderForm.preBidVenue || ""}
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      preBidVenue: String(val ?? ""),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DatePicker
                  label="Bid Submission End Date"
                  value={
                    tenderForm.bidSubmissionEndDate
                      ? new Date(tenderForm.bidSubmissionEndDate)
                      : null
                  }
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      bidSubmissionEndDate: val
                        ? val.toISOString().split("T")[0]
                        : "",
                    }))
                  }
                />
              </div>
              <div>
                <DatePicker
                  label="Tech Bid Opening Date"
                  value={
                    tenderForm.techBidOpeningDate
                      ? new Date(tenderForm.techBidOpeningDate)
                      : null
                  }
                  onChange={(val) =>
                    setTenderForm((prev) => ({
                      ...prev,
                      techBidOpeningDate: val
                        ? val.toISOString().split("T")[0]
                        : "",
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 3: Imported Locked Demand & BOQ Specification (Using GridPanel Component) */}
        <Card title="3. Imported Locked Demand & BOQ Specification">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 mb-4 text-xs">
            <div>
              <span className="font-bold text-emerald-950 dark:text-emerald-300 block">
                Auto-Imported Locked GSM Specifications
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400">
                Specifications locked from GSM Wise Paper Demand Report for
                e-Procurement NIT.
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono font-bold">
              <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="text-[10px] text-gray-500 block">
                  TOTAL GROSS
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                  {totalGrossMt.toFixed(3)} MT
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="text-[10px] text-gray-500 block">
                  EST. BUDGET
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                  ₹ {totalBudgetCrores} Cr
                </span>
              </div>
            </div>
          </div>

          <GridPanel<PaperTender.TenderLotItem>
            data={lots}
            columns={[
              {
                field: "lotNo",
                header: "Lot No.",
                align: "center",
                cell: (row) => (
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    Lot {row.lotNo}
                  </span>
                ),
              },
              {
                field: "gsmName",
                header: "Paper Description",
                cell: (row) => (
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {row.gsmName}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {row.gsmCode}
                    </div>
                  </div>
                ),
              },
              {
                field: "quantityMt",
                header: "Quantity (MT)",
                align: "right",
                cell: (row) => (
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {row.quantityMt.toFixed(3)} MT
                  </span>
                ),
              },
              {
                field: "paperCategory",
                header: "Packing Type",
                align: "center",
                cell: (row) => (
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {row.paperCategory}
                  </span>
                ),
              },
              {
                field: "bisStandard",
                header: "BIS Quality Standard",
                cell: (row) => (
                  <DropDownList
                    data={bisStandardOptions}
                    value={row.bisStandard}
                    onChange={(val) =>
                      handleLotBisChangeByCode(row.gsmCode, String(val ?? ""))
                    }
                    textField="label"
                    optionValue="value"
                  />
                ),
              },
              {
                field: "deliveryDepots",
                header: "Delivery Depots",
                cell: (row) => (
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {row.deliveryDepots.join(", ")}
                  </span>
                ),
              },
              {
                field: "estimatedCostLakhs",
                header: "Est. Cost (₹ L)",
                align: "right",
                cell: (row) => (
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                    ₹ {row.estimatedCostLakhs.toFixed(2)} L
                  </span>
                ),
              },
            ]}
          />
        </Card>

        {/* CARD 4: Cleaned Mandatory Technical Compliance Checklist */}
        <Card title="4. Mandatory Technical Compliance Checklist (Cover 1)">
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2 text-xs">
            <i className="pi pi-info-circle text-emerald-600 dark:text-emerald-400 mt-0.5 text-sm" />
            <div>
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                Purpose of Cover 1 Technical Qualification:
              </span>
              <p className="text-emerald-800 dark:text-emerald-400 text-[11px] leading-relaxed">
                As per e-Procurement rules, paper mills must submit these
                mandatory technical qualification documents in Cover 1 to
                qualify for financial bid evaluation. Uncheck any document not
                required for this specific tender.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((item, idx) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.checked
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 shadow-2xs"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70"
                }`}
              >
                <div className="pt-0.5">
                  <Checkbox
                    checked={item.checked}
                    onChange={(e) => handleChecklistToggle(idx, !!e.checked)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {item.label}
                    </span>
                    {item.required && (
                      <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-1 leading-snug">
                    {item.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">
              Tender Status:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                tenderForm.status === "Published"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {tenderForm.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              label="Save Draft"
              icon="pi pi-save"
              size="small"
              variant="outlined"
              disabled={isDraftPending}
              onClick={handleSaveDraft}
            />
            <Button
              label="Preview NIT PDF"
              icon="pi pi-file-pdf"
              size="small"
              variant="outlined"
              onClick={() => setShowNitModal(true)}
            />
            <Button
              label="Publish Tender"
              icon="pi pi-send"
              size="small"
              disabled={isPublishPending}
              className="!bg-emerald-600 !text-white hover:!bg-emerald-700 font-bold"
              onClick={handlePublish}
            />
          </div>
        </div>
      </div>

      {/* Notice Inviting Tender (NIT) Document Preview Modal */}
      <Modal
        visible={showNitModal}
        onHide={() => setShowNitModal(false)}
        header={`Official Notice Inviting Tender (NIT) - ${tenderForm.tenderRefNo || ""}`}
        size="medium"
      >
        <div className="space-y-4 p-2">
          {/* Official Letterhead */}
          <div className="border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 text-center">
            <h2 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-200 uppercase tracking-wide">
              Madhya Pradesh Textbook Corporation
            </h2>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              Pustak Bhawan, Arera Hills, Bhopal - 462011 (M.P.)
            </p>
            <div className="h-0.5 bg-emerald-300 dark:bg-emerald-700 my-2" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Ref No: {tenderForm.tenderRefNo} | Date: {tenderForm.publishDate}
            </p>
            <h3 className="font-black text-sm text-gray-900 dark:text-white mt-3 underline uppercase">
              Notice Inviting Tender (NIT)
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-xl mx-auto">
              {tenderForm.tenderTitle}
            </p>
          </div>

          {/* Tender Financial & Schedule Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 font-semibold block text-[11px]">
                EMD Amount & Tender Fee
              </span>
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                EMD: ₹ {(tenderForm.emdAmount || 0).toLocaleString()} | Fee: ₹{" "}
                {(tenderForm.tenderFee || 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 font-semibold block text-[11px]">
                Bid Submission Deadline
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {tenderForm.bidSubmissionEndDate} (Up to 17:00 Hrs)
              </span>
            </div>
          </div>

          {/* BOQ Tonnage Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-xs">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 font-bold text-gray-700 grid grid-cols-12 gap-2">
              <div className="col-span-2">Lot No</div>
              <div className="col-span-6">Specification</div>
              <div className="col-span-4 text-right">Tonnage (MT)</div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {lots.map((l) => (
                <div key={l.lotNo} className="p-2 grid grid-cols-12 gap-2">
                  <div className="col-span-2 font-bold text-emerald-700">
                    Lot {l.lotNo}
                  </div>
                  <div className="col-span-6 font-semibold">{l.gsmName}</div>
                  <div className="col-span-4 text-right font-mono font-bold text-blue-600">
                    {l.quantityMt.toFixed(3)} MT
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              label="Download Official NIT PDF"
              icon="pi pi-download"
              size="small"
              onClick={() =>
                ToastService.success("Downloading official NIT document PDF...")
              }
            />
            <Button
              label="Close"
              size="small"
              variant="outlined"
              onClick={() => setShowNitModal(false)}
            />
          </div>
        </div>
      </Modal>
    </Page>
  );
}
