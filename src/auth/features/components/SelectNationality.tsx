import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveNationalitiesQuery } from "../master/nationality/queries";

export default function SelectNationality<T extends FieldValues>({
  label = "Nationality",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveNationalitiesQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="nationalityId"
      placeholder="Select Nationality"
      label={label}
      {...props}
    />
  );
}
