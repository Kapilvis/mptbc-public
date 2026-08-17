import { useState, useEffect } from "react";
import { ToastService } from "services";
import { Card, GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import StatusButton from "shared/components/buttons/StatusButton";
import { getDepots, saveDepots } from "../data";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { confirmAction } = useConfirmDialog();
  const [depots, setDepots] = useState<Master.Depot[]>(() => getDepots());

  useEffect(() => {
    const handleUpdate = () => {
      setDepots(getDepots());
    };
    window.addEventListener("mptbc_depot_changed", handleUpdate);
    return () => {
      window.removeEventListener("mptbc_depot_changed", handleUpdate);
    };
  }, []);

  const handleToggleStatus = (item: Master.Depot) => {
    const updated = depots.map((d) =>
      d.depotId === item.depotId ? { ...d, isActive: !d.isActive } : d,
    );
    setDepots(updated);
    saveDepots(updated);
    ToastService.success("Depot status updated successfully");
  };

  const handleDelete = (item: Master.Depot) => {
    confirmAction({
      message: `Are you sure you want to delete the Depot: ${item.name}?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        const updated = depots.filter((d) => d.depotId !== item.depotId);
        setDepots(updated);
        saveDepots(updated);
        ToastService.success("Depot deleted successfully.");
      },
    });
  };

  return (
    <Page
      header="Depot"
      subHeader="Manage storage depot locations, codes, and operational status."
      showHeaderActions
    >
      <ConfirmDialog />

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={depots}
          loading={false}
          searchFields={["name", "code"]}
          searchPlaceholder="Search depot..."
          addButtonLabel="Add"
          CreateForm={Create}
          EditForm={Edit}
          onDelete={handleDelete}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "60px",
              align: "center",
              header: "Sr No",
            },
            {
              field: "name",
              header: "Depot Name",
              sortable: true,
            },
            {
              field: "code",
              header: "Code",
              align: "center",
            },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (item: Master.Depot) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
