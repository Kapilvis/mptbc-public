import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveDesignationsQuery } from "../master/designation/queries";

export default function SelectDesignation<T extends FieldValues>({
  label = "Designation",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveDesignationsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="designationId"
      placeholder="Select Designation"
      label={label}
      {...props}
    />
  );
}
