import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useCasteForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.CasteForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.CasteForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function CasteForm(props: Props) {
  const { register, handleSubmit, reset } = useCasteForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Caste Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Caste Name"
        />

        <TextBox
          label="Caste Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Caste Name (Hindi)"
        />
      </InputPanel>
      <ButtonPanel>
        <Button
          label={props.isEditMode ? "Update" : "Save"}
          type="submit"
          isLoading={props.isSaving}
          disabled={props.isSaving}
          icon="pi pi-save"
        />

        <Button
          type="button"
          label={props.isEditMode ? "Reset" : "Clear"}
          icon="pi pi-refresh"
          onClick={() => reset()}
        />
      </ButtonPanel>
    </form>
  );
}
