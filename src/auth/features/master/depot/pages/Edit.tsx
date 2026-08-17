import { ToastService } from "services";
import DepotForm from "../components/DepotForm";
import { getDepots, saveDepots } from "../data";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.Depot;
  onSave: () => void;
}) {
  const handleSubmit = async (form: Master.DepotForm) => {
    const depotsList = getDepots();
    const updated = depotsList.map((d) =>
      d.depotId === data.depotId ? { ...d, ...form } : d,
    );
    saveDepots(updated);
    window.dispatchEvent(new Event("mptbc_depot_changed"));
    ToastService.success("Depot updated successfully");
    onSave();
  };

  return (
    <DepotForm
      fetchData={data}
      onSubmit={handleSubmit}
      onCancel={onSave}
      isEditMode
    />
  );
}
