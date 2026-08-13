import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { masterUrls } from "auth/features/master/urls";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Loader } from "shared/components/progress";
import TitleForm from "../components/TitleForm";
import { useTitleQuery, useUpdateTitleMutation } from "../queries";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const titleId = Number(id);
  const navigate = useNavigate();

  const { data: fetchData, isLoading } = useTitleQuery(titleId);
  const { mutateAsync, isPending } = useUpdateTitleMutation(titleId);

  const handleCancel = () => {
    navigate(masterUrls.title.root);
  };

  async function handleSubmit(form: Master.TitleForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Title updated successfully");
        navigate(masterUrls.title.root);
      }
    } catch {
      ToastService.error("Failed to update title");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <Page
      header="Edit Title Details"
      subHeader="Update book title information, parent category mappings, page breakdown, and paper dimensions."
      showHeaderActions
    >
      <Card>
        <TitleForm
          fetchData={fetchData}
          isSaving={isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode
        />
      </Card>
    </Page>
  );
}
