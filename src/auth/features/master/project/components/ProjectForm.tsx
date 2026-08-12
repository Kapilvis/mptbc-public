import SelectDistrict from "auth/features/components/SelectDistrict";
import SelectDivision from "auth/features/components/SelectDivision";
import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useProjectForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.ProjectForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.ProjectForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ProjectForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  const { register, handleSubmit, reset, watch } = useProjectForm(
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
          label="Project Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Project Name"
        />
        <TextBox
          label="Project Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Project Name (Hindi)"
        />
        <TextBox
          label="Project Code"
          required
          {...register("code")}
          placeholder="Enter Project Code"
        />
        <TextBox
          label="Project Local Government Directory Code"
          required
          {...register("lgdCode")}
          placeholder="Enter Project Local Government Directory Code"
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
