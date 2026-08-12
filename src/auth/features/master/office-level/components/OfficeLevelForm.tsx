import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useOfficeLevelForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.OfficeLevelForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.OfficeLevelForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function OfficeLevelForm(props: Props) {
  const { register, handleSubmit, reset } = useOfficeLevelForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Office Level Name"
          subLabel="(In English)"
          placeholder="Enter Office Level Name"
          required
          {...register("name")}
        />
        <TextBox
          label="Office Level Name"
          subLabel="(In Hindi)"
          placeholder="Enter Office Level Name (Hindi)"
          {...register("localName")}
        />
        <TextBox
          label="Office Level Code"
          placeholder="Enter Office Level Code"
          required
          {...register("code")}
        />
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
      </InputPanel>
    </form>
  );
}
