import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";

import { printerDemandMappingMock } from "../printerDemandMapping.mock";
import ApprovedDemandGrid from "../components/ApprovedDemandGrid";
import PrinterDetailsViewModal from "../components/PrinterDetailsViewModal";

export default function PrinterDemandMappingListPage() {
  // ───────── Modal State ─────────
  const [selectedOrderNo, setSelectedOrderNo] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Retrieve orders list
  const orders = useMemo(() => {
    return printerDemandMappingMock.getOrdersList();
  }, []);

  const handleViewDetailsClick = (orderNo: string) => {
    setSelectedOrderNo(orderNo);
    setIsDetailsModalOpen(true);
  };

  return (
    <Page
      header="Printer Work Allocation"
      subHeader="Allocate printing work assignments to approved printers against tenders."
      showHeaderActions
    >
      <Card className="p-4">
        <ApprovedDemandGrid
          data={orders}
          onViewDetailsClick={handleViewDetailsClick}
        />
      </Card>

      {/* Details capacity popup modal */}
      {isDetailsModalOpen && selectedOrderNo && (
        <PrinterDetailsViewModal
          visible={isDetailsModalOpen}
          onHide={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrderNo("");
          }}
          orderNo={selectedOrderNo}
        />
      )}
    </Page>
  );
}
