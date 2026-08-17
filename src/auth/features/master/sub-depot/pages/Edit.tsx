import { ToastService } from "services";
import SubDepotForm from "../components/SubDepotForm";
import { getSubDepots, saveSubDepots, depotOptions } from "../data";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.SubDepot;
  onSave: () => void;
}) {
  const handleSubmit = async (form: Master.SubDepotForm) => {
    const subDepotsList = getSubDepots();
    const selectedDepot = depotOptions.find((d) => d.value === form.depotId);
    const depotName = selectedDepot ? selectedDepot.label : "";

    const updated = subDepotsList.map((sd) =>
      sd.subDepotId === data.subDepotId ? { ...sd, depotName, ...form } : sd,
    );
    saveSubDepots(updated);
    window.dispatchEvent(new Event("mptbc_sub_depot_changed"));
    ToastService.success("Sub Depot updated successfully");
    onSave();
  };

  return (
    <SubDepotForm
      fetchData={data}
      onSubmit={handleSubmit}
      onCancel={onSave}
      isEditMode
    />
  );
}
