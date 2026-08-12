import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveOfficeLevelsQuery } from "../master/office-level/queries";

export default function SelectOfficeLevel<T extends FieldValues>({
  label = "Office Level",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveOfficeLevelsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="officeLevelId"
      placeholder="Select Office Level"
      label={label}
      {...props}
    />
  );
}
