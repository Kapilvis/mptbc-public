import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveBloodGroupsQuery } from "../master/blood-group/queries";

export default function SelectBloodGroup<T extends FieldValues>({
  label = "Blood Group",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveBloodGroupsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="bloodGroupId"
      placeholder="Select Blood Group"
      label={label}
      {...props}
    />
  );
}
