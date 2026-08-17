import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Modal } from "shared/components/popups";
import {
  usePaperOrderActiveStatusMutation,
  usePaperOrdersQuery,
} from "../queries";

export default function List() {
  const { data = [], isLoading } = usePaperOrdersQuery();
  const { mutateAsync: toggleStatus } = usePaperOrderActiveStatusMutation();
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  const handleToggleStatus = async (item: PaperOrder.PaperSupplyOrderItem) => {
    try {
      const result = await toggleStatus({
        orderId: item.orderId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Paper Order status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update status");
    }
  };

  const formatDateDisplay = (val: unknown) => {
    if (!val) return "-";
    if (val instanceof Date) return val.toISOString().split("T")[0];
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return (
    <Page
      header="Paper Order & Supply Allocation"
      subHeader="Issue binding purchase work orders to paper mills, manage order quantities, rates, and track depot allocations."
      showHeaderActions
    >
      <Card>
        <GridPanel<PaperOrder.PaperSupplyOrderItem>
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={[
            "orderNo",
            "paperMillName",
            "vendorName",
            "paperType",
            "status",
          ]}
          CreateForm={CreateRedirect}
          EditForm={EditRedirect}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            {
              field: "orderNo",
              header: "ORDER NO",
            },
            {
              field: "orderDate",
              header: "ORDER DATE",
              align: "center",
              cell: (row) => <span>{formatDateDisplay(row.orderDate)}</span>,
            },
            {
              field: "paperMillName",
              header: "PAPER MILL / VENDOR",
            },
            {
              field: "paperType",
              header: "PAPER TYPE",
            },
            {
              field: "orderedQtyMT",
              header: "QTY (MT)",
              align: "right",
              cell: (row) => <span>{row.orderedQtyMT.toFixed(3)} MT</span>,
            },
            {
              field: "ratePerMT",
              header: "RATE PER MT",
              align: "right",
              cell: (row) => <span>₹ {row.ratePerMT.toLocaleString()}</span>,
            },
            {
              header: "BILL COPY",
              align: "center",
              cell: (row) => (
                <Button
                  icon="pi pi-file-pdf"
                  label="View Bill"
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setSelectedDocUrl(
                      row.billCopyPath ||
                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    )
                  }
                />
              ),
            },
            {
              field: "isActive",
              header: "STATUS",
              align: "center",
              cell: (row) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item) => (
            <Mosaic.Card
              title={item.orderNo}
              subTitle={[
                item.paperMillName || "",
                item.paperType || "",
                `Qty: ${item.orderedQtyMT} MT`,
                `Total: ₹ ${(item.totalAmount / 100000).toFixed(2)} Lakhs`,
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>

      {/* Bill Document View Modal */}
      <Modal
        visible={!!selectedDocUrl}
        onHide={() => setSelectedDocUrl(null)}
        header="Paper Mill Despatch Invoice / Bill Document"
        size="medium"
      >
        <div className="space-y-4 p-2">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 text-center">
            <i className="pi pi-file-pdf text-red-600 text-4xl mb-2 block" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Official Vendor Bill / Invoice Soft Copy
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              File: vendor_invoice_mill_copy.pdf
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              label="Download Invoice"
              icon="pi pi-download"
              size="small"
              onClick={() =>
                ToastService.success("Downloading vendor invoice PDF file...")
              }
            />
            <Button
              label="Close"
              size="small"
              variant="outlined"
              onClick={() => setSelectedDocUrl(null)}
            />
          </div>
        </div>
      </Modal>
    </Page>
  );
}

const CreateRedirect: React.FC<{ onSave: () => void }> = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/paper/paper-order-allocation/create");
  }, [navigate]);
  return null;
};

const EditRedirect: React.FC<{
  data: PaperOrder.PaperSupplyOrderItem;
  onSave: () => void;
}> = ({ data }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/paper/paper-order-allocation/edit/${data.orderId}`);
  }, [navigate, data]);
  return null;
};
