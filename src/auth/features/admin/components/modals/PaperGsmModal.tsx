import React, { useMemo } from "react";
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

const parseVal = (str?: string): number => {
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
};

export const PaperGsmModal: React.FC<PaperGsmModalProps> = ({
  visible,
  onHide,
  data,
}) => {
  const isDetailed =
    data.length > 0 &&
    "totalRequired" in data[0] &&
    data[0].totalRequired !== undefined;

  const detailedTotals = useMemo(() => {
    if (!isDetailed) return null;
    return data.reduce(
      (acc, curr) => {
        acc.totalRequired += parseVal(curr.totalRequired);
        acc.openingStock += parseVal(curr.openingStock);
        acc.receivedStock += parseVal(curr.receivedStock);
        acc.returnStock += parseVal(curr.returnStock);
        acc.availableStock += parseVal(curr.availableStock);
        acc.needToPurchase += parseVal(curr.needToPurchase);
        return acc;
      },
      {
        totalRequired: 0,
        openingStock: 0,
        receivedStock: 0,
        returnStock: 0,
        availableStock: 0,
        needToPurchase: 0,
      },
    );
  }, [data, isDetailed]);

  const simpleTotals = useMemo(() => {
    if (isDetailed) return null;
    const sumQuantity = data.reduce(
      (acc, curr) => acc + parseVal(curr.quantity),
      0,
    );
    return { quantity: sumQuantity };
  }, [data, isDetailed]);

  const columns: Controls.ColumnProps<GsmItem>[] = isDetailed
    ? [
        {
          field: "gsm",
          header: "GSM Wise",
          footer: <span className="font-bold text-slate-700">Total</span>,
        },
        {
          field: "totalRequired",
          header: "Total Required",
          footer: (
            <span className="font-bold text-slate-700">
              {detailedTotals?.totalRequired?.toLocaleString()} MT
            </span>
          ),
        },
        {
          field: "openingStock",
          header: "Opening Stock",
          footer: (
            <span className="font-bold text-slate-700">
              {detailedTotals?.openingStock?.toLocaleString()} MT
            </span>
          ),
        },
        {
          field: "receivedStock",
          header: "Received Stock",
          footer: (
            <span className="font-bold text-slate-700">
              {detailedTotals?.receivedStock?.toLocaleString()} MT
            </span>
          ),
        },
        {
          field: "returnStock",
          header: "Return Stock",
          footer: (
            <span className="font-bold text-slate-700">
              {detailedTotals?.returnStock?.toLocaleString()} MT
            </span>
          ),
        },
        {
          field: "availableStock",
          header: "Available Stock",
          footer: (
            <span className="font-bold text-slate-700">
              {detailedTotals?.availableStock?.toLocaleString()} MT
            </span>
          ),
        },
        {
          field: "needToPurchase",
          header: "Need To Purchase",
          footer: (
            <span className="font-bold text-slate-700">
              {detailedTotals?.needToPurchase?.toLocaleString()} MT
            </span>
          ),
        },
      ]
    : [
        {
          field: "gsm",
          header: "GSM Wise",
          footer: <span className="font-bold text-slate-700">Total</span>,
        },
        {
          field: "quantity",
          header: "Available Stock (MT)",
          footer: (
            <span className="font-bold text-slate-700">
              {simpleTotals?.quantity?.toLocaleString()} MT
            </span>
          ),
        },
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
