import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Loader } from "shared/components/progress";
import {
  useTendersL1Query,
  useBidsL1Query,
  useTransportersL1Query,
  useVehiclesL1Query,
} from "../queries";
import { CheckCircle2, Building, Truck } from "lucide-react";

export default function List() {
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(
    "TND-IND-001",
  );

  const { data: tenders = [], isLoading: loadingTenders } = useTendersL1Query();
  const { data: bids = [], isLoading: loadingBids } = useBidsL1Query();
  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersL1Query();
  const { data: vehicles = [], isLoading: loadingVehicles } =
    useVehiclesL1Query();

  // Selected tender
  const selectedTender = useMemo(() => {
    return (
      tenders.find((t) => t.tenderId === selectedTenderId) || tenders[0] || null
    );
  }, [tenders, selectedTenderId]);

  useMemo(() => {
    if (!selectedTenderId && tenders.length > 0) {
      setSelectedTenderId(tenders[0].tenderId);
    }
  }, [tenders, selectedTenderId]);

  // Ranked bids for selected tender (Technically Qualified Bidders Only)
  const rankedBids = useMemo(() => {
    if (!selectedTender) return [];

    const tenderBids = bids.filter(
      (b) => b.tenderId === selectedTender.tenderId && b.status === "Submitted",
    );

    const qualifiedBids = tenderBids.filter((bid) => {
      const transporter = transporters.find(
        (t) => t.transporterId === bid.transporterId,
      );
      return transporter?.technicalStatus === "Qualified";
    });

    const sorted = [...qualifiedBids].sort((a, b) => {
      if (a.rateCat3 !== b.rateCat3) return a.rateCat3 - b.rateCat3;
      if (a.rateCat2 !== b.rateCat2) return a.rateCat2 - b.rateCat2;
      if (a.rateCat1 !== b.rateCat1) return a.rateCat1 - b.rateCat1;

      const fleetSizeA = vehicles.filter(
        (v) => v.transporterId === a.transporterId && v.fitnessExpiry,
      ).length;
      const fleetSizeB = vehicles.filter(
        (v) => v.transporterId === b.transporterId && v.fitnessExpiry,
      ).length;
      return fleetSizeB - fleetSizeA;
    });

    const l1Cat3Rate = sorted[0]?.rateCat3 || 0;

    return sorted.map((bid, index) => {
      const diffAmount = bid.rateCat3 - l1Cat3Rate;
      const diffPercent =
        l1Cat3Rate > 0 ? ((diffAmount / l1Cat3Rate) * 100).toFixed(1) : "0.0";

      return {
        ...bid,
        rankIndex: index + 1,
        isL1: index === 0,
        diffAmount,
        diffPercent,
        emdVerified: true,
        emdAmount: 250000 - index * 50000,
      };
    });
  }, [selectedTender, bids, transporters, vehicles]);

  const getTransporterDetails = (id: number) => {
    return transporters.find((t) => t.transporterId === id);
  };

  const getQualifiedFleetCount = (id: number) => {
    return vehicles.filter((v) => v.transporterId === id).length;
  };

  if (loadingTenders || loadingBids || loadingTransporters || loadingVehicles) {
    return <Loader />;
  }

  return (
    <Page
      header="Bidder Selection & Rate Comparison"
      subHeader="Compare bidder rates and assign work orders based on district requirements."
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Panel: Districts */}
        <div className="w-full lg:w-72 shrink-0">
          <Card title="Districts">
            <div className="flex flex-col divide-y divide-slate-100 -mx-4 -my-2">
              {tenders.map((t) => {
                const isSelected = selectedTender?.tenderId === t.tenderId;

                return (
                  <button
                    key={t.tenderId}
                    type="button"
                    onClick={() => setSelectedTenderId(t.tenderId)}
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/80 border-r-4 border-emerald-600 font-bold text-emerald-900"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-sm font-semibold">{t.district}</span>
                    <span className="text-[10px] text-slate-400">
                      {t.tenderId}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Panel: Clean Comparative Table */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {selectedTender?.district} District Bids
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tender Ref: {selectedTender?.tenderId}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {rankedBids.length} Qualified Bidders
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wide select-none">
                    <th className="py-3 px-4 text-center w-16">Rank</th>
                    <th className="py-3 px-4">Bidder Name</th>
                    <th className="py-3 px-4">Rate (Cat 3 / 2 / 1)</th>
                    <th className="py-3 px-4 text-center">Diff from L1</th>
                    <th className="py-3 px-4 text-center">EMD Status</th>
                    <th className="py-3 px-4 text-right">Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {rankedBids.length > 0 ? (
                    rankedBids.map((bid) => {
                      const transporter = getTransporterDetails(
                        bid.transporterId,
                      );
                      const fleetCount = getQualifiedFleetCount(
                        bid.transporterId,
                      );

                      return (
                        <tr
                          key={bid.bidId}
                          className={`hover:bg-slate-50 transition ${
                            bid.isL1 ? "bg-emerald-50/20" : ""
                          }`}
                        >
                          {/* 1. Rank */}
                          <td className="py-3 px-4 text-center font-bold">
                            <div className="flex justify-center">
                              {bid.isL1 ? (
                                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs border border-emerald-300">
                                  L1
                                </span>
                              ) : (
                                <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                  L{bid.rankIndex}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 2. Bidder Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-slate-100 rounded-md text-slate-500 shrink-0">
                                <Building size={14} />
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 text-sm block">
                                  {transporter?.transporterName ||
                                    `Transporter #${bid.transporterId}`}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span>
                                    {transporter?.registrationNo || "TBC-T-001"}
                                  </span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                                    <Truck size={11} /> {fleetCount} Vehicles
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 3. Rates */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">
                                ₹{bid.rateCat3}{" "}
                                <span className="text-[10px] font-normal text-slate-400">
                                  / Ton (Cat-3)
                                </span>
                              </span>
                              <div className="text-[10px] text-slate-500">
                                Cat-2: ₹{bid.rateCat2} · Cat-1: ₹{bid.rateCat1}
                              </div>
                            </div>
                          </td>

                          {/* 4. Diff from L1 */}
                          <td className="py-3 px-4 text-center">
                            {bid.isL1 ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Lowest Base (0.0%)
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                +₹{bid.diffAmount} (+{bid.diffPercent}%)
                              </span>
                            )}
                          </td>

                          {/* 5. EMD Status */}
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                              <CheckCircle2 size={11} />
                              EMD Verified
                            </span>
                          </td>

                          {/* 6. Eligibility for Allocation */}
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                                bid.isL1
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {bid.isL1
                                ? "L1 (Eligible)"
                                : `L${bid.rankIndex} (Eligible)`}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-400 text-xs"
                      >
                        No qualified bidders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
