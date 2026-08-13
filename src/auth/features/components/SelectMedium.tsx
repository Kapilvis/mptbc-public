import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveMediumsQuery } from "../master/medium/queries";

export default function SelectMedium<T extends FieldValues>({
  label = "Medium",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveMediumsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="mediumId"
      placeholder="Select Medium"
      label={label}
      {...props}
    />
  );
}
