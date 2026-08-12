import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useClearFieldOnChange } from "shared/hooks/useClearFieldOnChange";
import { useActiveProjectsByDistrictQuery } from "../master/project/queries";

export default function SelectProject<T extends FieldValues>({
  label = "Project",
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
  const { data, isLoading } = useActiveProjectsByDistrictQuery(districtId ?? 0);

  // Skip auto-clear when disabled — the field is controlled by supervising office, not the user
  useClearFieldOnChange(disabled ? undefined : districtId, name, setValue);

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      label={label}
      textField="name"
      optionValue="projectId"
      placeholder="Select Project"
      required
      disabled={disabled || !districtId || isLoading}
      name={name}
      {...props}
    />
  );
}
