import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveTitlesQuery } from "../master/title/queries";

export default function SelectTitle<T extends FieldValues>({
  label = "Title",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveTitlesQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="titleId"
      placeholder="Select Title"
      label={label}
      {...props}
    />
  );
}
