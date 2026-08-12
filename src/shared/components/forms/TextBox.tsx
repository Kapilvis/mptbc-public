import { InputText } from "primereact/inputtext";
import type { KeyFilterType } from "primereact/keyfilter";
import { Controller, type FieldValues } from "react-hook-form";
import InputBlock from "./InputBlock";
import "./TextBox.css";

const DANGEROUS_CHARS_REGEX = /[<>="'`]/g;
const CSV_DANGEROUS_START_REGEX = /^[=+\-@\t\r]/;

interface TextBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  className?: string;
  maxLength?: number;
  minLength?: number;
  keyfilter?: KeyFilterType;
  blockDangerousChars?: boolean;
  preventCsvInjection?: boolean;
}
function InnerTextBox<TForm extends FieldValues>({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  icon,
  className,
  subLabel,
  iconPosition = "left",
  maxLength,
  minLength,
  ...rest
}: TextBoxProps<TForm>) {
  const inputId = id ?? name;
  const iconClass = icon
    ? icon.startsWith("pi ")
      ? icon
      : `pi pi-${icon}`
    : undefined;

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      subLabel={subLabel}
      required={required}
    >
      <div
        className="w-full"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {iconClass && (
          <div className={`textbox-icon-container icon-${iconPosition}`}>
            <i className={iconClass} />
          </div>
        )}
        <InputText
          type="text"
          id={inputId}
          value={value || ""}
          keyfilter={rest.keyfilter}
          onChange={(e) => {
            let val = e.target.value;
            if (rest.blockDangerousChars !== false) {
              val = val.replace(DANGEROUS_CHARS_REGEX, "");
            }
            if (rest.preventCsvInjection !== false) {
              if (CSV_DANGEROUS_START_REGEX.test(val)) {
                return;
              }
            }

            onChange?.(val);
          }}
          invalid={!!errorMessage}
          className={`${className ? className + " " : ""}w-full`}
          maxLength={maxLength}
          minLength={minLength}
          style={{
            paddingLeft: icon && iconPosition === "left" ? "3rem" : "1rem",
            paddingRight: icon && iconPosition === "right" ? "3rem" : "1rem",
            width: "100%",
            ...rest.style,
          }}
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

export default function TextBox<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: TextBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerTextBox<TForm>
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        {...rest}
        className="w-full"
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: rest.required ? `${rest.label || name} is required` : false,
        maxLength: rest.maxLength,
        minLength: rest.minLength,
      }}
      render={({ field, formState }) => (
        <InnerTextBox<TForm>
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
          {...field}
        />
      )}
    />
  );
}
