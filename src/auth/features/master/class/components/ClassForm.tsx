import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useClassForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.ClassForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.ClassForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ClassForm(props: Props) {
  const { register, handleSubmit, reset } = useClassForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Class Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Class Name"
        />

        <TextBox
          label="Class Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Class Name (Hindi)"
        />

        <TextBox
          label="Class Code"
          required
          {...register("code")}
          placeholder="Enter Class Code"
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
