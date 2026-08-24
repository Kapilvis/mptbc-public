import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { printerChallanData, type PrinterChallanItem } from "../data";
import { ChallanReceiptModal } from "../components/ChallanReceiptModal";
import { ReceiveChallanModal } from "../components/ReceiveChallanModal";
import { UpdateShortageDamageModal } from "../components/UpdateShortageDamageModal";

function StatusBadge({ status }: { status: PrinterChallanItem["status"] }) {
  const cls = {
    Received: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Shortage: "bg-rose-50 text-rose-700 border-rose-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Damaged: "bg-orange-50 text-orange-700 border-orange-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

export default function PrinterChallanReceivedPage() {
  const pageTitle = usePageTitle();
  const [challans, setChallans] =
    useState<PrinterChallanItem[]>(printerChallanData);
  const [receiptItem, setReceiptItem] = useState<PrinterChallanItem | null>(
    null,
  );
  const [receivingItem, setReceivingItem] = useState<PrinterChallanItem | null>(
    null,
  );
  const [damageItem, setDamageItem] = useState<PrinterChallanItem | null>(null);

  return (
    <Page
      header={pageTitle || "Printer Challan Received"}
      subHeader="मुद्रक से डिपो पर प्राप्त चालान — Receive incoming printer challans and record post-receipt short supply or damages."
      showHeaderActions
    >
      {/* List Card with Shared GridPanel */}
      <Card className="border border-slate-100 p-1 shadow-xs">
        <GridPanel<PrinterChallanItem>
          toolbarPlacement="page"
          data={challans}
          searchBox={true}
          searchPlaceholder="Search challan, printer, vehicle..."
          exportFilename="printer_challan_received.xls"
          columns={[
            {
              header: "S.No.",
              cell: (_, opt) => (
                <span className="text-gray-500 font-medium">
                  {opt.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
            },
            {
              field: "challanNo",
              header: "Challan No",
              cell: (row) => (
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {row.challanNo}
                </span>
              ),
              sortable: true,
            },
            {
              field: "challanDate",
              header: "Dispatched Date",
              sortable: true,
            },
            {
              field: "depotCode",
              header: "Depot",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {row.depotCode}
                </span>
              ),
              sortable: true,
            },
            {
              field: "printerName",
              header: "Printer",
              sortable: true,
            },
            {
              field: "title",
              header: "Title",
              sortable: true,
              footer: (
                <span className="font-bold text-gray-900 dark:text-white block text-right pr-2">
                  Total:
                </span>
              ),
            },
            {
              field: "dispatchedQty",
              header: "Dispatched",
              align: "center",
              footer: (() => {
                const total = challans.reduce(
                  (sum, item) => sum + item.dispatchedQty,
                  0,
                );
                return (
                  <span className="font-bold text-blue-800 dark:text-blue-300">
                    {total.toLocaleString()}
                  </span>
                );
              })(),
              cell: (row) => (
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  {row.dispatchedQty.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "receivedQty",
              header: "Received",
              align: "center",
              footer: (() => {
                const total = challans.reduce(
                  (sum, item) => sum + (item.receivedQty || 0),
                  0,
                );
                return (
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    {total.toLocaleString()}
                  </span>
                );
              })(),
              cell: (row) => (
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {row.status === "Pending"
                    ? "—"
                    : row.receivedQty.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "shortage",
              header: "Shortage",
              align: "center",
              footer: (() => {
                const total = challans.reduce(
                  (sum, item) => sum + (item.shortage || 0),
                  0,
                );
                return (
                  <span
                    className={`font-bold ${total > 0 ? "text-rose-800 dark:text-rose-300" : "text-gray-400"}`}
                  >
                    {total > 0 ? total.toLocaleString() : "—"}
                  </span>
                );
              })(),
              cell: (row) => (
                <span
                  className={`font-bold ${
                    row.shortage > 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-gray-400"
                  }`}
                >
                  {row.shortage > 0 ? row.shortage.toLocaleString() : "—"}
                </span>
              ),
              sortable: true,
            },
            {
              header: "Damaged",
              align: "center",
              footer: (() => {
                const total = challans.reduce(
                  (sum, item) => sum + (item.damagedQty || 0),
                  0,
                );
                return (
                  <span
                    className={`font-bold ${total > 0 ? "text-amber-800 dark:text-amber-300" : "text-gray-400"}`}
                  >
                    {total > 0 ? total.toLocaleString() : "—"}
                  </span>
                );
              })(),
              cell: (row) => (
                <span
                  className={`font-bold ${
                    (row.damagedQty || 0) > 0
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-gray-400"
                  }`}
                >
                  {(row.damagedQty || 0) > 0
                    ? row.damagedQty?.toLocaleString()
                    : "—"}
                </span>
              ),
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row) => <StatusBadge status={row.status} />,
            },
            {
              header: "ACTION",
              align: "center",
              width: "140px",
              cell: (row) =>
                row.status === "Pending" ? (
                  <Button
                    onClick={() => setReceivingItem(row)}
                    label="Receive"
                    icon="pi pi-check"
                    size="small"
                    variant="success"
                  />
                ) : (
                  <Button
                    onClick={() => setDamageItem(row)}
                    label="Shortage / Damage"
                    icon="pi pi-exclamation-triangle"
                    size="small"
                    variant="warning"
                  />
                ),
            },
            {
              header: "RECEIPT",
              align: "center",
              width: "90px",
              cell: (row) => (
                <Button
                  onClick={() => setReceiptItem(row)}
                  label="View"
                  icon="pi pi-file-pdf"
                  size="small"
                  variant="info"
                />
              ),
            },
          ]}
        />
      </Card>

      {/* 1. Receive Modal (Initial Receipt without warehouse field) */}
      {receivingItem && (
        <ReceiveChallanModal
          challan={receivingItem}
          onClose={() => setReceivingItem(null)}
          onConfirm={(data) => {
            setChallans((prev) =>
              prev.map((item) =>
                item.id === receivingItem.id
                  ? {
                      ...item,
                      receivedQty: data.receivedQty,
                      shortage: data.shortage,
                      receiptDate: data.receiptDate,
                      status: data.shortage > 0 ? "Shortage" : "Received",
                    }
                  : item,
              ),
            );
            setReceivingItem(null);
            ToastService.success("Challan received at depot successfully!");
          }}
        />
      )}

      {/* 2. Post-Receive Shortage & Damage Update Modal */}
      {damageItem && (
        <UpdateShortageDamageModal
          challan={damageItem}
          onClose={() => setDamageItem(null)}
          onConfirm={(data) => {
            setChallans((prev) =>
              prev.map((item) =>
                item.id === damageItem.id
                  ? {
                      ...item,
                      shortage: data.shortage,
                      damagedQty: data.damagedQty,
                      status:
                        data.damagedQty > 0
                          ? "Damaged"
                          : data.shortage > 0
                            ? "Shortage"
                            : "Received",
                    }
                  : item,
              ),
            );
            setDamageItem(null);
            ToastService.success(
              "Short supply and damage details updated successfully!",
            );
          }}
        />
      )}

      {/* 3. View PDF Receipt Modal */}
      {receiptItem && (
        <ChallanReceiptModal
          challan={receiptItem}
          onClose={() => setReceiptItem(null)}
        />
      )}
    </Page>
  );
}
