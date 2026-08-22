import React from "react";
import Modal from "shared/components/popups/Modal";
import Grid from "shared/components/grid/Grid";
import { mockDashboardData } from "../../data/mockKpiData";

interface Props {
  visible: boolean;
  onHide: () => void;
}

type Item =
  (typeof mockDashboardData.printerProfile.maxCapacityPrinters)[number];

export const PrinterProfileModal: React.FC<Props> = ({ visible, onHide }) => {
  const columns: Controls.ColumnProps<Item>[] = [
    { field: "name", header: "Printer Name" },
    { field: "capacity", header: "Capacity" },
    { field: "approvedBooks", header: "Approved Books" },
  ];

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Printer Profile Details"
      size="large"
    >
      <Grid
        data={mockDashboardData.printerProfile.maxCapacityPrinters}
        columns={columns}
      />
    </Modal>
  );
};
