import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import BookPaperRequirementForm from "../components/BookPaperRequirementForm";
import {
  getGsmOptions,
  getBookPaperRequirements,
  updateBookPaperRequirement,
  useBookPaperRequirement,
} from "../bookPaperRequirementService";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const { data: gsmOptions = [] } = useQuery({
    queryKey: ["gsm-options"],
    queryFn: getGsmOptions,
  });

  const { data: requirements = [] } = useQuery({
    queryKey: ["book-paper-requirements"],
    queryFn: getBookPaperRequirements,
  });

  const editingItem = requirements.find(
    (r) => r.bookPaperRequirementId === Number(id),
  );

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Omit<
        BookPaperRequirement.Item,
        "bookPaperRequirementId" | "createdOn"
      >;
    }) => updateBookPaperRequirement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-paper-requirements"] });
      ToastService.success("Book paper requirement updated successfully");
      navigate("/book-paper-requirement");
    },
    onError: () => {
      ToastService.error("Failed to update book paper requirement");
    },
  });

  const onSubmit = async (formValues: BookPaperRequirement.Form) => {
    if (!editingItem) return;

    const pagesGsm = gsmOptions.find(
      (g) => g.gsmId === Number(formValues.pagesGsmId),
    );
    const coverGsm = gsmOptions.find(
      (g) => g.gsmId === Number(formValues.coverGsmId),
    );

    if (!pagesGsm || !coverGsm) {
      ToastService.error("Please select valid GSM values");
      return;
    }

    const { innerPaperMt, coverPaperMt } = liveCalculations;

    const payload = {
      title: formValues.title,
      numberOfBooks: Number(formValues.numberOfBooks),
      pagesPerBook: Number(formValues.pagesPerBook),
      pagesGsmId: Number(formValues.pagesGsmId),
      coverGsmId: Number(formValues.coverGsmId),
      pagesGsmName: pagesGsm.title,
      coverGsmName: coverGsm.title,
      innerPaperMt,
      coverPaperMt,
    };

    await updateMutation.mutateAsync({
      id: editingItem.bookPaperRequirementId,
      data: payload,
    });
  };

  const { register, handleSubmit, setValue, liveCalculations } =
    useBookPaperRequirement(onSubmit, gsmOptions);

  useEffect(() => {
    if (editingItem) {
      setValue("title", editingItem.title);
      setValue("numberOfBooks", editingItem.numberOfBooks);
      setValue("pagesPerBook", editingItem.pagesPerBook);
      setValue("pagesGsmId", editingItem.pagesGsmId);
      setValue("coverGsmId", editingItem.coverGsmId);
    }
  }, [editingItem, setValue]);

  const handleReset = () => {
    if (editingItem) {
      setValue("title", editingItem.title);
      setValue("numberOfBooks", editingItem.numberOfBooks);
      setValue("pagesPerBook", editingItem.pagesPerBook);
      setValue("pagesGsmId", editingItem.pagesGsmId);
      setValue("coverGsmId", editingItem.coverGsmId);
    }
  };

  const backButton = (
    <Button
      label="Back"
      icon="pi pi-arrow-left"
      className="p-button-secondary"
      onClick={() => navigate("/book-paper-requirement")}
    />
  );

  if (!editingItem) {
    return (
      <Page header="Edit Book Paper Requirement" showHeaderActions>
        {portalTarget && createPortal(backButton, portalTarget)}
        <Card className="p-6">
          <p className="text-red-500">Record not found</p>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      header="Edit Book Paper Requirement"
      subHeader={`Modify requirements for textbook "${editingItem.title}".`}
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="border border-gray-100 shadow-sm p-4 bg-white">
        <BookPaperRequirementForm
          register={register}
          gsmOptions={gsmOptions}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isSaving={updateMutation.isPending}
          isEditMode={true}
        />
      </Card>
    </Page>
  );
}
