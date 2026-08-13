import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useMediumForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.MediumForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.MediumForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function MediumForm(props: Props) {
  const { register, handleSubmit, reset } = useMediumForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Medium Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Medium Name"
        />

        <TextBox
          label="Medium Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Medium Name (Hindi)"
        />

        <TextBox
          label="Medium Code"
          required
          {...register("code")}
          placeholder="Enter Medium Code"
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
