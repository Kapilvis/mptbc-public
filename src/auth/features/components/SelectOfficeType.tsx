import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useClearFieldOnChange } from "shared/hooks/useClearFieldOnChange";
import { useActiveOfficeTypesByOfficeLevelQuery } from "../master/office-type/queries";

export default function SelectOfficeType<T extends FieldValues>({
  label = "Office Type",
  officeLevelId,
  name,
  setValue,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  officeLevelId?: number;
  required?: boolean;
}) {
  const { data, isLoading } = useActiveOfficeTypesByOfficeLevelQuery(
    officeLevelId ?? 0,
  );

  useClearFieldOnChange(officeLevelId, name, setValue);

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      label={label}
      textField="name"
      optionValue="officeTypeId"
      placeholder="Select Office Type"
      required
      disabled={!officeLevelId || isLoading}
      name={name}
      {...props}
    />
  );
}
