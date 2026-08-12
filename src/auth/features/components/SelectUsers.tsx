import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveUsersQuery } from "../user-management/user/queries";

export default function SelectUsers<T extends FieldValues>({
  label = "User",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useActiveUsersQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={"userName"}
      optionValue={"id"}
      label={label}
      placeholder="Select User"
      {...props}
    />
  );
}
