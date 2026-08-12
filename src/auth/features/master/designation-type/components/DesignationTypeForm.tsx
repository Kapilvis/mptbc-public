import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import { useDesignationTypeForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.DesignationTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.DesignationTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DesignationTypeForm(props: Props) {
  const { register, handleSubmit, reset } = useDesignationTypeForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Designation Type Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Designation Type Name"
        />

        <TextBox
          label="Designation Type Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Designation Type Name (Hindi)"
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
