import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import OfficeLevelSelect from "../../../components/SelectOfficeLevel";
import { useOfficeTypeForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.OfficeTypeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.OfficeTypeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function OfficeTypeForm(props: Props) {
  const { register, handleSubmit, reset } = useOfficeTypeForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <OfficeLevelSelect
          label="Office Level"
          {...register("officeLevelId")}
        />

        <TextBox
          label="Office Type Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Office Type Name"
        />

        <TextBox
          label="Office Type Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Office Type Name (Hindi)"
        />

        <TextBox
          label="Office Type Code"
          required
          {...register("code")}
          placeholder="Enter Office Type Code"
        />
      </InputPanel>
      <ButtonPanel>
        <Button
          label={props.isEditMode ? "Update" : "Save"}
          type="submit"
          isLoading={props.isSaving}
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
