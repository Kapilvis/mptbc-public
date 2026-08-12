import { InputSwitch as PrimeInputSwitch } from "primereact/inputswitch";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import "./InputSwitch.css";

export interface InputSwitchProps<TForm extends FieldValues = FieldValues> {
  name: string;
  control?: Control<TForm>;
  checked?: boolean;
  onChange?: (e: { target: { name: string; value: boolean } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  errorMessage?: string;
  id?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: "horizontal" | "vertical";
  labelWidth?: string;
}

export default function InputSwitch<TForm extends FieldValues>({
  name,
  control,
  checked,
  onChange,
  onBlur,
  errorMessage,
  id,
  label,
  className = "",
  disabled = false,
  required = false,
  variant = "horizontal",
}: InputSwitchProps<TForm>) {
  const renderContent = (
    value: boolean | string | undefined,
    curError?: string,
    fieldOnBlur?: () => void,
    fieldOnChange?: (val: boolean) => void,
  ) => {
    const isChecked = value === true || value === "yes";
    const error = curError || errorMessage;
    return (
      <div
        className={`input-switch-container ${
          isChecked ? "is-checked" : ""
        } ${className}`}
      >
        <div
          className={
            variant === "vertical"
              ? "input-switch-layout-vertical"
              : "input-switch-layout-horizontal"
          }
        >
          {label && (
            <label className="input-switch-label">
              {label}{" "}
              {required && <span className="input-switch-required">*</span>}
            </label>
          )}
          <div className="input-switch-control">
            <div className="input-switch-inner">
              <PrimeInputSwitch
                id={id || name}
                name={name}
                checked={isChecked}
                disabled={disabled}
                onBlur={(e) => {
                  fieldOnBlur?.();
                  onBlur?.(e);
                }}
                onChange={(e) => {
                  fieldOnChange?.(e.value);
                  onChange?.({ target: { name, value: e.value } });
                }}
                className={error ? "p-invalid" : ""}
              />
            </div>
            {error && <small className="input-switch-error">{error}</small>}
          </div>
        </div>
      </div>
    );
  };

  if (!control) return renderContent(checked);

  return (
    <Controller
      name={name as Path<TForm>}
      control={control}
      render={({ field, fieldState }) =>
        renderContent(
          field.value,
          fieldState.error?.message,
          field.onBlur,
          field.onChange,
        )
      }
    />
  );
}
