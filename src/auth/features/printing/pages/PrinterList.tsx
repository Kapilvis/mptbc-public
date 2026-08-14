import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import StatusButton from "shared/components/buttons/StatusButton";
import { AddButton } from "shared/components/buttons/AddButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { initialPrinterData, type PrinterItem } from "../data/printerData";

export default function PrinterList() {
  const { t } = useTranslation();
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
      header={t("printing.list.header")}
      subHeader={t("printing.list.subHeader")}
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          toolbar={
            <AddButton
              onClick={handleAddPrinter}
              label={t("printing.list.add_printer")}
            />
          }
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
              header: t("printing.list.s_no"),
              width: "60px",
              align: "center",
            },
            {
              field: "printerId",
              header: t("printing.list.printer_id"),
              align: "center",
              width: "100px",
            },
            {
              field: "printerName",
              header: t("printing.list.printer_name"),
            },
            {
              field: "depotName",
              header: t("printing.list.depot_name"),
              align: "center",
            },
            {
              field: "classId",
              header: t("printing.list.class_id"),
              align: "center",
              width: "90px",
            },
            {
              field: "districtId",
              header: t("printing.list.district_id"),
              align: "center",
              width: "90px",
            },
            {
              field: "depotId",
              header: t("printing.list.depot_id"),
              align: "center",
              width: "90px",
            },
            {
              field: "isActive",
              header: t("printing.list.status"),
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
                `${t("printing.list.printer_id")}: ${item.printerId}`,
                `${t("printing.list.depot")}: ${item.depotName} (${t("printing.list.depot_id")}: ${item.depotId})`,
                `${t("printing.list.class_id")}: ${item.classId}`,
                `${t("printing.list.district_id")}: ${item.districtId}`,
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
