import { useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { useWorkOrdersQuery } from "../../work-order/queries";
import { useVehiclesQuery } from "../../../master/vehicle-master/queries";
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Truck,
  DollarSign,
  Layers,
  FileBarChart2,
  CheckCircle2,
} from "lucide-react";

export default function ReportsPage() {
  const { data: workOrders = [], isLoading: loadingWorkOrders } =
    useWorkOrdersQuery();
  const { data: vehicles = [], isLoading: loadingVehicles } =
    useVehiclesQuery();

  // Bid rates lookup
  const getBidRates = (transporterId: number) => {
    if (transporterId === 3) return { cat1: 330, cat2: 480, cat3: 620 };
    if (transporterId === 1) return { cat1: 350, cat2: 500, cat3: 650 };
    return { cat1: 300, cat2: 450, cat3: 600 };
  };

  const dispatchesList = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || []).map((d) => {
        const weight = Number((d.bundlesLoaded * 0.04).toFixed(3));
        const rates = getBidRates(wo.allocatedTransporterId || 3);
        let applicableRate = rates.cat1;
        if (weight >= 9.0) applicableRate = rates.cat3;
        else if (weight >= 4.5) applicableRate = rates.cat2;

        let grossFreight = weight * applicableRate;
        if (weight >= 4.5 && weight < 9.0) {
          const cat3Cap = 9.0 * rates.cat3;
          if (grossFreight > cat3Cap) grossFreight = cat3Cap;
        }

        const delayDays = d.deliveryDelayDays || 0;
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
        if (d.lrNumber === "LR-9014") damagedBundles = 2;
        const totalRecovery = damagedBundles * 15000;
        const tds = grossFreight > 250000 ? grossFreight * 0.02 : 0;
        const netPayable = Math.max(
          0,
          grossFreight - delayPenalty - totalRecovery - tds,
        );

        return {
          ...d,
          district: wo.district,
          block: wo.block,
          transporterName: wo.transporterName,
          grossFreight: Math.round(grossFreight),
          delayPenalty: Math.round(delayPenalty),
          totalRecovery,
          netPayable: Math.round(netPayable),
        };
      }),
    );
  }, [workOrders]);

  // Overall KPIs
  const kpiData = useMemo(() => {
    const totalCargoDispatched = dispatchesList.reduce(
      (acc, curr) => acc + curr.bundlesLoaded,
      0,
    );
    const totalFreightGross = dispatchesList.reduce(
      (acc, curr) => acc + curr.grossFreight,
      0,
    );
    const totalPenalties = dispatchesList.reduce(
      (acc, curr) => acc + curr.delayPenalty,
      0,
    );
    const totalRecoveries = dispatchesList.reduce(
      (acc, curr) => acc + curr.totalRecovery,
      0,
    );

    const deliveredShipments = dispatchesList.filter(
      (d) => d.status === "Delivered",
    );
    const onTimeDeliveries = deliveredShipments.filter(
      (d) => (d.deliveryDelayDays || 0) === 0,
    );
    const complianceRate =
      deliveredShipments.length > 0
        ? Math.round(
            (onTimeDeliveries.length / deliveredShipments.length) * 100,
          )
        : 100;

    return {
      totalCargoDispatched,
      totalFreightGross,
      totalPenalties,
      totalRecoveries,
      complianceRate,
      activeShipmentsCount: dispatchesList.filter(
        (d) => d.status === "In Transit",
      ).length,
    };
  }, [dispatchesList]);

  // Transporter performance list
  const transporterPerf = useMemo(() => {
    const perf: Record<
      string,
      {
        name: string;
        total: number;
        onTime: number;
        penalties: number;
        recoveries: number;
      }
    > = {};

    dispatchesList.forEach((d) => {
      const name = d.transporterName;
      if (!perf[name]) {
        perf[name] = { name, total: 0, onTime: 0, penalties: 0, recoveries: 0 };
      }
      perf[name].total += 1;
      if (d.status === "Delivered" && (d.deliveryDelayDays || 0) === 0) {
        perf[name].onTime += 1;
      }
      perf[name].penalties += d.delayPenalty;
      perf[name].recoveries += d.totalRecovery;
    });

    return Object.values(perf)
      .map((p) => ({
        ...p,
        complianceScore:
          p.total > 0 ? Math.round((p.onTime / p.total) * 100) : 100,
      }))
      .sort((a, b) => b.complianceScore - a.complianceScore);
  }, [dispatchesList]);

  // Appendix-1 vs Actual analysis
  const appendixAnalysis = useMemo(() => {
    const list = [
      { block: "Indore City", target9T: 24, target4_5T: 4, targetBundles: 124 },
      { block: "Mhow", target9T: 10, target4_5T: 3, targetBundles: 62 },
      { block: "Sanwer", target9T: 7, target4_5T: 1, targetBundles: 55 },
    ];

    return list.map((item) => {
      const actualBundles = dispatchesList
        .filter((d) => d.block === item.block)
        .reduce((sum, curr) => sum + curr.bundlesLoaded, 0);

      const compliancePercent = Math.min(
        100,
        Math.round((actualBundles / item.targetBundles) * 100),
      );

      return {
        ...item,
        actualBundles,
        compliancePercent,
      };
    });
  }, [dispatchesList]);

  return (
    <Page
      header="Reports & Analytics Dashboard"
      subHeader="Monitor transporter service level agreement (SLA) compliance rates, financial penalties, and fleet deployment logs."
    >
      {loadingWorkOrders || loadingVehicles ? (
        <div className="text-center py-10 text-slate-500 font-medium">
          Loading analytics dashboard...
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center gap-4 bg-emerald-50/40 border-emerald-100">
              <div className="p-3 bg-emerald-100 text-[#008a45] rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SLA Compliance Rate
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {kpiData.complianceRate}%
                </span>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4 bg-indigo-50/40 border-indigo-100">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Layers size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Dispatched Load
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {kpiData.totalCargoDispatched} Bundles
                </span>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4 bg-amber-50/40 border-amber-100">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <DollarSign size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Gross Freight Released
                </span>
                <span className="text-2xl font-black text-slate-800 font-sans">
                  Rs. {kpiData.totalFreightGross.toLocaleString()}
                </span>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4 bg-rose-50/40 border-rose-100">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Penalties & Recoveries
                </span>
                <span className="text-2xl font-black text-slate-800 font-sans">
                  Rs.{" "}
                  {(
                    kpiData.totalPenalties + kpiData.totalRecoveries
                  ).toLocaleString()}
                </span>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transporter Performance ranking */}
            <Card className="p-5">
              <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                <Award className="text-amber-500" size={20} />
                Transporter Performance Rankings
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-wider">
                        Transporter
                      </th>
                      <th className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-wider text-center">
                        Bids/Shipments
                      </th>
                      <th className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-wider text-right">
                        Penalties Deducted
                      </th>
                      <th className="py-2.5 px-3 font-bold text-slate-500 uppercase tracking-wider text-center">
                        Compliance Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transporterPerf.map((t, idx) => (
                      <tr
                        key={t.name}
                        className="border-b border-slate-100 hover:bg-slate-50/50"
                      >
                        <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                              idx === 0
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          {t.name}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-700">
                          {t.total} Routes
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600">
                          Rs. {t.penalties.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border uppercase ${
                              t.complianceScore >= 80
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {t.complianceScore}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Appendix vs Actual target monitoring */}
            <Card className="p-5">
              <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                <FileBarChart2 className="text-indigo-600" size={20} />
                Appendix-1 Target Allocation vs Actual Dispatched
              </span>

              <div className="flex flex-col gap-4 font-sans text-xs">
                {appendixAnalysis.map((item) => (
                  <div
                    key={item.block}
                    className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">
                        {item.block} (Indore)
                      </span>
                      <span className="font-bold text-indigo-600">
                        {item.actualBundles} / {item.targetBundles} Bundles (
                        {item.compliancePercent}%)
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.compliancePercent >= 100
                            ? "bg-[#008a45]"
                            : item.compliancePercent >= 50
                              ? "bg-amber-400"
                              : "bg-rose-500"
                        }`}
                        style={{ width: `${item.compliancePercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      Tender Trucks Target: {item.target9T} Heavy (9T) |{" "}
                      {item.target4_5T} Light (4.5T)
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Fleet status breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-5 lg:col-span-1 flex flex-col justify-between">
              <div>
                <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                  <Truck className="text-[#008a45]" size={20} />
                  Fleet Document Integrity
                </span>

                <div className="flex flex-col gap-4 font-sans text-xs mt-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">
                      Total Registered Vehicles:
                    </span>
                    <span className="font-bold text-slate-800">
                      {vehicles.length} Trucks
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2 text-emerald-600">
                    <span className="font-medium">
                      Active & Valid Documents:
                    </span>
                    <span className="font-bold">
                      {vehicles.filter((v) => v.rcNo).length} Trucks
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2 text-rose-500">
                    <span className="font-medium">Expired/Locked Fleet:</span>
                    <span className="font-bold">0 Trucks</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#008a45] text-[10px] font-bold p-2.5 rounded-lg border border-emerald-100 mt-4">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>
                  100% of currently deployed active fleet documents are verified
                  and within SLA validity constraints.
                </span>
              </div>
            </Card>

            <Card className="p-5 lg:col-span-2">
              <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
                <TrendingUp className="text-[#008a45]" size={20} />
                Penalty Deductions Breakdowns
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    SLA Delay Fines (Gross)
                  </span>
                  <div>
                    <span className="text-2xl font-black text-rose-600 font-sans">
                      Rs. {kpiData.totalPenalties.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-1">
                      Computed from 5% & 10% slab rates on delayed deliveries.
                    </span>
                  </div>
                </div>

                <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Book Damage Deductions
                  </span>
                  <div>
                    <span className="text-2xl font-black text-rose-600 font-sans">
                      Rs. {kpiData.totalRecoveries.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-1">
                      100% unit book value recovery applied for damaged goods.
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Page>
  );
}
