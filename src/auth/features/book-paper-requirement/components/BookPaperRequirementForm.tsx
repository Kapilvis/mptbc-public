import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox, NumberBox, DropDownList } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";

interface Props {
  register: (key: keyof BookPaperRequirement.Form) => {
    control: Control<BookPaperRequirement.Form>;
    name: keyof BookPaperRequirement.Form;
    setValue: UseFormSetValue<BookPaperRequirement.Form>;
  };
  gsmOptions: BookPaperRequirement.GsmOption[];
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function BookPaperRequirementForm({
  register,
  gsmOptions,
  onSubmit,
  onReset,
  isSaving = false,
  isEditMode = false,
}: Props) {
  const mappedGsmOptions = useMemo(() => {
    return gsmOptions.map((g) => ({
      ...g,
      displayText: `${g.title} (Ream W. ${g.reamWeight})`,
    }));
  }, [gsmOptions]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputPanel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextBox
            label="Title"
            required
            {...register("title")}
            placeholder="Enter Book Title (e.g., भाषा भारती - 1)"
          />
          <NumberBox
            label="Number of Books"
            required
            {...register("numberOfBooks")}
            placeholder="Enter Number of Books"
            min={1}
          />
          <NumberBox
            label="Pages (Single Book)"
            required
            {...register("pagesPerBook")}
            placeholder="Enter Pages in a Single Book"
            min={1}
          />
          <DropDownList
            label="GSM for Pages"
            required
            {...register("pagesGsmId")}
            data={mappedGsmOptions}
            textField="displayText"
            optionValue="gsmId"
            defaultOptionText="-- Select Pages GSM --"
          />
          <DropDownList
            label="GSM for Cover Pages"
            required
            {...register("coverGsmId")}
            data={mappedGsmOptions}
            textField="displayText"
            optionValue="gsmId"
            defaultOptionText="-- Select Cover GSM --"
          />
        </div>
      </InputPanel>

      <ButtonPanel>
        <Button
          label={isEditMode ? "Update" : "Save"}
          type="submit"
          isLoading={isSaving}
          disabled={isSaving}
          icon="pi pi-save"
        />
        <Button
          type="button"
          label="Reset"
          icon="pi pi-refresh"
          onClick={onReset}
          disabled={isSaving}
        />
      </ButtonPanel>
    </form>
  );
}
