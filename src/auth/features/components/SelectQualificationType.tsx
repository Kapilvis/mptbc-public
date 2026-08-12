import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveQualificationTypeQuery } from "../master/qualification-type/queries";

export default function SelectQualificationType<T extends FieldValues>({
  label = "Qualification Type",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveQualificationTypeQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="qualificationTypeId"
      placeholder="Select Qualification Type"
      label={label}
      {...props}
    />
  );
}
