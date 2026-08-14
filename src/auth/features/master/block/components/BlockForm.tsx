import SelectDistrict from "auth/features/components/SelectDistrict";
import SelectDivision from "auth/features/components/SelectDivision";
import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useBlockForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.BlockForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.BlockForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function BlockForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  const { register, handleSubmit, reset, watch } = useBlockForm(
    props.onSubmit,
    props.fetchData,
  );

  const divisionId = watch("divisionId");

  const handleReset = () => {
    reset();
    setFormKey((prev) => prev + 1);
  };

  return (
    <form onSubmit={handleSubmit} key={formKey}>
      <InputPanel orientation="horizontal">
        <SelectDivision {...register("divisionId")} />
        <SelectDistrict {...register("districtId")} divisionId={divisionId} />

        <TextBox
          label="Block Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Block Name"
        />

        <TextBox
          label="Block Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Block Name (Hindi)"
        />

        <TextBox
          label="Block Code"
          required
          {...register("code")}
          placeholder="Enter Block Code"
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
