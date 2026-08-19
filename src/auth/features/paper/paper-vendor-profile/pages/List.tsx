import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Modal } from "shared/components/popups";
import {
  usePaperVendorActiveStatusMutation,
  usePaperVendorsQuery,
} from "../queries";

export default function List() {
  const pageTitle = usePageTitle();
  const { data = [], isLoading } = usePaperVendorsQuery();
  const { mutateAsync: toggleStatus } = usePaperVendorActiveStatusMutation();
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  const handleToggleStatus = async (item: PaperVendor.Item) => {
    try {
      const result = await toggleStatus({
        vendorId: item.vendorId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Paper Vendor status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update status");
    }
  };

  return (
    <Page
      header={pageTitle || "Paper Vendor Profile"}
      subHeader="View, manage, and register paper mill vendors, supply agreements, and rate details."
      showHeaderActions
    >
      <Card>
        <GridPanel<PaperVendor.Item>
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={[
            "paperMillName",
            "vendorName",
            "contactNo",
            "emailId",
            "academicYear",
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
              field: "paperMillName",
              header: "PAPER MILL NAME",
            },
            {
              field: "vendorName",
              header: "VENDOR NAME",
            },
            {
              field: "academicYear",
              header: "AGREEMENT YEAR",
              align: "center",
            },
            {
              field: "approvedTon",
              header: "APPROVED TON",
              align: "center",
              cell: (row) => <span>{row.approvedTon.toFixed(2)} MT</span>,
            },
            {
              field: "ratePerMt",
              header: "RATE PER MT",
              align: "center",
              cell: (row) => <span>₹ {row.ratePerMt.toLocaleString()}</span>,
            },
            {
              header: "AGREEMENT",
              align: "center",
              cell: (row) => (
                <Button
                  icon="pi pi-file-pdf"
                  label="View Doc"
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setSelectedDocUrl(
                      row.agreementDocUrl ||
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
              title={item.paperMillName}
              subTitle={[
                item.vendorName || "",
                item.academicYear ? `Year: ${item.academicYear}` : "",
                `Approved: ${item.approvedTon} MT`,
                `Rate: ₹ ${item.ratePerMt.toLocaleString()} / MT`,
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>

      {/* Document View Modal */}
      <Modal
        visible={!!selectedDocUrl}
        onHide={() => setSelectedDocUrl(null)}
        header="Paper Mill Supply Agreement Document"
        size="medium"
      >
        <div className="space-y-4 p-2">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 text-center">
            <i className="pi pi-file-pdf text-red-600 text-4xl mb-2 block" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Official Paper Mill Agreement Soft Copy
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              File: agreement_paper_mill_2026.pdf
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              label="Download File"
              icon="pi pi-download"
              size="small"
              onClick={() =>
                ToastService.success("Downloading agreement PDF file...")
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
    navigate("/paper/paper-vendor-profile/create");
  }, [navigate]);
  return null;
};

const EditRedirect: React.FC<{
  data: PaperVendor.Item;
  onSave: () => void;
}> = ({ data }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/paper/paper-vendor-profile/edit/${data.vendorId}`);
  }, [navigate, data]);
  return null;
};
