import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import { useQualificationTypeForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.QualificationTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.QualificationTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function QualificationTypeForm(props: Props) {
  const { register, handleSubmit, reset } = useQualificationTypeForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Qualification Type Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Qualification Type Name"
        />

        <TextBox
          label="Qualification Type Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Qualification Type Name (Hindi)"
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
          icon="refresh"
          onClick={() => reset()}
        />
      </ButtonPanel>
    </form>
  );
}
