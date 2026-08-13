import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useReligionForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.ReligionForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.ReligionForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ReligionForm(props: Props) {
  const { register, handleSubmit, reset } = useReligionForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Religion Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Religion Name"
        />

        <TextBox
          label="Religion Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Religion Name (Hindi)"
        />

        <TextBox label="Code" {...register("code")} placeholder="Enter Code" />
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
