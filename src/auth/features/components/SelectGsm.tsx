import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveGsmsQuery } from "../master/gsm/queries";

export default function SelectGsm<T extends FieldValues>({
  label = "Paper GSM / Type",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveGsmsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="gsmId"
      placeholder="Select Paper GSM / Type"
      label={label}
      {...props}
    />
  );
}
