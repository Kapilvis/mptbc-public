import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useDivisionForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.DivisionForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.DivisionForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function DivisionForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  const { register, handleSubmit, reset } = useDivisionForm(
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
        <TextBox
          label="Division Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Division Name"
        />
        <TextBox
          label="Division Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Division Name (Hindi)"
        />
        <TextBox
          label="Division Code"
          required
          {...register("code")}
          placeholder="Enter Division Code"
        />
        <TextBox
          label="Division Local Government Directory Code"
          {...register("lgdCode")}
          placeholder="Enter Division Local Government Directory Code"
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
