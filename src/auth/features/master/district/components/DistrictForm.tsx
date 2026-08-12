import SelectDivision from "auth/features/components/SelectDivision";
import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useDistrictForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.DistrictForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.DistrictForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DistrictForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  const { register, handleSubmit, reset } = useDistrictForm(
    props.onSubmit,
    props.fetchData,
  );

  const handleReset = () => {
    reset();
    setFormKey((prev) => prev + 1);
  };

  return (
    <form onSubmit={handleSubmit} key={formKey}>
      <InputPanel orientation="horizontal">
        <SelectDivision {...register("divisionId")} />

        <TextBox
          label="District Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter District Name"
        />
        <TextBox
          label="District Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter District Name (Hindi)"
        />
        <TextBox
          label="District Code"
          required
          {...register("code")}
          placeholder="Enter District Code"
        />
        <TextBox
          label="District Local Government Directory Code"
          {...register("lgdCode")}
          placeholder="Enter District Local Government Directory Code"
        />
      </InputPanel>

      <ButtonPanel>
        <Button
          label={props.isEditMode ? "Update" : "Save"}
          type="submit"
          isLoading={props.isSaving}
          icon="save"
        />
        <Button
          type="button"
          label={props.isEditMode ? "Reset" : "Clear"}
          icon="refresh"
          isLoading={props.isSaving}
          onClick={handleReset}
        />
      </ButtonPanel>
    </form>
  );
}
