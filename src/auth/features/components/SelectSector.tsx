import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useClearFieldOnChange } from "shared/hooks/useClearFieldOnChange";
import { useActiveSectorsByProjectQuery } from "../master/sector/queries";

export default function SelectSector<T extends FieldValues>({
  label = "Sector",
  projectId,
  disabled,
  name,
  setValue,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  projectId?: number;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useActiveSectorsByProjectQuery(projectId ?? 0);

  // Skip auto-clear when disabled — the field is controlled by supervising office, not the user
  useClearFieldOnChange(disabled ? undefined : projectId, name, setValue);

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      label={label}
      textField="name"
      optionValue="sectorId"
      placeholder="Select Sector"
      required
      disabled={disabled || !projectId || isLoading}
      name={name}
      {...props}
    />
  );
}
