import { InputTextarea } from "primereact/inputtextarea";
import { Controller, type FieldValues } from "react-hook-form";
import InputBlock from "./InputBlock";

interface TextAreaProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
}

function InnerTextArea<TForm extends FieldValues>({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  subLabel,
  rows = 3,
  cols,
  autoResize = false,
  ...rest
}: TextAreaProps<TForm>) {
  const inputId = id ?? name;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <InputTextarea
        id={inputId}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        cols={cols}
        autoResize={autoResize}
        invalid={!!errorMessage}
        className="w-full"
        style={rest.style}
        placeholder={rest.placeholder}
        disabled={rest.disabled}
      />
    </InputBlock>
  );
}

export default function TextArea<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: TextAreaProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerTextArea<TForm>
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
      rules={{
        required: rest.required ? `${rest.label || name} is required` : false,
      }}
      render={({ field, formState }) => (
        <InnerTextArea<TForm>
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
          {...field}
        />
      )}
    />
  );
}
