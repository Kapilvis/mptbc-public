import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Modal } from "shared/components/popups";
import { formatDate } from "shared/utils/dateUtils";
import {
  usePaperDispatchActiveStatusMutation,
  usePaperDispatchesQuery,
} from "../queries";

export default function List() {
  const pageTitle = usePageTitle();
  const { data = [], isLoading } = usePaperDispatchesQuery();
  const { mutateAsync: toggleStatus } = usePaperDispatchActiveStatusMutation();
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  const handleToggleStatus = async (
    item: PaperSupplyDispatch.PaperDispatchItem,
  ) => {
    try {
      const result = await toggleStatus({
        dispatchId: item.dispatchId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Paper Dispatch status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update status");
    }
  };

  // const formatDateDisplay = (val: unknown) => {
  //   if (!val) return "-";
  //   if (val instanceof Date) return val.toISOString().split("T")[0];
  //   if (typeof val === "object") return JSON.stringify(val);
  //   return String(val);
  // };

  return (
    <Page
      header={pageTitle || "Paper Supply & Central Depot Dispatch"}
      subHeader="Manage paper reel dispatches, vehicle challans, and shipments sent to Central Depot and Printers."
      showHeaderActions
    >
      <Card>
        <GridPanel<PaperSupplyDispatch.PaperDispatchItem>
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={[
            "challanNo",
            "orderNo",
            "paperMillName",
            "paperType",
            "consigneeName",
            "truckNo",
            "status",
          ]}
          CreateForm={CreateRedirect}
          // EditForm={EditRedirect}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            {
              field: "challanNo",
              header: "CHALLAN NO",
            },
            {
              field: "challanDate",
              header: "DATE",
              align: "center",
              cell: (row) => <span>{formatDate(row.challanDate)}</span>,
            },
            {
              field: "consigneeName",
              header: "PRINTER / CONSIGNEE",
            },
            {
              field: "paperType",
              header: "PAPER TYPE",
            },
            // {
            //   field: "reelCount",
            //   header: "REELS",
            //   align: "center",
            //   cell: (row) => <span>{row.reelCount.toLocaleString()}</span>,
            // },
            {
              field: "totalWeightTon",
              header: "WEIGHT",
              align: "center",
              cell: (row) => <span>{row.totalWeightTon} MT</span>,
            },
            {
              header: "CHALLAN",
              align: "center",
              cell: (row) => (
                <Button
                  icon="pi pi-file-pdf"
                  label="View Challan"
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setSelectedDocUrl(
                      row.challanCopyPath ||
                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    )
                  }
                />
              ),
            },
            // {
            //   field: "isActive",
            //   header: "STATUS",
            //   align: "center",
            //   cell: (row) => (
            //     <StatusButton
            //       value={row.isActive}
            //       onClick={() => handleToggleStatus(row)}
            //     />
            //   ),
            // },
          ]}
          renderContent={(item) => (
            <Mosaic.Card
              title={item.challanNo}
              subTitle={[
                item.consigneeName || "",
                item.paperType || "",
                `Reels: ${item.reelCount}`,
                `Weight: ${item.totalWeightTon} MT`,
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>

      {/* Delivery Challan Document View Modal */}
      <Modal
        visible={!!selectedDocUrl}
        onHide={() => setSelectedDocUrl(null)}
        header="Paper Mill Official Delivery Challan Document"
        size="medium"
      >
        <div className="space-y-4 p-2">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 text-center">
            <i className="pi pi-file-pdf text-red-600 text-4xl mb-2 block" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Official Paper Mill Delivery Challan
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              File: delivery_challan_mill_copy.pdf
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              label="Download Challan"
              icon="pi pi-download"
              size="small"
              onClick={() =>
                ToastService.success("Downloading delivery challan PDF file...")
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
    navigate("/paper/paper-supply-dispatch/create");
  }, [navigate]);
  return null;
};

// const EditRedirect: React.FC<{
//   data: PaperSupplyDispatch.PaperDispatchItem;
//   onSave: () => void;
// }> = ({ data }) => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     navigate(`/paper/paper-supply-dispatch/edit/${data.dispatchId}`);
//   }, [navigate, data]);
//   return null;
// };
