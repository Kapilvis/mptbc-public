import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveClassesQuery } from "../master/class/queries";

export default function SelectClass<T extends FieldValues>({
  label = "Class",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveClassesQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="classId"
      placeholder="Select Class"
      label={label}
      {...props}
    />
  );
}
