import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useRightsQuery } from "../user-management/get-rights/queries";

export default function SelectRights<T extends FieldValues>({
  label = "Action (Right)",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
}) {
  const { data, isLoading } = useRightsQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={"name"}
      optionValue={"value"}
      label={label}
      placeholder="Select Rights"
      {...props}
    />
  );
}
