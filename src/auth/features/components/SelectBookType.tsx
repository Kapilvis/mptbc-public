import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveBookTypesQuery } from "../master/book-type/queries";

export default function SelectBookType<T extends FieldValues>({
  label = "Book Type",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveBookTypesQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="bookTypeId"
      placeholder="Select Book Type"
      label={label}
      {...props}
    />
  );
}
