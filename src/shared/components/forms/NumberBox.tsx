import { InputNumber } from "primereact/inputnumber";
import { Controller, type FieldValues } from "react-hook-form";
import InputBlock from "./InputBlock";
import "./NumberBox.css";

interface NumberBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: number;
  mode?: "currency" | "decimal";
  currency?: string;
  onChange?: (value?: number | null) => void;
  min?: number;
  max?: number;
}

function InnerNumberBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  subLabel,
  ...rest
}: NumberBoxProps<FieldValues>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
      subLabel={subLabel}
    >
      <InputNumber
        inputId={inputId}
        value={value}
        onValueChange={(e) => onChange?.(e.value)}
        maxFractionDigits={2}
        {...rest}
      />
    </InputBlock>
  );
}

export default function NumberBox<TForm extends FieldValues>({
  control,
  name,
  errorMessage,
  onChange,
  mode = "decimal", //making default mode decimal
  ...rest
}: NumberBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerNumberBox
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        mode={mode}
        currency="INR"
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: rest.required ? `${rest.label || name} is required` : false,
        min: rest.min,
        max: rest.max,
      }}
      render={({ field, formState }) => (
        <InnerNumberBox
          errorMessage={formState.errors[name]?.message?.toString()}
          {...field}
          {...rest}
        />
      )}
    />
  );
}
