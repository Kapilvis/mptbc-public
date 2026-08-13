import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useNationalityForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.NationalityForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.NationalityForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function NationalityForm(props: Props) {
  const { register, handleSubmit, reset } = useNationalityForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Nationality"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Nationality"
        />

        <TextBox
          label="Nationality"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Nationality (Hindi)"
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
