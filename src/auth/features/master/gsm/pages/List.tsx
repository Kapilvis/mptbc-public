import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useGsmActiveStatusMutation, useGsmsQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useGsmsQuery();
  const { mutateAsync: toggleStatus } = useGsmActiveStatusMutation();

  const handleToggleStatus = async (item: Master.GsmItem) => {
    try {
      const result = await toggleStatus({
        gsmId: item.gsmId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("GSM specification status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update GSM specification status");
    }
  };

  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create, update, and manage paper GSM specifications, sheet weights, and sizes."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["gsm", "sheetSize"]}
          CreateForm={Create}
          EditForm={Edit}
          exportFilename="GSM_Master_Specifications"
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: Master.GsmItem) => <span>{row.gsm}</span>,
            },
            {
              field: "reelWidth",
              header: "Reel Width",
              align: "center",
              cell: (row: Master.GsmItem) => <span>{row.reelWidth}</span>,
            },
            {
              field: "cutoff",
              header: "Cutoff",
              align: "center",
              cell: (row: Master.GsmItem) => <span>{row.cutoff}</span>,
            },
            {
              field: "sheetSize",
              header: "Sheet Size",
              cell: (row: Master.GsmItem) => <span>{row.sheetSize}</span>,
            },
            {
              field: "area",
              header: "Area",
              align: "right",
              cell: (row: Master.GsmItem) => <span>{row.area}</span>,
            },
            {
              field: "sheetWeightInGM",
              header: "Sheet Weight in GM",
              align: "right",
              cell: (row: Master.GsmItem) => <span>{row.sheetWeightInGM}</span>,
            },
            {
              field: "reamWeightInKG",
              header: "Ream Weight in KG",
              align: "right",
              cell: (row: Master.GsmItem) => <span>{row.reamWeightInKG}</span>,
            },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.GsmItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.GsmItem) => (
            <Mosaic.Card
              title={`${item.gsm} GSM | Size: ${item.sheetSize}`}
              subTitle={[
                `Reel Width: ${item.reelWidth}`,
                `Cutoff: ${item.cutoff}`,
                `Area: ${item.area}`,
                `Sheet Wt: ${item.sheetWeightInGM}g`,
                `Ream Wt: ${item.reamWeightInKG}kg`,
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
