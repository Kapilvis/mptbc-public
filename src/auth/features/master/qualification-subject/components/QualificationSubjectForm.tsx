import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import SelectQualification from "../../../components/SelectQualification";
import { useQualificationSubjectForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.QualificationSubjectForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.QualificationSubjectForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function QualificationSubjectForm(props: Props) {
  const { register, handleSubmit, reset } = useQualificationSubjectForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <SelectQualification
          label="Qualification"
          {...register("qualificationId")}
        />

        <TextBox
          label="Qualification Subject Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Qualification Subject Name"
        />

        <TextBox
          label="Qualification Subject Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Qualification Subject Name (Hindi)"
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
