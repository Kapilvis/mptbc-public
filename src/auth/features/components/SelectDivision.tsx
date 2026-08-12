import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveDivisionsQuery } from "../master/division/queries";

export default function SelectDivision<T extends FieldValues>({
  label = "Division",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useActiveDivisionsQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={"name"}
      optionValue={"divisionId"}
      label={label}
      placeholder="Select Division"
      {...props}
    />
  );
}
