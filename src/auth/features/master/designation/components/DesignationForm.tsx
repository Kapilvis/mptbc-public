import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import { useDesignationForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.DesignationForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.DesignationForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DesignationForm(props: Props) {
  const { register, handleSubmit, reset } = useDesignationForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Designation Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Designation Name"
        />
        <TextBox
          label="Designation Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Designation Name (Hindi)"
        />
        <TextBox
          label="Designation Code"
          required
          {...register("code")}
          placeholder="Enter Designation Code"
          maxLength={2}
        />
      </InputPanel>

      <ButtonPanel>
        <Button
          type="submit"
          label={props.isEditMode ? "Update" : "Save"}
          isLoading={props.isSaving}
          disabled={props.isSaving}
          icon="save"
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
