import { useState } from "react";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import Page from "shared/components/panels/Page";
import { Button } from "shared/components/buttons";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { ToastService } from "services";

import { DepotTransferKpiCards } from "../components/DepotTransferKpiCards";
import { DeficitDepotsGrid } from "../components/DeficitDepotsGrid";
import { SurplusDepotsGrid } from "../components/SurplusDepotsGrid";
import { TransferLedgerGrid } from "../components/TransferLedgerGrid";
import { SanctionTransferModal } from "../components/SanctionTransferModal";
import { GatepassChallanModal } from "../components/GatepassChallanModal";

import {
  useDeficitDepotsQuery,
  useDepotTransferKpisQuery,
  useSanctionTransferMutation,
  useSurplusDepotsQuery,
  useTransferLedgerQuery,
} from "../queries";

import type {
  DeficitDepotNeedItem,
  InterDepotTransferOrder,
  SanctionTransferPayload,
  SurplusDepotStockItem,
} from "../data";

export default function DepotToDepotPage() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // React Query Hooks
  const {
    data: kpis = {
      totalDeliveredQty: 180500,
      totalDispatchedQty: 150000,
      consolidatedRemainingStock: 30500,
      activeTransfersCount: 8,
      totalDeficitQty: 14200,
      totalSurplusQty: 28500,
      savedProcurementCost: "₹ 48.50 Lakhs",
    },
  } = useDepotTransferKpisQuery();

  const { data: deficitList = [], isLoading: isDeficitLoading } =
    useDeficitDepotsQuery(academicYear);
  const { data: surplusList = [], isLoading: isSurplusLoading } =
    useSurplusDepotsQuery(academicYear);
  const { data: transferLedger = [], isLoading: isLedgerLoading } =
    useTransferLedgerQuery(academicYear);

  const { mutateAsync: sanctionTransfer } = useSanctionTransferMutation();

  // Modal States
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [selectedDeficit, setSelectedDeficit] =
    useState<DeficitDepotNeedItem | null>(null);
  const [selectedSurplus, setSelectedSurplus] =
    useState<SurplusDepotStockItem | null>(null);

  // Gatepass Modal
  const [selectedGatepass, setSelectedGatepass] =
    useState<InterDepotTransferOrder | null>(null);

  // Handle open sanction modal with smart pre-selection
  const handleOpenSanctionModal = (
    deficitItem?: DeficitDepotNeedItem,
    surplusItem?: SurplusDepotStockItem,
  ) => {
    setSelectedDeficit(deficitItem || null);
    setSelectedSurplus(surplusItem || null);
    setIsSanctionModalOpen(true);
  };

  // Confirm sanction submit
  const handleConfirmSanction = async (payload: SanctionTransferPayload) => {
    try {
      const createdOrders = await sanctionTransfer(payload);
      setIsSanctionModalOpen(false);
      ToastService.success(
        `Sanctioned HO Inter-Depot Transfer! ${createdOrders.length} Gatepass Challan(s) generated.`,
      );
    } catch {
      ToastService.error("Failed to sanction inter-depot transfer.");
    }
  };

  return (
    <Page
      header={pageTitle || "Depot to Depot Stock Transfer (HO Level)"}
      subHeader="Head Office Inventory Balancing: Reallocating surplus stock from over-supplied depots to deficit depots without issuing new printing tenders."
      showHeaderActions
    >
      {/* Shared Academic Year Filter Bar & Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex-1">
          <AcademicYearFilterBar
            academicYear={academicYear}
            onChange={setAcademicYear}
            title="Academic Session"
            className="mb-0"
          />
          <div className="shrink-0 flex items-center justify-end">
            <Button
              label="Sanction Inter-Depot Transfer"
              icon="pi pi-plus-circle"
              variant="primary"
              onClick={() => handleOpenSanctionModal()}
            />
          </div>
        </div>
      </div>

      {/* Executive KPI Summary Cards */}
      <DepotTransferKpiCards kpis={kpis} />

      {/* Dual Recommendation Matrix Data Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DeficitDepotsGrid
          data={deficitList}
          loading={isDeficitLoading}
          onFulfillNeed={(item) => handleOpenSanctionModal(item, undefined)}
        />
        <SurplusDepotsGrid
          data={surplusList}
          loading={isSurplusLoading}
          onTransferStock={(item) => handleOpenSanctionModal(undefined, item)}
        />
      </div>

      {/* Inter-Depot Transfer Audit Ledger */}
      <TransferLedgerGrid
        data={transferLedger}
        loading={isLedgerLoading}
        onViewGatepass={(order) => setSelectedGatepass(order)}
      />

      {/* Sanction Transfer Modal (Image 1 Style) */}
      <SanctionTransferModal
        visible={isSanctionModalOpen}
        onHide={() => setIsSanctionModalOpen(false)}
        deficitList={deficitList}
        surplusList={surplusList}
        initialDeficit={selectedDeficit}
        initialSurplus={selectedSurplus}
        academicYear={academicYear}
        onConfirm={handleConfirmSanction}
      />

      {/* Printable Gatepass Challan View Modal */}
      <GatepassChallanModal
        order={selectedGatepass}
        onHide={() => setSelectedGatepass(null)}
      />
    </Page>
  );
}
