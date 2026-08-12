import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useClearFieldOnChange } from "shared/hooks/useClearFieldOnChange";
import { useActiveDistrictsByDivisionQuery } from "../master/district/queries";

export default function SelectDistrict<T extends FieldValues>({
  label = "District",
  divisionId,
  disabled,
  name,
  setValue,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  divisionId?: number;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useActiveDistrictsByDivisionQuery(
    divisionId ?? 0,
  );

  // Skip auto-clear when disabled — the field is controlled by supervising office, not the user
  useClearFieldOnChange(disabled ? undefined : divisionId, name, setValue);

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      label={label}
      textField="name"
      optionValue="districtId"
      placeholder="Select District"
      required
      disabled={disabled || !divisionId || isLoading}
      name={name}
      {...props}
    />
  );
}
