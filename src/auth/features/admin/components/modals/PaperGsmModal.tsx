import React from "react";
import Modal from "shared/components/popups/Modal";
import Grid from "shared/components/grid/Grid";

interface PaperGsmModalProps {
  visible: boolean;
  onHide: () => void;
  data: {
    gsm: string;
    totalRequired?: string;
    openingStock?: string;
    receivedStock?: string;
    returnStock?: string;
    availableStock?: string;
    needToPurchase?: string;
    quantity?: string;
  }[];
}

type GsmItem = PaperGsmModalProps["data"][number];

export const PaperGsmModal: React.FC<PaperGsmModalProps> = ({
  visible,
  onHide,
  data,
}) => {
  const isDetailed =
    data.length > 0 &&
    "totalRequired" in data[0] &&
    data[0].totalRequired !== undefined;

  const columns: Controls.ColumnProps<GsmItem>[] = isDetailed
    ? [
        { field: "gsm", header: "GSM Wise" },
        { field: "totalRequired", header: "Total Required" },
        { field: "openingStock", header: "Opening Stock" },
        { field: "receivedStock", header: "Received Stock" },
        { field: "returnStock", header: "Return Stock" },
        { field: "availableStock", header: "Available Stock" },
        { field: "needToPurchase", header: "Need To Purchase" },
      ]
    : [
        { field: "gsm", header: "GSM Wise" },
        { field: "quantity", header: "Available Stock (MT)" },
      ];

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="GSM Wise Paper Analysis"
      size={isDetailed ? "large" : "medium"}
    >
      <div className="p-4">
        <Grid data={data} columns={columns} paginator={false} />
      </div>
    </Modal>
  );
};
