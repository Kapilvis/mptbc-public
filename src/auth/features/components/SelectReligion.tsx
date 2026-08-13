import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveReligionsQuery } from "../master/religion/queries";

export default function SelectReligion<T extends FieldValues>({
  label = "Religion",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveReligionsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="religionId"
      placeholder="Select Religion"
      label={label}
      {...props}
    />
  );
}
