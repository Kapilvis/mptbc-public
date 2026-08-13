import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveCastesQuery } from "../master/caste/queries";

export default function SelectCaste<T extends FieldValues>({
  label = "Caste",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveCastesQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="casteId"
      placeholder="Select Caste"
      label={label}
      {...props}
    />
  );
}
