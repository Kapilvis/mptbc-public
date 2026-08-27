import { useState } from "react";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";

import { ApproveStockModal } from "../components/ApproveStockModal";
import { OpeningStockGrid } from "../components/OpeningStockGrid";
import { OpeningStockKpis } from "../components/OpeningStockKpis";

import {
  useApproveAllStockMutation,
  useApproveStockMutation,
  useOpeningStockKpisQuery,
  useOpeningStockQuery,
} from "../queries";

import type { OpeningStockItem } from "../data";

export default function List() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // React Query Hooks
  const {
    data: kpis = {
      totalCarriedOverStock: 30500,
      approvedDepotsCount: 4,
      pendingApprovalCount: 3,
      totalSavedPaperTon: 48.5,
    },
  } = useOpeningStockKpisQuery();

  const { data: stockList = [], isLoading } =
    useOpeningStockQuery(academicYear);

  const { mutateAsync: approveStock } = useApproveStockMutation();
  const { mutateAsync: approveAllStock } = useApproveAllStockMutation();

  // Modal State
  const [selectedStockItem, setSelectedStockItem] =
    useState<OpeningStockItem | null>(null);

  // Individual Approve Handler
  const handleConfirmApprove = async (stockId: string, remarks?: string) => {
    try {
      await approveStock({ stockId, remarks });
      setSelectedStockItem(null);
      ToastService.success("Opening Stock approved and locked successfully!");
    } catch {
      ToastService.error("Failed to approve opening stock.");
    }
  };

  // Bulk Approve All Handler
  const handleApproveAll = async () => {
    try {
      await approveAllStock();
      ToastService.success(
        "All depot carried-over stock approved and consolidated for FY 2027-2028!",
      );
    } catch {
      ToastService.error("Failed to approve all opening stock.");
    }
  };

  return (
    <Page
      header={pageTitle || "Depot Opening Stock Approval & Carry-Forward"}
      subHeader="Head Office End-of-Year Inventory Audit: Verifying, approving, and locking carried-over textbook stock to eliminate duplicate paper procurement."
      showHeaderActions
    >
      {/* Shared Academic Year Filter Bar & Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex-1">
          <AcademicYearFilterBar
            academicYear={academicYear}
            onChange={setAcademicYear}
            title="Academic Session (Carry Forward)"
            className="mb-0"
          />

          <div className="shrink-0 flex items-center justify-end">
            <Button
              label="Approve & Consolidate All Stock"
              icon="pi pi-check-square"
              variant="primary"
              onClick={handleApproveAll}
            />
          </div>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <OpeningStockKpis kpis={kpis} />

      {/* Main Inventory Grid */}
      <OpeningStockGrid
        data={stockList}
        loading={isLoading}
        onApproveStock={(item) => setSelectedStockItem(item)}
      />

      {/* Approval Details Modal */}
      <ApproveStockModal
        item={selectedStockItem}
        onHide={() => setSelectedStockItem(null)}
        onConfirmApprove={handleConfirmApprove}
      />
    </Page>
  );
}
