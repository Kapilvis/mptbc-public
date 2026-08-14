import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useClearFieldOnChange } from "shared/hooks/useClearFieldOnChange";
import { useActiveBlocksByDistrictQuery } from "../master/block/queries";

export default function SelectBlock<T extends FieldValues>({
  label = "Block",
  districtId,
  disabled,
  name,
  setValue,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  districtId?: number;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useActiveBlocksByDistrictQuery(districtId ?? 0);

  useClearFieldOnChange(disabled ? undefined : districtId, name, setValue);

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      label={label}
      textField="name"
      optionValue="blockId"
      placeholder="Select Block"
      disabled={
        disabled || (districtId !== undefined && !districtId) || isLoading
      }
      name={name}
      {...props}
    />
  );
}
