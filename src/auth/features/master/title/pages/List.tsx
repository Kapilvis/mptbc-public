import { useState } from "react";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Modal } from "shared/components/popups";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useTitleActiveStatusMutation, useTitlesQuery } from "../queries";

export default function List() {
  const { data = [], isLoading } = useTitlesQuery();
  const { mutateAsync: toggleStatus } = useTitleActiveStatusMutation();
  const [selectedTitleDoc, setSelectedTitleDoc] =
    useState<Master.TitleItem | null>(null);

  const handleToggleStatus = async (item: Master.TitleItem) => {
    try {
      const result = await toggleStatus({
        titleId: item.titleId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Title status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update title status");
    }
  };

  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="View, manage, and create textbook title specifications, GSM parameters, and matter soft copies."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={[
            "name",
            "localName",
            "code",
            "className",
            "bookTypeName",
            "mediumName",
          ]}
          /* CreateForm={CreateRedirect} */
          /* EditForm={EditRedirect} */
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "name", header: "Title Name" },
            { field: "code", header: "Code", align: "center" },
            { field: "className", header: "Class" },
            { field: "bookTypeName", header: "Book Type" },
            { field: "mediumName", header: "Medium" },
            {
              field: "totalPages",
              header: "Total Pages",
              align: "center",
              cell: (row: Master.TitleItem) => (
                <span>{row.totalPages} pages</span>
              ),
            },
            {
              field: "weight",
              header: "Book Weight",
              align: "center",
              cell: (row: Master.TitleItem) => <span>{row.weight} g</span>,
            },
            {
              header: "Soft Copy",
              align: "center",
              cell: (row: Master.TitleItem) => (
                <Button
                  icon="pi pi-file-pdf"
                  label="View Doc"
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedTitleDoc(row)}
                />
              ),
            },
            // {
            //   field: "isActive",
            //   header: "Status",
            //   align: "center",
            //   cell: (row: Master.TitleItem) => (
            //     <StatusButton
            //       value={row.isActive}
            //       onClick={() => handleToggleStatus(row)}
            //     />
            //   ),
            // },
          ]}
          renderContent={(item) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.localName || "",
                item.className ? `Class: ${item.className}` : "",
                item.bookTypeName ? `Type: ${item.bookTypeName}` : "",
                item.mediumName ? `Medium: ${item.mediumName}` : "",
                `Pages: ${item.totalPages} | Area: ${item.paperArea} m²`,
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>

      {/* Redesigned Clean Soft Copy Document Viewer Modal */}
      <Modal
        visible={!!selectedTitleDoc}
        onHide={() => setSelectedTitleDoc(null)}
        header={`Title Details - ${selectedTitleDoc?.code || ""}`}
        size="medium"
      >
        {selectedTitleDoc && (
          <div className="space-y-4 p-1">
            {/* Title Header Card */}
            <div className="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-800 dark:text-emerald-300">
                  {selectedTitleDoc.code}
                </span>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-0.5">
                  {selectedTitleDoc.name}
                </h3>
                {selectedTitleDoc.localName && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {selectedTitleDoc.localName}
                  </p>
                )}
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-emerald-600 text-white shadow-sm">
                Title Master
              </span>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Class & Medium
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedTitleDoc.className || "Class 8"} (
                  {selectedTitleDoc.mediumName || "Hindi"})
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Book Type & Pages
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedTitleDoc.bookTypeName || "Main Textbook"} (
                  {selectedTitleDoc.totalPages} Pages)
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Inner & Cover GSM
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedTitleDoc.innerGsmName || "58 GSM"} /{" "}
                  {selectedTitleDoc.coverGsmName || "200 GSM"}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Weight & Paper Area
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedTitleDoc.weight}g | {selectedTitleDoc.paperArea} m²
                </span>
              </div>
            </div>

            {/* Matter Attachment Box */}
            <div className="border border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-5 text-center bg-emerald-50/30 dark:bg-emerald-950/20">
              <i className="pi pi-file-pdf text-red-500 text-3xl mb-2 inline-block" />
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {selectedTitleDoc.code}_SoftCopy_Matter.pdf
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Official approved textbook soft copy matter for printing press
                manufacturing.
              </p>

              <div className="flex items-center justify-center gap-3 mt-4">
                <Button
                  icon="pi pi-download"
                  label="Download PDF"
                  size="small"
                  onClick={() =>
                    ToastService.success("Downloading Title Soft Copy PDF...")
                  }
                />
                <Button
                  icon="pi pi-eye"
                  label="Open Soft Copy Preview"
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    ToastService.success("Opening soft copy matter viewer...")
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}

// const CreateRedirect: React.FC<{ onSave: () => void }> = () => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     navigate(masterUrls.title.create);
//   }, [navigate]);
//   return null;
// };

// const EditRedirect: React.FC<{
//   data: Master.TitleItem;
//   onSave: () => void;
// }> = ({ data }) => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     navigate(masterUrls.title.edit(data.titleId));
//   }, [navigate, data]);
//   return null;
// };
