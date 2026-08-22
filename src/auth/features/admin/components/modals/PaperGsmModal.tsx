import React from "react";
import Modal from "shared/components/popups/Modal";
import Grid from "shared/components/grid/Grid";

interface PaperGsmModalProps {
  visible: boolean;
  onHide: () => void;
  data: { gsm: string; quantity: string }[];
}

type GsmItem = PaperGsmModalProps["data"][number];

export const PaperGsmModal: React.FC<PaperGsmModalProps> = ({
  visible,
  onHide,
  data,
}) => {
  const columns: Controls.ColumnProps<GsmItem>[] = [
    { field: "gsm", header: "GSM Wise" },
    { field: "quantity", header: "Quantity (MT)" },
  ];

  return (
    <Modal visible={visible} onHide={onHide} header="GSM Wise Paper Analysis">
      <div className="p-4">
        <Grid data={data} columns={columns} paginator={false} />
      </div>
    </Modal>
  );
};
