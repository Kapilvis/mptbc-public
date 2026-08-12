import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useStateForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.StateForm) => Promise<void>;
  fetchData?: Master.StateForm;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function StateForm(props: Props) {
  const [formKey, setFormKey] = useState(0);

  const { register, handleSubmit, reset } = useStateForm(
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
          label="State Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter State Name"
        />
        <TextBox
          label="State Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter State Name (Hindi)"
        />
        <TextBox
          label="State Code"
          required
          {...register("code")}
          placeholder="Enter State Code"
        />
        <TextBox
          label="State Local Government Directory Code"
          {...register("lgdCode")}
          placeholder="Enter State Local Government Directory Code"
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
