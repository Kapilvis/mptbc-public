import SelectDistrict from "auth/features/components/SelectDistrict";
import SelectDivision from "auth/features/components/SelectDivision";
import SelectProject from "auth/features/components/SelectProject";
import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useSectorForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.SectorForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.SectorForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SectorForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  const { register, handleSubmit, reset, watch } = useSectorForm(
    props.onSubmit,
    props.fetchData,
  );

  const divisionId = watch("divisionId");
  const districtId = watch("districtId");

  const handleReset = () => {
    reset();
    setFormKey((prev) => prev + 1);
  };

  return (
    <form onSubmit={handleSubmit} key={formKey}>
      <InputPanel orientation="horizontal">
        <SelectDivision {...register("divisionId")} />
        <SelectDistrict {...register("districtId")} divisionId={divisionId} />
        <SelectProject {...register("projectId")} districtId={districtId} />

        <TextBox
          label="Sector Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Sector Name"
        />

        <TextBox
          label="Sector Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Sector Name (Hindi)"
        />

        <TextBox
          label="Sector Code"
          required
          {...register("code")}
          placeholder="Enter Sector Code"
        />

        <TextBox
          label="Sector Local Government Directory Code"
          required
          {...register("lgdCode")}
          placeholder="Enter Sector Local Government Directory Code"
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
