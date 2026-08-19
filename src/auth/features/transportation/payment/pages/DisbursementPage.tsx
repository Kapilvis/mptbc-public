import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { useForm } from "react-hook-form";
import { ToastService } from "services";
import {
  useWorkOrdersQuery,
  useApprovePaymentClaimMutation,
} from "../../work-order/queries";
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  DollarSign,
  Download,
} from "lucide-react";

interface DisbursementRow extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
  allocatedTransporterId?: number;
}

interface DisbursementFormValues {
  neftReference: string;
  auditRemarks: string;
}

export default function DisbursementPage() {
  const { data: workOrders = [], isLoading } = useWorkOrdersQuery();
  const approveClaimMutation = useApprovePaymentClaimMutation();

  const [activeTab, setActiveTab] = useState<"advance" | "final">("advance");
  const [selectedRow, setSelectedRow] = useState<DisbursementRow | null>(null);
  const [verifiedDocs, setVerifiedDocs] = useState(false);

  const { control, handleSubmit, reset } = useForm<DisbursementFormValues>({
    defaultValues: {
      neftReference: "",
      auditRemarks: "",
    },
  });

  // Flat list of all dispatches
  const allDispatches = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || []).map((d) => ({
        ...d,
        district: wo.district,
        block: wo.block,
        transporterName: wo.transporterName,
        allocatedTransporterId: wo.allocatedTransporterId,
      })),
    );
  }, [workOrders]);

  // Split claims by tab status
  const pendingAdvances = useMemo(() => {
    return allDispatches.filter(
      (d) => (d.billingStatus as string) === "Advance Claimed",
    );
  }, [allDispatches]);

  const pendingFinals = useMemo(() => {
    return allDispatches.filter(
      (d) => (d.billingStatus as string) === "Final Settlement Claimed",
    );
  }, [allDispatches]);

  // Billing calculation logic
  const getBidRates = (transporterId: number) => {
    if (transporterId === 3) return { cat1: 330, cat2: 480, cat3: 620 };
    if (transporterId === 1) return { cat1: 350, cat2: 500, cat3: 650 };
    return { cat1: 300, cat2: 450, cat3: 600 };
  };

  const calculateBill = (row: DisbursementRow) => {
    const weight = Number((row.bundlesLoaded * 0.04).toFixed(3));
    const rates = getBidRates(row.allocatedTransporterId || 3);

    let applicableRate = rates.cat1;
    if (weight >= 9.0) {
      applicableRate = rates.cat3;
    } else if (weight >= 4.5) {
      applicableRate = rates.cat2;
    }

    let grossFreight = weight * applicableRate;
    if (weight >= 4.5 && weight < 9.0) {
      const cat3Cap = 9.0 * rates.cat3;
      if (grossFreight > cat3Cap) grossFreight = cat3Cap;
    }

    const delayDays = row.deliveryDelayDays || 0;
    let delayPenalty = 0;
    if (delayDays > 0) {
      if (delayDays <= 4) {
        delayPenalty = grossFreight * 0.05 * delayDays;
      } else if (delayDays <= 9) {
        delayPenalty =
          grossFreight * 0.05 * 4 + grossFreight * 0.1 * (delayDays - 4);
      } else {
        delayPenalty =
          grossFreight * 1.0 + grossFreight * 0.05 * (delayDays - 12);
      }
    }

    let damagedBundles = 0;
    if (row.lrNumber === "LR-9014") damagedBundles = 2;

    const totalRecovery = damagedBundles * 15000;
    const tds = grossFreight > 250000 ? grossFreight * 0.02 : 0;
    const netPayable = Math.max(
      0,
      grossFreight - delayPenalty - totalRecovery - tds,
    );

    return {
      grossFreight: Math.round(grossFreight),
      delayPenalty: Math.round(delayPenalty),
      totalRecovery,
      tds: Math.round(tds),
      netPayable: Math.round(netPayable),
    };
  };

  const selectedDetails = useMemo(() => {
    if (!selectedRow) return null;
    const bill = calculateBill(selectedRow);

    // For advance claims, payment is 80% of net. For final settlement, it is remaining 20%
    const disbursementAmount =
      activeTab === "advance"
        ? Math.round(bill.netPayable * 0.8)
        : Math.round(bill.netPayable * 0.2);

    return {
      ...bill,
      disbursementAmount,
    };
  }, [selectedRow, activeTab]);

  const handleRowClick = (row: DisbursementRow) => {
    setSelectedRow(row);
    setVerifiedDocs(false);
    reset({ neftReference: "", auditRemarks: "" });
  };

  const onSubmit = async (data: DisbursementFormValues) => {
    if (!selectedRow) return;
    if (!verifiedDocs) {
      ToastService.error("Please verify the checkbook audit criteria first.");
      return;
    }
    if (!data.neftReference) {
      ToastService.error(
        "NEFT/RTGS Transaction Reference is required to disburse payment.",
      );
      return;
    }

    const claims = [
      {
        workOrderId: selectedRow.workOrderId,
        dispatchId: selectedRow.dispatchId,
      },
    ];
    const action = activeTab === "advance" ? "ApproveAdvance" : "ApproveFinal";

    try {
      await approveClaimMutation.mutateAsync({ claims, action });
      ToastService.success(
        `Payment of Rs. ${selectedDetails?.disbursementAmount.toLocaleString()} successfully disbursed for LR ${selectedRow.lrNumber}! Transaction Ref: ${data.neftReference}`,
      );
      setSelectedRow(null);
      setVerifiedDocs(false);
      reset();
    } catch {
      ToastService.error("Failed to approve and disburse payment.");
    }
  };

  return (
    <Page
      header="Payment Disbursement"
      subHeader="Process and track transporter payments and disbursements."
    >
      {/* Sub-tabbing */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => {
            setActiveTab("advance");
            setSelectedRow(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "advance"
              ? "border-[#008a45] text-[#008a45]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <DollarSign size={18} />
          Pending Advance Claims ({pendingAdvances.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("final");
            setSelectedRow(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "final"
              ? "border-[#008a45] text-[#008a45]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <CheckCircle size={18} />
          Pending Final Settlements ({pendingFinals.length})
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500 font-medium">
          Loading disbursement logs...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-5">
              <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                <FileText className="text-[#008a45]" size={20} />
                {activeTab === "advance"
                  ? "Running Bill Claims awaiting 80% Payout"
                  : "Season Settlements awaiting 20% Balance Release"}
              </span>

              <GridPanel
                data={activeTab === "advance" ? pendingAdvances : pendingFinals}
                searchFields={[
                  "lrNumber",
                  "truckNo",
                  "transporterName",
                  "district",
                  "block",
                ]}
                columns={[
                  {
                    header: "Vehicle Number",
                    field: "truckNo",
                    width: "140px",
                    cell: (row: DisbursementRow) => (
                      <span
                        onClick={() => handleRowClick(row)}
                        className="font-bold text-emerald-600 hover:underline cursor-pointer text-xs"
                      >
                        {row.truckNo}
                      </span>
                    ),
                  },
                  {
                    header: "Transporter Name",
                    field: "transporterName",
                    cell: (row: DisbursementRow) => (
                      <span
                        onClick={() => handleRowClick(row)}
                        className="font-semibold text-slate-700 cursor-pointer text-xs"
                      >
                        {row.transporterName}
                      </span>
                    ),
                  },
                  {
                    header: "Destination Block",
                    cell: (row: DisbursementRow) => (
                      <span className="text-slate-600 font-medium text-xs">
                        {row.block} ({row.district})
                      </span>
                    ),
                  },
                  {
                    header: "Cargo Weight",
                    cell: (row: DisbursementRow) => (
                      <span className="font-bold text-slate-800 text-xs">
                        {(row.bundlesLoaded * 0.04).toFixed(2)} T
                      </span>
                    ),
                  },
                  {
                    header:
                      activeTab === "advance"
                        ? "Advance (80%)"
                        : "Final Bal. (20%)",
                    cell: (row: DisbursementRow) => {
                      const bill = calculateBill(row);
                      const amt =
                        activeTab === "advance"
                          ? Math.round(bill.netPayable * 0.8)
                          : Math.round(bill.netPayable * 0.2);
                      return (
                        <span className="font-extrabold text-[#008a45]">
                          Rs. {amt.toLocaleString()}
                        </span>
                      );
                    },
                    align: "right",
                  },
                ]}
              />
            </Card>
          </div>

          {/* Audit side card */}
          <div className="lg:col-span-1">
            {selectedRow && selectedDetails ? (
              <Card className="p-5 border-l-[#008a45] border-l-4">
                <span className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-[#008a45]" />
                  Audit Panel: LR {selectedRow.lrNumber}
                </span>

                <div className="flex flex-col gap-3 font-sans text-xs mb-4">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Transporter:</span>
                    <span className="font-bold text-slate-800">
                      {selectedRow.transporterName}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">Gross Freight:</span>
                    <span className="font-semibold text-slate-800">
                      Rs. {selectedDetails.grossFreight.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">SLA Penalties:</span>
                    <span
                      className={`font-semibold ${selectedDetails.delayPenalty > 0 ? "text-rose-600" : "text-slate-800"}`}
                    >
                      Rs. {selectedDetails.delayPenalty.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500">GST-TDS (2%):</span>
                    <span className="font-semibold text-slate-800">
                      Rs. {selectedDetails.tds.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between p-2 bg-[#008a45]/10 rounded-lg text-[#008a45] items-center">
                    <span className="font-bold uppercase text-[10px]">
                      {activeTab === "advance"
                        ? "Advance Release (80%)"
                        : "Final Settlement (20%)"}
                    </span>
                    <span className="font-black text-sm">
                      Rs. {selectedDetails.disbursementAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Audit proof documents */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Audit Proof of Delivery Documentation
                  </span>

                  <div className="flex flex-col gap-2">
                    {/* Signed challan */}
                    <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-[#008a45]" />
                        <div className="flex flex-col">
                          <span className="font-bold text-[11px] text-slate-700">
                            signed_delivery_challan.pdf
                          </span>
                          <span className="text-[9px] text-slate-400">
                            PDF Document | 1.8 MB | Verified
                          </span>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          ToastService.success("Downloading challan file...");
                        }}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <Download size={14} />
                      </a>
                    </div>

                    {/* BRC signature */}
                    <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-[#008a45]" />
                        <div className="flex flex-col">
                          <span className="font-bold text-[11px] text-slate-700">
                            brc_officer_signature.jpg
                          </span>
                          <span className="text-[9px] text-slate-400">
                            JPEG Image | 420 KB | Verified
                          </span>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          ToastService.success("Downloading signature file...");
                        }}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-3"
                >
                  {/* Verification Checkbox */}
                  <div className="flex items-start gap-2 border-t pt-3">
                    <input
                      type="checkbox"
                      id="auditCheck"
                      checked={verifiedDocs}
                      onChange={(e) => setVerifiedDocs(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer mt-0.5"
                    />
                    <label
                      htmlFor="auditCheck"
                      className="text-[10px] text-slate-500 cursor-pointer leading-normal"
                    >
                      I have verified the signed delivery challan, Block stamp
                      validity, and confirmed the TDS and delay penalty
                      calculations.
                    </label>
                  </div>

                  {/* Transaction Ref Number */}
                  <TextBox
                    label="NEFT / RTGS Transaction Reference *"
                    name="neftReference"
                    required
                    control={control}
                    placeholder="Enter Bank Ref No (e.g. UTR12345)"
                  />

                  <TextBox
                    label="Auditor Remarks (Optional)"
                    name="auditRemarks"
                    control={control}
                    placeholder="Enter audit remarks"
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-2.5 mt-2.5">
                    <Button
                      type="button"
                      label="Hold Claim"
                      variant="outlined"
                      className="flex-1 !text-xs"
                      onClick={() => {
                        ToastService.warning(
                          `Claim for LR ${selectedRow.lrNumber} put on HOLD.`,
                        );
                        setSelectedRow(null);
                        setVerifiedDocs(false);
                      }}
                    />
                    <Button
                      type="submit"
                      label="Disburse Funds"
                      icon="send"
                      className="flex-1 !text-xs bg-[#008a45] border-[#008a45] hover:bg-[#007037]"
                      disabled={!verifiedDocs || approveClaimMutation.isPending}
                    />
                  </div>
                </form>
              </Card>
            ) : (
              <Card className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                <ShieldCheck size={36} className="text-slate-300 mb-2" />
                <span className="text-sm font-semibold">
                  Select a claim to review
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Audit panel for verifying documents and releasing UTR will
                  load here
                </span>
              </Card>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
