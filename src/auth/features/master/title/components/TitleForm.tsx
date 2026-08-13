import {
  SelectBookType,
  SelectClass,
  SelectGsm,
  SelectMedium,
} from "auth/features/components";
import { Button, ButtonPanel } from "shared/components/buttons";
import { NumberBox, TextBox } from "shared/components/forms";
import { FormDivider } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useTitleForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.TitleForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.TitleForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export default function TitleForm(props: Props) {
  const { register, handleSubmit, reset, control } = useTitleForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Title Info - Row 1 (3 items) */}
      <InputPanel orientation="horizontal">
        <TextBox
          label="Title Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Title Name"
        />

        <TextBox
          label="Title Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Title Name (Hindi)"
        />

        <TextBox
          label="Title Code"
          required
          {...register("code")}
          placeholder="Enter Title Code"
        />
      </InputPanel>

      <FormDivider title="Parent Categories" />

      {/* Parent Masters - Row 2 (3 items) */}
      <InputPanel orientation="horizontal">
        <SelectClass name="classId" control={control} label="Class" />

        <SelectBookType name="bookTypeId" control={control} label="Book Type" />

        <SelectMedium name="mediumId" control={control} label="Medium" />
      </InputPanel>

      <FormDivider title="Page Breakdown & GSM Specifications" />

      {/* Pages and GSM - Row 3 (3 items) */}
      <InputPanel orientation="horizontal">
        <NumberBox
          label="Inner Pages"
          required
          {...register("innerPages")}
          placeholder="e.g. 120"
        />

        <SelectGsm name="innerGsmId" control={control} label="Inner Page GSM" />

        <NumberBox
          label="Cover Pages"
          required
          {...register("coverPages")}
          placeholder="e.g. 4"
        />

        <SelectGsm name="coverGsmId" control={control} label="Cover Page GSM" />

        <NumberBox
          label="Special Pages"
          {...register("specialPages")}
          placeholder="e.g. 0"
        />

        <SelectGsm
          name="specialGsmId"
          control={control}
          label="Special Page GSM"
        />
      </InputPanel>

      {/* Pages Total - Row 5 */}
      <InputPanel orientation="horizontal">
        <NumberBox
          label="Total Pages"
          subLabel="(Auto Calculated)"
          disabled
          {...register("totalPages")}
        />
      </InputPanel>

      <FormDivider title="Dimensions & Physical Specifications" />

      {/* Dimensions & Weight - Row 6 (3 items) */}
      <InputPanel orientation="horizontal">
        <NumberBox
          label="Book Weight"
          subLabel="(in grams)"
          required
          {...register("weight")}
          placeholder="e.g. 250"
        />

        <NumberBox
          label="Length"
          subLabel="(in mm)"
          required
          {...register("length")}
          placeholder="e.g. 240"
        />

        <NumberBox
          label="Width"
          subLabel="(in mm)"
          required
          {...register("width")}
          placeholder="e.g. 180"
        />

        <NumberBox
          label="Overall Paper Area"
          subLabel="(sq. mtr - Auto Calc)"
          disabled
          {...register("paperArea")}
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

        {props.onCancel && (
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            onClick={props.onCancel}
          />
        )}
      </ButtonPanel>
    </form>
  );
}
