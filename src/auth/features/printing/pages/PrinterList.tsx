import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { initialPrinterData, type PrinterItem } from "../data/printerData";

export default function PrinterList() {
  const navigate = useNavigate();
  const [printers, setPrinters] = useState<PrinterItem[]>(initialPrinterData);

  const handleToggleStatus = (item: PrinterItem) => {
    setPrinters((prev) =>
      prev.map((p) =>
        p.printerId === item.printerId ? { ...p, isActive: !p.isActive } : p,
      ),
    );
  };

  const handleAddPrinter = () => {
    navigate("/printing/printer-registration/create");
  };

  return (
    <Page
      header="Registered Printers / पंजीकृत मुद्रक"
      subHeader="View, manage, and register printing press vendors for MPTBC textbook manufacturing."
      showHeaderActions
    >
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleAddPrinter}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <i className="pi pi-plus text-xs" />
          <span>Add Printer / नया मुद्रक पंजीकृत करें</span>
        </button>
      </div>

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={printers}
          loading={false}
          searchFields={[
            "printerId",
            "printerName",
            "depotName",
            "classId",
            "districtId",
            "depotId",
          ]}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              header: "S.No",
              width: "60px",
              align: "center",
            },
            {
              field: "printerId",
              header: "Printer ID",
              align: "center",
              width: "100px",
            },
            {
              field: "printerName",
              header: "Printer Name",
            },
            {
              field: "depotName",
              header: "Depot Name",
              align: "center",
            },
            {
              field: "classId",
              header: "Class ID",
              align: "center",
              width: "90px",
            },
            {
              field: "districtId",
              header: "District ID",
              align: "center",
              width: "90px",
            },
            {
              field: "depotId",
              header: "Depot ID",
              align: "center",
              width: "90px",
            },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: PrinterItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: PrinterItem) => (
            <Mosaic.Card
              title={item.printerName}
              subTitle={[
                `Printer ID: ${item.printerId}`,
                `Depot: ${item.depotName} (Depot ID: ${item.depotId})`,
                `Class ID: ${item.classId}`,
                `District ID: ${item.districtId}`,
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>
    </Page>
  );
}
