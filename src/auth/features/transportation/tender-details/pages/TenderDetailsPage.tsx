import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { ToastService } from "services";
import { useTendersQuery, useDeleteTenderMutation } from "../queries";
import type { TenderRecord } from "../data";
import TenderFormModal from "../components/TenderFormModal";

export default function TenderDetailsPage() {
  const pageTitle = usePageTitle();
  const { data: tenders = [], isLoading } = useTendersQuery();
  const deleteMutation = useDeleteTenderMutation();
  const { confirmAction } = useConfirmDialog();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tenderToEdit, setTenderToEdit] = useState<TenderRecord | null>(null);

  const handleDelete = (tender: TenderRecord) => {
    confirmAction({
      message: `Are you sure you want to delete tender "${tender.tenderRefNo}"?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          await deleteMutation.mutateAsync(tender.tenderId);
          ToastService.success(
            `Tender ${tender.tenderRefNo} deleted successfully.`,
          );
        } catch {
          ToastService.error("Failed to delete tender.");
        }
      },
    });
  };

  const handleOpenAddModal = () => {
    setTenderToEdit(null);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (tender: TenderRecord) => {
    setTenderToEdit(tender);
    setIsModalVisible(true);
  };

  return (
    <Page
      header={pageTitle || "Tender Details"}
      subHeader="Manage annual transportation tenders, contract validity, and academic year scopes."
      showHeaderActions
    >
      <ConfirmDialog />

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={tenders}
          loading={isLoading}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
          searchFields={["tenderRefNo", "title", "financialYear"]}
          toolbar={
            <Button
              label="Add"
              icon="plus"
              onClick={handleOpenAddModal}
              variant="primary"
              className="shadow-sm font-bold text-xs"
            />
          }
          columns={[
            {
              cell: (_, option) => (
                <span className="text-slate-600 font-medium">
                  {option.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
              header: "S.No.",
            },
            {
              field: "tenderRefNo",
              header: "Tender Ref No",
              sortable: true,
            },
            {
              field: "title",
              header: "Tender Title / Scope",
              sortable: true,
            },
            {
              field: "financialYear",
              header: "Academic Year",
              sortable: true,
              align: "center",
            },
            {
              header: "Mapped Transporters",
              cell: (item: TenderRecord) => {
                const uniqueTransporters = Array.from(
                  new Set(
                    item.allocations?.map((a) => a.transporterName) || [],
                  ),
                );
                if (uniqueTransporters.length === 0) {
                  return (
                    <span className="text-xs text-slate-400 font-normal">
                      None
                    </span>
                  );
                }
                return (
                  <span className="font-medium text-slate-700 whitespace-nowrap">
                    {uniqueTransporters.join(", ")}
                  </span>
                );
              },
            },
            {
              field: "agreementDate",
              header: "Agreement Date",
              sortable: true,
              align: "center",
            },
            {
              field: "validTill",
              header: "Valid Till Date",
              sortable: true,
              align: "center",
            },
          ]}
        />
      </Card>

      {isModalVisible && (
        <TenderFormModal
          visible={isModalVisible}
          onHide={() => setIsModalVisible(false)}
          tenderToEdit={tenderToEdit}
        />
      )}
    </Page>
  );
}
