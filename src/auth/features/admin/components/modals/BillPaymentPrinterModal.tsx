import React from "react";
import Modal from "shared/components/popups/Modal";
import Grid from "shared/components/grid/Grid";
import { mockDashboardData } from "../../data/mockKpiData";

interface Props {
  visible: boolean;
  onHide: () => void;
}

type Item = (typeof mockDashboardData.billAndPayment.printer.details)[number];

export const BillPaymentPrinterModal: React.FC<Props> = ({
  visible,
  onHide,
}) => {
  const columns: Controls.ColumnProps<Item>[] = [
    { field: "orderNo", header: "Order No" },
    { field: "vendorName", header: "Vendor Name" },
    { field: "date", header: "Date of Bills" },
    { field: "amount", header: "Payment Amount" },
    { field: "received", header: "Received Amount" },
    { field: "pending", header: "Pending Amount" },
    { field: "status", header: "Status" },
  ];

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Bill & Payment Details - Printer"
      size="large"
    >
      <Grid
        data={mockDashboardData.billAndPayment.printer.details}
        columns={columns}
      />
    </Modal>
  );
};
