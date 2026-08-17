import { ToastService } from "services";
import SubDepotForm from "../components/SubDepotForm";
import { getSubDepots, saveSubDepots, depotOptions } from "../data";

export default function Create({ onSave }: { onSave: () => void }) {
  const handleSubmit = async (form: Master.SubDepotForm) => {
    const subDepotsList = getSubDepots();
    const nextId =
      subDepotsList.length > 0
        ? Math.max(...subDepotsList.map((sd) => sd.subDepotId)) + 1
        : 1;
    const selectedDepot = depotOptions.find((d) => d.value === form.depotId);
    const depotName = selectedDepot ? selectedDepot.label : "";

    const newSubDepot = {
      subDepotId: nextId,
      depotName,
      ...form,
    };
    const updated = [...subDepotsList, newSubDepot];
    saveSubDepots(updated);
    window.dispatchEvent(new Event("mptbc_sub_depot_changed"));
    ToastService.success("Sub Depot created successfully");
    onSave();
  };

  return <SubDepotForm onSubmit={handleSubmit} onCancel={onSave} />;
}
