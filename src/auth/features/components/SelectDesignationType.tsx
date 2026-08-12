import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveDesignationTypeQuery } from "../master/designation-type/queries";

export default function SelectDesignationType<T extends FieldValues>({
  label = "Designation Type",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveDesignationTypeQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="designationTypeId"
      placeholder="Select Designation Type"
      label={label}
      {...props}
    />
  );
}
