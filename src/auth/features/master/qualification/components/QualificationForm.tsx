import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import QualificationTypeSelect from "../../../components/SelectQualificationType";
import { useQualificationForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.QualificationForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.QualificationForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function QualificationForm(props: Props) {
  const { register, handleSubmit, reset } = useQualificationForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <QualificationTypeSelect
          label="Qualification Type"
          {...register("qualificationTypeId")}
        />

        <TextBox
          label="Qualification Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Qualification Name"
        />

        <TextBox
          label="Qualification Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Qualification Name (Hindi)"
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
