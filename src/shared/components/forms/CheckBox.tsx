import { Checkbox } from "primereact/checkbox";
import { Controller, type FieldValues } from "react-hook-form";
import "./CheckBox.css";
import InputBlock from "./InputBlock";

interface CheckBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

function InnerCheckBox({
  id,
  name,
  value,
  checked,
  errorMessage,
  label,
  onChange,
  required,
  className,
  subLabel,
  disabled,
  ...rest
}: CheckBoxProps<FieldValues>) {
  const inputId = id ?? name;
  const isChecked = checked !== undefined ? checked : value;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <Checkbox
        inputId={inputId}
        checked={!!isChecked}
        onChange={(e) => onChange?.(e.checked ?? false)}
        invalid={!!errorMessage}
        className={className}
        disabled={disabled}
        {...rest}
      />
    </InputBlock>
  );
}

export default function CheckBox<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: CheckBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerCheckBox
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => (
        <InnerCheckBox
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
          {...field}
        />
      )}
    />
  );
}
