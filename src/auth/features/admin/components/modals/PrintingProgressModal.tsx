import React from "react";
import Modal from "shared/components/popups/Modal";
import Grid from "shared/components/grid/Grid";
import { mockDashboardData } from "../../data/mockKpiData";

interface Props {
  visible: boolean;
  onHide: () => void;
}

type Item =
  (typeof mockDashboardData.printingProgress.detailedProgress)[number];

export const PrintingProgressModal: React.FC<Props> = ({ visible, onHide }) => {
  const columns: Controls.ColumnProps<Item>[] = [
    { field: "printerName", header: "Printer name" },
    { field: "workOrder", header: "Work Order" },
    { field: "sampleDate", header: "Sample Date" },
    { field: "inspectionDate", header: "Inspection Date" },
    { field: "inspectionBy", header: "Inspection By" },
    { field: "qaDate", header: "Quality Audit Date" },
    { field: "qaBy", header: "Quality Audit By" },
    { field: "dispatchBooks", header: "Dispatch (Books)" },
    { field: "receivedBooks", header: "Received Books" },
    { field: "noOfTransporter", header: "No. of Transporter" },
  ];

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Printing Progress Details"
      size="large"
    >
      <Grid
        data={mockDashboardData.printingProgress.detailedProgress}
        columns={columns}
      />
    </Modal>
  );
};
