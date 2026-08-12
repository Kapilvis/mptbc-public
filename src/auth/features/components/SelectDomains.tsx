import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useDomainsQuery } from "../user-management/get-domains/queries";

export default function SelectDomain<T extends FieldValues>({
  label = "Domain",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
}) {
  const { data, isLoading } = useDomainsQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={"name"}
      optionValue={"value"}
      label={label}
      placeholder="Select Domain"
      {...props}
    />
  );
}
