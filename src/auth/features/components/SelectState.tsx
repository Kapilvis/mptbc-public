import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveStatesQuery } from "../master/state/queries";

export default function SelectState<T extends FieldValues>({
  label = "State",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
}) {
  const { data, isLoading } = useActiveStatesQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={"name"}
      optionValue={"stateId"}
      label={label}
      placeholder="Select State"
      {...props}
    />
  );
}
