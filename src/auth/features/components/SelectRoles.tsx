import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveUserRolesQuery } from "../user-management/role/queries";

export default function SelectRoles<T extends FieldValues>({
  label = "Role",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
}) {
  const { data, isLoading } = useActiveUserRolesQuery();
  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={"name"}
      optionValue={"name"}
      label={label}
      placeholder="Select Role"
      {...props}
    />
  );
}
