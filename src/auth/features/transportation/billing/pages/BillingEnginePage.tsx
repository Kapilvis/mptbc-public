import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import {
  useWorkOrdersQuery,
  useClaimAdvanceMutation,
  useClaimFinalSettlementMutation,
} from "../../work-order/queries";
import { Calculator, FileCheck, DollarSign, AlertCircle } from "lucide-react";

interface BillingDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
  allocatedTransporterId?: number;
}

export default function BillingEnginePage() {
  const { data: workOrders = [], isLoading } = useWorkOrdersQuery();
  const claimAdvanceMutation = useClaimAdvanceMutation();
  const claimFinalMutation = useClaimFinalSettlementMutation();

  const [activeTab, setActiveTab] = useState<"engine" | "running" | "final">(
    "engine",
  );
  const [selectedRow, setSelectedRow] = useState<BillingDispatch | null>(null);
  const [selectedRunningIds, setSelectedRunningIds] = useState<string[]>([]);

  // Bid rates lookup
  const getBidRates = (transporterId: number) => {
    if (transporterId === 3) return { cat1: 330, cat2: 480, cat3: 620 };
    if (transporterId === 1) return { cat1: 350, cat2: 500, cat3: 650 };
    return { cat1: 300, cat2: 450, cat3: 600 };
  };

  // Flattened dispatches list for delivered shipments
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

  const deliveredDispatches = useMemo(() => {
    return allDispatches.filter((d) => d.status === "Delivered");
  }, [allDispatches]);

  // Billing calculation logic
  const calculateBill = (row: BillingDispatch) => {
    const weight = Number((row.bundlesLoaded * 0.04).toFixed(3));
    const rates = getBidRates(row.allocatedTransporterId || 3);

    // Choose rate category
    let applicableRate = rates.cat1;
    let rateCat = "Category 1 (1 - 4.5T)";
    if (weight >= 9.0) {
      applicableRate = rates.cat3;
      rateCat = "Category 3 (>= 9T)";
    } else if (weight >= 4.5) {
      applicableRate = rates.cat2;
      rateCat = "Category 2 (4.5 - 9T)";
    }

    // Gross Freight calculation
    let grossFreight = weight * applicableRate;

    // Apply capping rules if any
    if (weight >= 4.5 && weight < 9.0) {
      // Capped at Cat-3 rate for 9T
      const cat3Cap = 9.0 * rates.cat3;
      if (grossFreight > cat3Cap) {
        grossFreight = cat3Cap;
      }
    }

    // Delay Penalty
    const delayDays = row.deliveryDelayDays || 0;
    let delayPenalty = 0;
    let penaltyFormula = "No Penalty";

    if (delayDays > 0) {
      if (delayDays <= 4) {
        delayPenalty = grossFreight * 0.05 * delayDays;
        penaltyFormula = `Slab 1 (5% per day): ${delayDays} days × 5%`;
      } else if (delayDays <= 9) {
        const slab1 = grossFreight * 0.05 * 4;
        const slab2 = grossFreight * 0.1 * (delayDays - 4);
        delayPenalty = slab1 + slab2;
        penaltyFormula = `Slab 2 (10% per day): 4 days × 5% + ${delayDays - 4} days × 10%`;
      } else {
        const flatPenalty = grossFreight * 1.0;
        const extraDays = Math.max(0, delayDays - 12);
        const extraPenalty = grossFreight * 0.05 * extraDays;
        delayPenalty = flatPenalty + extraPenalty;
        penaltyFormula = `Slab 3 Critical (Flat 100% + 5% from day 13): 100% + ${extraDays} days × 5%`;
      }
    }

    // Recoveries (Simulated lost/damaged counts for demo)
    const lostBundles = 0;
    let damagedBundles = 0;

    // Simulate lost/damaged for specific dispatches
    if (row.lrNumber === "LR-9014") {
      damagedBundles = 2; // Simulate 2 damaged bundles
    }

    const lostRecovery = lostBundles * 22500; // Rs. 15000 book value * 1.5
    const damagedRecovery = damagedBundles * 15000; // Rs. 15000 book value
    const totalRecovery = lostRecovery + damagedRecovery;

    // TDS Deduction
    const tempGross = grossFreight;
    const tds = tempGross > 250000 ? tempGross * 0.02 : 0;
    const tdsFormula =
      tempGross > 250000
        ? "2% GST-TDS applied (Gross > 2.5L)"
        : "No TDS (Gross <= 2.5L)";

    // Net Payable
    const netPayable = Math.max(
      0,
      grossFreight - delayPenalty - totalRecovery - tds,
    );

    return {
      weight,
      rateCat,
      applicableRate,
      grossFreight: Math.round(grossFreight),
      delayDays,
      delayPenalty: Math.round(delayPenalty),
      penaltyFormula,
      lostBundles,
      damagedBundles,
      lostRecovery,
      damagedRecovery,
      totalRecovery,
      tds: Math.round(tds),
      tdsFormula,
      netPayable: Math.round(netPayable),
    };
  };

  // Selection list for running claims (Pending bills)
  const unbilledDispatches = useMemo(() => {
    return deliveredDispatches.filter(
      (d) => !d.billingStatus || d.billingStatus === "Pending",
    );
  }, [deliveredDispatches]);

  // Aggregate selected claims
  const runningClaimsSummary = useMemo(() => {
    const selected = deliveredDispatches.filter((d) =>
      selectedRunningIds.includes(d.dispatchId),
    );
    let totalGross = 0;
    let totalNet = 0;

    selected.forEach((d) => {
      const calc = calculateBill(d);
      totalGross += calc.grossFreight;
      totalNet += calc.netPayable;
    });

    const maxAdvance = totalNet * 0.8;
    return {
      count: selected.length,
      totalGross,
      totalNet,
      maxAdvance: Math.round(maxAdvance),
    };
  }, [selectedRunningIds, deliveredDispatches]);

  // Final settlement claims (Advance Paid shipments)
  const advancePaidDispatches = useMemo(() => {
    return deliveredDispatches.filter(
      (d) => d.billingStatus === "Advance Paid",
    );
  }, [deliveredDispatches]);

  const finalSettlementSummary = useMemo(() => {
    let totalGross = 0;
    let totalPenalty = 0;
    let totalRecovery = 0;
    let totalTds = 0;
    let totalNet = 0;

    advancePaidDispatches.forEach((d) => {
      const calc = calculateBill(d);
      totalGross += calc.grossFreight;
      totalPenalty += calc.delayPenalty;
      totalRecovery += calc.totalRecovery;
      totalTds += calc.tds;
      totalNet += calc.netPayable;
    });

    // Advance already paid was 80% of net
    const advancePaid = totalNet * 0.8;
    const finalBalance = totalNet - advancePaid;

    return {
      count: advancePaidDispatches.length,
      totalGross,
      totalPenalty,
      totalRecovery,
      totalTds,
      totalNet,
      advancePaid: Math.round(advancePaid),
      finalBalance: Math.round(finalBalance),
    };
  }, [advancePaidDispatches]);

  const handleRowSelect = (row: BillingDispatch) => {
    setSelectedRow(row);
  };

  // Submit running bill claim (Page 12)
  const handleClaimRunningBill = async () => {
    if (selectedRunningIds.length === 0) {
      ToastService.error("Please select at least one dispatch log to claim.");
      return;
    }
    const claims = unbilledDispatches
      .filter((d) => selectedRunningIds.includes(d.dispatchId))
      .map((d) => ({ workOrderId: d.workOrderId, dispatchId: d.dispatchId }));

    try {
      await claimRunningBillAdvanceMutation.mutateAsync(claims);
      ToastService.success(
        `Successfully submitted Running Bill Claim for ${selectedRunningIds.length} dispatches!`,
      );
      setSelectedRunningIds([]);
    } catch {
      ToastService.error("Failed to submit Running Bill claim.");
    }
  };

  // Submit final settlement claim (Page 13)
  const handleClaimFinalSettlement = async () => {
    if (advancePaidDispatches.length === 0) {
      ToastService.error(
        "No advance-paid dispatches available for final settlement.",
      );
      return;
    }
    const claims = advancePaidDispatches.map((d) => ({
      workOrderId: d.workOrderId,
      dispatchId: d.dispatchId,
    }));

    try {
      await claimFinalSettlementMutation.mutateAsync(claims);
      ToastService.success(
        `Successfully submitted Final Settlement for ${claims.length} routes! Pending Account clearance.`,
      );
    } catch {
      ToastService.error("Failed to submit Final Settlement.");
    }
  };

  const claimRunningBillAdvanceMutation = {
    mutateAsync: async (
      claims: { workOrderId: string; dispatchId: string }[],
    ) => {
      await claimAdvanceMutation.mutateAsync(claims);
    },
    isPending: claimAdvanceMutation.isPending,
  };

  const claimFinalSettlementMutation = {
    mutateAsync: async (
      claims: { workOrderId: string; dispatchId: string }[],
    ) => {
      await claimFinalMutation.mutateAsync(claims);
    },
    isPending: claimFinalMutation.isPending,
  };

  return (
    <Page
      header="Billing Engine"
      subHeader="Review transport bills, advance payments, and final claims."
    >
      {/* Dynamic Tab Navigation */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => {
            setActiveTab("engine");
            setSelectedRow(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "engine"
              ? "border-[#008a45] text-[#008a45]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Calculator size={18} />
          Auto Billing Engine
        </button>
        <button
          onClick={() => {
            setActiveTab("running");
            setSelectedRow(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "running"
              ? "border-[#008a45] text-[#008a45]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <DollarSign size={18} />
          Running Bill Advance
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
          <FileCheck size={18} />
          Final Settlement
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500 font-medium">
          Loading billing data and active dispatches...
        </div>
      ) : (
        <>
          {/* TAB 1: AUTO BILLING ENGINE */}
          {activeTab === "engine" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-5">
                  <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                    <Calculator className="text-[#008a45]" size={20} />
                    Delivered Shipments (Select a row to calculate)
                  </span>
                  <GridPanel
                    data={deliveredDispatches}
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
                        cell: (row: BillingDispatch) => (
                          <span
                            onClick={() => handleRowSelect(row)}
                            className="font-bold text-emerald-600 hover:underline cursor-pointer text-xs"
                          >
                            {row.truckNo}
                          </span>
                        ),
                      },
                      {
                        header: "Destination Block",
                        cell: (row: BillingDispatch) => (
                          <span
                            onClick={() => handleRowSelect(row)}
                            className="font-semibold text-slate-700 cursor-pointer"
                          >
                            {row.block} ({row.district})
                          </span>
                        ),
                      },
                      {
                        header: "Transporter & Vehicle",
                        field: "transporterName",
                        cell: (row: BillingDispatch) => (
                          <span className="text-slate-600 font-medium text-xs">
                            {row.transporterName} | {row.truckNo}
                          </span>
                        ),
                      },
                      {
                        header: "Load Weight",
                        cell: (row: BillingDispatch) => (
                          <span className="font-bold text-slate-800">
                            {(row.bundlesLoaded * 0.04).toFixed(2)} Metric Ton
                          </span>
                        ),
                        align: "center",
                      },
                      {
                        header: "Delay Days",
                        field: "deliveryDelayDays",
                        align: "center",
                        width: "100px",
                        cell: (row: BillingDispatch) => {
                          const delay = row.deliveryDelayDays || 0;
                          return (
                            <span
                              className={`font-bold ${delay > 0 ? "text-rose-600" : "text-emerald-600"}`}
                            >
                              {delay > 0 ? `${delay} Days` : "On Time"}
                            </span>
                          );
                        },
                      },
                      {
                        header: "Billing Status",
                        field: "billingStatus",
                        width: "140px",
                        align: "center",
                        cell: (row: BillingDispatch) => {
                          const status: string = row.billingStatus || "Pending";
                          return (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                status === "Settled"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : status === "Advance Paid"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : status === "Advance Claimed" ||
                                        status === "Final Settlement Claimed"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              {status === "Pending" ? "Unbilled" : status}
                            </span>
                          );
                        },
                      },
                    ]}
                  />
                </Card>
              </div>

              {/* Calculation side-card */}
              <div className="lg:col-span-1">
                {selectedRow ? (
                  <Card className="p-5 border-l-[#008a45] border-l-4">
                    <span className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                      <Calculator size={18} className="text-[#008a45]" />
                      Billing Calculations: Receipt #${selectedRow.lrNumber}
                    </span>

                    {/* Math breakdown */}
                    {(() => {
                      const calc = calculateBill(selectedRow);
                      return (
                        <div className="flex flex-col gap-4 mt-4 font-sans text-xs">
                          {/* Weight & Rate */}
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500 font-medium">
                              Dispatched Volume:
                            </span>
                            <span className="font-bold text-slate-800">
                              {selectedRow.bundlesLoaded} Bundles ({calc.weight}{" "}
                              Metric Ton)
                            </span>
                          </div>

                          <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500 font-medium">
                              Selected Rate Category:
                            </span>
                            <span className="font-bold text-slate-800">
                              {calc.rateCat}
                            </span>
                          </div>

                          <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500 font-medium">
                              Bid Rate Quote:
                            </span>
                            <span className="font-bold text-indigo-600">
                              Rs. {calc.applicableRate} / Metric Ton
                            </span>
                          </div>

                          <div className="flex justify-between border-b pb-2 bg-indigo-50/50 p-2 rounded-lg">
                            <span className="text-indigo-800 font-bold">
                              Gross Freight:
                            </span>
                            <span className="font-extrabold text-indigo-900 text-sm">
                              Rs. {calc.grossFreight.toLocaleString()}
                            </span>
                          </div>

                          {/* Delay Penalty */}
                          <div className="flex flex-col gap-1 border-b pb-2">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">
                                SLA Delay Penalty:
                              </span>
                              <span
                                className={`font-bold ${calc.delayDays > 0 ? "text-rose-600" : "text-emerald-600"}`}
                              >
                                - Rs. {calc.delayPenalty.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Formula: {calc.penaltyFormula}
                            </span>
                          </div>

                          {/* Recoveries */}
                          <div className="flex flex-col gap-1 border-b pb-2">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">
                                Lost & Damage Penalties:
                              </span>
                              <span
                                className={`font-bold ${calc.totalRecovery > 0 ? "text-rose-600" : "text-emerald-600"}`}
                              >
                                - Rs. {calc.totalRecovery.toLocaleString()}
                              </span>
                            </div>
                            {calc.damagedBundles > 0 && (
                              <span className="text-[10px] text-rose-500 font-medium">
                                Deductions: {calc.damagedBundles} damaged
                                bundles (Rs. {calc.damagedRecovery})
                              </span>
                            )}
                          </div>

                          {/* TDS */}
                          <div className="flex flex-col gap-1 border-b pb-2">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">
                                GST-TDS (2%):
                              </span>
                              <span
                                className={`font-bold ${calc.tds > 0 ? "text-slate-700" : "text-slate-400"}`}
                              >
                                - Rs. {calc.tds.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Rule: {calc.tdsFormula}
                            </span>
                          </div>

                          {/* Final Net */}
                          <div className="flex justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 mt-2">
                            <div className="flex flex-col">
                              <span className="text-emerald-800 font-extrabold text-sm uppercase">
                                Net Payable
                              </span>
                              <span className="text-[10px] text-emerald-600 font-medium">
                                All deductions applied
                              </span>
                            </div>
                            <span className="text-emerald-800 font-black text-xl">
                              Rs. {calc.netPayable.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </Card>
                ) : (
                  <Card className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                    <Calculator size={36} className="text-slate-300 mb-2" />
                    <span className="text-sm font-semibold">
                      Select a shipment to preview calculations
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Detailed arithmetic calculations will load here
                    </span>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RUNNING BILLS ADVANCE */}
          {activeTab === "running" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-5">
                  <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                    <DollarSign className="text-blue-600" size={20} />
                    Unbilled Shipments (Claim 80% Advance Payment)
                  </span>
                  <GridPanel
                    data={unbilledDispatches}
                    searchFields={[
                      "lrNumber",
                      "truckNo",
                      "transporterName",
                      "district",
                      "block",
                    ]}
                    columns={[
                      {
                        header: "Select",
                        width: "60px",
                        align: "center",
                        cell: (row: BillingDispatch) => (
                          <input
                            type="checkbox"
                            checked={selectedRunningIds.includes(
                              row.dispatchId,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRunningIds((prev) => [
                                  ...prev,
                                  row.dispatchId,
                                ]);
                              } else {
                                setSelectedRunningIds((prev) =>
                                  prev.filter((id) => id !== row.dispatchId),
                                );
                              }
                            }}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                        ),
                      },
                      {
                        header: "Vehicle Number",
                        field: "truckNo",
                        width: "140px",
                        cell: (row: BillingDispatch) => (
                          <span className="font-bold text-slate-800">
                            {row.truckNo}
                          </span>
                        ),
                      },
                      {
                        header: "Destination Block",
                        cell: (row: BillingDispatch) => (
                          <span className="font-semibold text-slate-700">
                            {row.block} ({row.district})
                          </span>
                        ),
                      },
                      {
                        header: "Weight (Metric Ton)",
                        cell: (row: BillingDispatch) => (
                          <span className="font-bold text-slate-700">
                            {(row.bundlesLoaded * 0.04).toFixed(2)} MT
                          </span>
                        ),
                        align: "center",
                      },
                      {
                        header: "Estimated Net",
                        cell: (row: BillingDispatch) => {
                          const calc = calculateBill(row);
                          return (
                            <span className="font-bold text-indigo-600">
                              Rs. {calc.netPayable.toLocaleString()}
                            </span>
                          );
                        },
                        align: "center",
                      },
                    ]}
                  />
                </Card>
              </div>

              {/* Running Bill Submission Side Panel */}
              <div className="lg:col-span-1">
                <Card className="p-5 bg-blue-50/30 border border-blue-100">
                  <span className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                    <DollarSign size={18} className="text-blue-600" />
                    Running Claim Summary
                  </span>

                  <div className="flex flex-col gap-4 mt-4 text-xs font-sans">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">
                        Selected Shipments:
                      </span>
                      <span className="font-bold text-slate-800">
                        {runningClaimsSummary.count} Routes
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">
                        Total Selected Net Value:
                      </span>
                      <span className="font-bold text-slate-800">
                        Rs. {runningClaimsSummary.totalNet.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-blue-100/50 p-3 rounded-xl border border-blue-200 flex justify-between items-center mt-2">
                      <div className="flex flex-col">
                        <span className="text-blue-800 font-extrabold text-xs uppercase">
                          80% Advance Claim
                        </span>
                        <span className="text-[10px] text-blue-600 font-medium">
                          Approved limit for seasonal run
                        </span>
                      </div>
                      <span className="text-blue-800 font-black text-lg">
                        Rs. {runningClaimsSummary.maxAdvance.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-500 text-[10px] leading-relaxed mt-2">
                      <AlertCircle
                        className="shrink-0 text-slate-400 mt-0.5"
                        size={14}
                      />
                      <span>
                        Note: Once submitted, the billing status transitions to{" "}
                        <strong>Advance Claimed</strong>. Accounts will disburse
                        the advance via NEFT, releasing the remaining 20% during
                        the final season-end settlement.
                      </span>
                    </div>

                    <Button
                      type="button"
                      label="Submit 80% Advance Claim"
                      icon="check"
                      className="w-full mt-4 bg-blue-600 border-blue-600 hover:bg-blue-700 text-white"
                      disabled={
                        runningClaimsSummary.count === 0 ||
                        claimRunningBillAdvanceMutation.isPending
                      }
                      onClick={handleClaimRunningBill}
                    />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 3: FINAL SETTLEMENT */}
          {activeTab === "final" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-5">
                  <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                    <FileCheck className="text-indigo-600" size={20} />
                    Advance-Paid Shipments (Awaiting Final Settlement)
                  </span>
                  <GridPanel
                    data={advancePaidDispatches}
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
                        cell: (row: BillingDispatch) => (
                          <span className="font-bold text-slate-800">
                            {row.truckNo}
                          </span>
                        ),
                      },
                      {
                        header: "Destination Block",
                        cell: (row: BillingDispatch) => (
                          <span className="font-semibold text-slate-700">
                            {row.block} ({row.district})
                          </span>
                        ),
                      },
                      {
                        header: "Gross Freight",
                        cell: (row: BillingDispatch) => {
                          const calc = calculateBill(row);
                          return (
                            <span className="font-bold text-slate-800">
                              Rs. {calc.grossFreight.toLocaleString()}
                            </span>
                          );
                        },
                        align: "center",
                      },
                      {
                        header: "Penalties / Deductions",
                        cell: (row: BillingDispatch) => {
                          const calc = calculateBill(row);
                          return (
                            <span className="font-bold text-rose-600">
                              - Rs.{" "}
                              {(
                                calc.delayPenalty + calc.totalRecovery
                              ).toLocaleString()}
                            </span>
                          );
                        },
                        align: "center",
                      },
                      {
                        header: "Running Advance Paid (80%)",
                        cell: (row: BillingDispatch) => {
                          const calc = calculateBill(row);
                          const adv = Math.round(calc.netPayable * 0.8);
                          return (
                            <span className="font-bold text-blue-600">
                              Rs. {adv.toLocaleString()}
                            </span>
                          );
                        },
                        align: "center",
                      },
                      {
                        header: "Final Bal. (20%)",
                        cell: (row: BillingDispatch) => {
                          const calc = calculateBill(row);
                          const bal = Math.round(calc.netPayable * 0.2);
                          return (
                            <span className="font-bold text-emerald-600">
                              Rs. {bal.toLocaleString()}
                            </span>
                          );
                        },
                        align: "center",
                      },
                    ]}
                  />
                </Card>
              </div>

              {/* Season Final Settlement Card */}
              <div className="lg:col-span-1">
                <Card className="p-5 border-l-indigo-600 border-l-4">
                  <span className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                    <FileCheck size={18} className="text-indigo-600" />
                    Season Settlement Summary
                  </span>

                  <div className="flex flex-col gap-3.5 mt-4 text-xs font-sans">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">Delivered Routes:</span>
                      <span className="font-bold text-slate-800">
                        {finalSettlementSummary.count} Routes
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">
                        Total Gross Freight:
                      </span>
                      <span className="font-bold text-slate-800">
                        Rs. {finalSettlementSummary.totalGross.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">
                        Total Delay Penalties:
                      </span>
                      <span className="font-bold text-rose-600">
                        - Rs.{" "}
                        {finalSettlementSummary.totalPenalty.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">
                        Total Book Recoveries:
                      </span>
                      <span className="font-bold text-rose-600">
                        - Rs.{" "}
                        {finalSettlementSummary.totalRecovery.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">
                        Total GST-TDS (2%):
                      </span>
                      <span className="font-bold text-slate-800">
                        - Rs. {finalSettlementSummary.totalTds.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-2 text-blue-600">
                      <span>Total Running Advance Paid (80%):</span>
                      <span className="font-bold">
                        - Rs.{" "}
                        {finalSettlementSummary.advancePaid.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between items-center mt-2">
                      <div className="flex flex-col">
                        <span className="text-emerald-800 font-extrabold text-xs uppercase">
                          Net Final Balance
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          To be released by accounts
                        </span>
                      </div>
                      <span className="text-emerald-800 font-black text-lg">
                        Rs.{" "}
                        {finalSettlementSummary.finalBalance.toLocaleString()}
                      </span>
                    </div>

                    <Button
                      type="button"
                      label="Submit for Final Settlement"
                      icon="check-double"
                      className="w-full mt-4 bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white font-bold"
                      disabled={
                        finalSettlementSummary.count === 0 ||
                        claimFinalMutation.isPending
                      }
                      onClick={handleClaimFinalSettlement}
                    />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </Page>
  );
}
