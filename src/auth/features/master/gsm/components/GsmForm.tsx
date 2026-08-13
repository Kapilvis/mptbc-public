import { Button, ButtonPanel } from "shared/components/buttons";
import { NumberBox, TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useGsmForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.GsmForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.GsmForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function GsmForm(props: Props) {
  const { register, handleSubmit, reset } = useGsmForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Paper Type Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Paper Type Name"
        />

        <TextBox
          label="Paper Type Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Paper Type Name (Hindi)"
        />

        <NumberBox
          label="GSM Value"
          subLabel="(g/m²)"
          required
          {...register("gsmValue")}
          placeholder="Enter GSM Value (e.g. 200, 70)"
        />

        <TextBox
          label="Usage"
          required
          {...register("usage")}
          placeholder="Enter Usage (e.g. Printing, Cover)"
        />

        <TextBox
          label="Specification / IS Standard"
          required
          {...register("code")}
          placeholder="Enter Specification Code (e.g. IS-1848)"
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
