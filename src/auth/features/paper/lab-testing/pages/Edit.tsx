import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Loader } from "shared/components/progress";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  usePaperLabTestingQuery,
  useUpdatePaperLabTestingMutation,
} from "../queries";
import LabTestingForm from "../components/LabTestingForm";
import type { PaperLabTestingRecord } from "../data";

export default function EditPaperLabTesting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = usePageTitle();

  const { data: initialData, isLoading } = usePaperLabTestingQuery(
    id || "",
    !!id,
  );
  const { mutateAsync: updateRecord, isPending } =
    useUpdatePaperLabTestingMutation(id || "");

  const handleSubmit = async (data: PaperLabTestingRecord) => {
    try {
      await updateRecord(data);
      ToastService.success("Paper lab testing record updated successfully!");
      navigate("/paper/lab-testing");
    } catch {
      ToastService.error("Failed to update paper lab testing record");
    }
  };

  if (isLoading) return <Loader type="relative" />;

  return (
    <Page
      header={`${pageTitle} - Edit Test Record`}
      subHeader="Modify agency sample information and laboratory test results."
    >
      <LabTestingForm
        mode="edit"
        onSubmit={handleSubmit}
        initialData={initialData}
        isSaving={isPending}
        onCancel={() => navigate("/paper/lab-testing")}
      />
    </Page>
  );
}
