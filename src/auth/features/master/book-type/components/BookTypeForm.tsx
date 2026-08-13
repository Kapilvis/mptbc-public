import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useBookTypeForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.BookTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.BookTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function BookTypeForm(props: Props) {
  const { register, handleSubmit, reset } = useBookTypeForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Book Type Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Book Type Name"
        />

        <TextBox
          label="Book Type Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Book Type Name (Hindi)"
        />

        <TextBox
          label="Book Type Code"
          required
          {...register("code")}
          placeholder="Enter Book Type Code"
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
