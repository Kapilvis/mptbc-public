import { ToastService } from "services";
import DepotForm from "../components/DepotForm";
import { getDepots, saveDepots } from "../data";

export default function Create({ onSave }: { onSave: () => void }) {
  const handleSubmit = async (form: Master.DepotForm) => {
    const depotsList = getDepots();
    const nextId =
      depotsList.length > 0
        ? Math.max(...depotsList.map((d) => d.depotId)) + 1
        : 1;
    const newDepot = {
      depotId: nextId,
      ...form,
    };
    const updated = [...depotsList, newDepot];
    saveDepots(updated);
    window.dispatchEvent(new Event("mptbc_depot_changed"));
    ToastService.success("Depot created successfully");
    onSave();
  };

  return <DepotForm onSubmit={handleSubmit} onCancel={onSave} />;
}
