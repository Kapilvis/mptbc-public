import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Loader } from "shared/components/progress";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { ToastService } from "services";
import {
  useTendersL1Query,
  useBidsL1Query,
  useTransportersL1Query,
  useVehiclesL1Query,
  useAuthorizePrimeBidderMutation,
} from "../queries";
import { Trophy, Lock, CheckCircle2 } from "lucide-react";

export default function List() {
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const { confirmAction } = useConfirmDialog();

  const { data: tenders = [], isLoading: loadingTenders } = useTendersL1Query();
  const { data: bids = [], isLoading: loadingBids } = useBidsL1Query();
  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersL1Query();
  const { data: vehicles = [], isLoading: loadingVehicles } =
    useVehiclesL1Query();

  const authorizeMutation = useAuthorizePrimeBidderMutation();

  const selectedTender = useMemo(() => {
    return tenders.find((t) => t.tenderId === selectedTenderId);
  }, [tenders, selectedTenderId]);

  // Ranked bids for selected tender
  const rankedBids = useMemo(() => {
    if (!selectedTenderId) return [];

    // 1. Get all submitted bids for selected tender
    const tenderBids = bids.filter(
      (b) => b.tenderId === selectedTenderId && b.status === "Submitted",
    );

    // 2. Filter to include only bids from technically qualified transporters
    const qualifiedBids = tenderBids.filter((bid) => {
      const transporter = transporters.find(
        (t) => t.transporterId === bid.transporterId,
      );
      return transporter?.technicalStatus === "Qualified";
    });

    // 3. Sort bids with tie-breaker logic
    return [...qualifiedBids].sort((a, b) => {
      // Rule 1: Compare Rate-1 (Cat-3 rate >=9 Ton) - Ascending (lowest is best)
      if (a.rateCat3 !== b.rateCat3) {
        return a.rateCat3 - b.rateCat3;
      }

      // Rule 2 (Tie Breaker 1): Compare Rate-2 (Cat-2 rate 4.5-9 Ton) - Ascending
      if (a.rateCat2 !== b.rateCat2) {
        return a.rateCat2 - b.rateCat2;
      }

      // Rule 3 (Tie Breaker 2): Compare Rate-3 (Cat-1 rate 1-4.5 Ton) - Ascending
      if (a.rateCat1 !== b.rateCat1) {
        return a.rateCat1 - b.rateCat1;
      }

      // Rule 4 (Tie Breaker 3): Compare fleet size - Descending (larger fleet wins tie)
      const fleetSizeA = vehicles.filter(
        (v) => v.transporterId === a.transporterId,
      ).length;
      const fleetSizeB = vehicles.filter(
        (v) => v.transporterId === b.transporterId,
      ).length;

      return fleetSizeB - fleetSizeA;
    });
  }, [selectedTenderId, bids, transporters, vehicles]);

  const handleAuthorize = (transporterId: number, transporterName: string) => {
    if (!selectedTenderId) return;

    confirmAction({
      header: "Authorize Prime Bidder",
      message: `Are you sure you want to permanently authorize "${transporterName}" as the Prime L1 Bidder for the "${selectedTender?.district}" district? This action will LOCK the district allocation permanently.`,
      icon: "lock",
      acceptLabel: "Authorize & Lock",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          await authorizeMutation.mutateAsync({
            tenderId: selectedTenderId,
            transporterId,
          });
          ToastService.success(
            `"${transporterName}" has been authorized as the Prime Bidder successfully!`,
          );
        } catch {
          ToastService.error("Failed to authorize prime bidder.");
        }
      },
    });
  };

  const getTransporterName = (id: number) => {
    return (
      transporters.find((t) => t.transporterId === id)?.transporterName ||
      `Transporter #${id}`
    );
  };

  const getFleetSize = (id: number) => {
    return vehicles.filter((v) => v.transporterId === id).length;
  };

  if (loadingTenders || loadingBids || loadingTransporters || loadingVehicles) {
    return <Loader />;
  }

  return (
    <Page
      header="L1 / Prime Bidder Selection"
      subHeader="Identify and authorize the lowest bidder (L1) for textbook distribution zones. Tie-breakers are resolved automatically based on Category-2, Category-1 rates, and fleet sizes."
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Panel: Tenders/Districts Menu */}
        <div className="w-full lg:w-80 shrink-0">
          <Card title="Distribution Districts">
            <div className="flex flex-col divide-y divide-slate-100 -mx-4 -my-2">
              {tenders.map((t) => {
                const isSelected = selectedTenderId === t.tenderId;
                const isAllocated = !!t.allocatedTransporterId;

                return (
                  <button
                    key={t.tenderId}
                    type="button"
                    onClick={() => setSelectedTenderId(t.tenderId)}
                    className={`w-full text-left px-5 py-4 transition-colors flex flex-col gap-1 ${
                      isSelected
                        ? "bg-slate-50 border-r-4 border-emerald-600"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-slate-800 text-sm">
                        {t.district}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isAllocated
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {isAllocated ? "Authorized" : "Pending"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ID: {t.tenderId}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Panel: Bid Details & Ranking */}
        <div className="flex-1 w-full">
          {!selectedTenderId ? (
            <Card>
              <div className="py-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2">
                <Lock size={36} className="text-slate-300 stroke-[1.5]" />
                <p>
                  Please select a district from the left panel to evaluate bid
                  rankings.
                </p>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Selected Tender Info Header */}
              <Card>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {selectedTender?.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      District:{" "}
                      <strong className="text-slate-600">
                        {selectedTender?.district}
                      </strong>{" "}
                      | Opening Date:{" "}
                      <strong className="text-slate-600">
                        {selectedTender?.openingDate}
                      </strong>
                    </p>
                  </div>
                  {selectedTender?.allocatedTransporterId && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5">
                      <CheckCircle2
                        className="text-emerald-600 shrink-0"
                        size={20}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wide">
                          ALLOCATION COMPLETED
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          Authorized Prime Bidder:{" "}
                          {getTransporterName(
                            selectedTender.allocatedTransporterId,
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Already Allocated Warning Banner */}
              {selectedTender?.allocatedTransporterId && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3.5">
                  <Lock size={20} className="text-slate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Allocation is Locked
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      This district tender has already been authorized. All
                      rates, rankings, and allocations are permanently frozen.
                      No modifications are permitted.
                    </p>
                  </div>
                </div>
              )}

              {/* Rankings Table */}
              <Card title={`Bid Rankings & Pricing (Category 3 rate L1 sort)`}>
                <div className="overflow-x-auto -mx-4 -my-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-5 py-3.5 text-center w-16">Rank</th>
                        <th className="px-5 py-3.5">Transporter Name</th>
                        <th className="px-5 py-3.5">Rate-1 (Cat-3)</th>
                        <th className="px-5 py-3.5">Rate-2 (Cat-2)</th>
                        <th className="px-5 py-3.5">Rate-3 (Cat-1)</th>
                        <th className="px-5 py-3.5 text-center w-24">
                          Fleet Size
                        </th>
                        {!selectedTender?.allocatedTransporterId && (
                          <th className="px-5 py-3.5 text-center w-40">
                            Action
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {rankedBids.length > 0 ? (
                        rankedBids.map((bid, index) => {
                          const isL1 = index === 0;
                          const isAuthorized =
                            selectedTender?.allocatedTransporterId ===
                            bid.transporterId;

                          return (
                            <tr
                              key={bid.bidId}
                              className={`hover:bg-slate-50/30 transition-colors ${
                                isL1 && !selectedTender?.allocatedTransporterId
                                  ? "bg-rose-50/30"
                                  : isAuthorized
                                    ? "bg-emerald-50/30"
                                    : ""
                              }`}
                            >
                              <td className="px-5 py-4 text-center">
                                <div className="flex justify-center">
                                  {isL1 ? (
                                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shadow-sm">
                                      L1
                                    </span>
                                  ) : (
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-800 text-sm">
                                    {getTransporterName(bid.transporterId)}
                                  </span>
                                  {isL1 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                                      <Trophy
                                        size={11}
                                        className="fill-rose-100"
                                      />
                                      Recommended Prime Bidder
                                    </span>
                                  )}
                                  {isAuthorized && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                      <CheckCircle2
                                        size={11}
                                        className="fill-emerald-100"
                                      />
                                      Authorized Prime Bidder
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4 font-semibold text-slate-900">
                                ₹{bid.rateCat3} / Ton
                              </td>
                              <td className="px-5 py-4 text-slate-600">
                                ₹{bid.rateCat2} / Ton
                              </td>
                              <td className="px-5 py-4 text-slate-600">
                                ₹{bid.rateCat1} / Ton
                              </td>
                              <td className="px-5 py-4 text-center font-semibold text-slate-800">
                                {getFleetSize(bid.transporterId)} Vehicles
                              </td>
                              {!selectedTender?.allocatedTransporterId && (
                                <td className="px-5 py-4 text-center">
                                  <Button
                                    label={
                                      isL1 ? "Authorize Prime" : "Authorize"
                                    }
                                    icon={isL1 ? "star" : "check"}
                                    onClick={() =>
                                      handleAuthorize(
                                        bid.transporterId,
                                        getTransporterName(bid.transporterId),
                                      )
                                    }
                                    variant={isL1 ? "primary" : "outlined"}
                                    disabled={authorizeMutation.isPending}
                                  />
                                </td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={
                              selectedTender?.allocatedTransporterId ? 6 : 7
                            }
                            className="px-5 py-12 text-center text-slate-400 font-medium"
                          >
                            No qualified commercial bids submitted for this
                            tender yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog />
    </Page>
  );
}
