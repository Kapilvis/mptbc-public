import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveQualificationsQuery } from "../master/qualification/queries";

export default function SelectQualification<T extends FieldValues>({
  label = "Qualification",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveQualificationsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="qualificationId"
      placeholder="Select Qualification"
      label={label}
      {...props}
    />
  );
}
