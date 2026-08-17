import { useState, useEffect } from "react";
import { ToastService } from "services";
import { Card, GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import StatusButton from "shared/components/buttons/StatusButton";
import { getSubDepots, saveSubDepots } from "../data";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { confirmAction } = useConfirmDialog();
  const [subDepots, setSubDepots] = useState<Master.SubDepot[]>(() =>
    getSubDepots(),
  );

  useEffect(() => {
    const handleUpdate = () => {
      setSubDepots(getSubDepots());
    };
    window.addEventListener("mptbc_sub_depot_changed", handleUpdate);
    return () => {
      window.removeEventListener("mptbc_sub_depot_changed", handleUpdate);
    };
  }, []);

  const handleToggleStatus = (item: Master.SubDepot) => {
    const updated = subDepots.map((sd) =>
      sd.subDepotId === item.subDepotId
        ? { ...sd, isActive: !sd.isActive }
        : sd,
    );
    setSubDepots(updated);
    saveSubDepots(updated);
    ToastService.success("Sub Depot status updated successfully");
  };

  const handleDelete = (item: Master.SubDepot) => {
    confirmAction({
      message: `Are you sure you want to delete the Sub Depot: ${item.name}?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        const updated = subDepots.filter(
          (sd) => sd.subDepotId !== item.subDepotId,
        );
        setSubDepots(updated);
        saveSubDepots(updated);
        ToastService.success("Sub Depot deleted successfully.");
      },
    });
  };

  return (
    <Page
      header="Sub Depot"
      subHeader="Manage sub depot branch offices, codes, and relationships under parent depots."
      showHeaderActions
    >
      <ConfirmDialog />

      <div className="space-y-4">
        <Card>
          <GridPanel
            toolbarPlacement="page"
            data={subDepots}
            loading={false}
            searchFields={["name", "code", "depotName"]}
            searchPlaceholder="Search sub depot..."
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
                field: "depotName",
                header: "Depot Name",
                sortable: true,
              },
              {
                field: "name",
                header: "Sub Depot Name",
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
                cell: (item: Master.SubDepot) => (
                  <StatusButton
                    value={item.isActive}
                    onClick={() => handleToggleStatus(item)}
                  />
                ),
              },
            ]}
          />
        </Card>
      </div>
    </Page>
  );
}
