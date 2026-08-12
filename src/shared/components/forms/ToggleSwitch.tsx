import { Controller, type FieldValues } from "react-hook-form";
import "./ToggleSwitch.css";

interface ToggleSwitchProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

function InnerToggleSwitch({
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
}: ToggleSwitchProps<FieldValues>) {
  const inputId = id ?? name;
  const isChecked = checked !== undefined ? checked : value;

  return (
    <div
      className={`toggle-switch-container ${className || ""} ${disabled ? "disabled" : ""}`}
    >
      <div className="toggle-switch-info">
        <label htmlFor={inputId} className="toggle-switch-label">
          {label}
          {required && <span className="toggle-switch-required">*</span>}
        </label>
        {subLabel && <span className="toggle-switch-sublabel">{subLabel}</span>}
      </div>
      <button
        id={inputId}
        type="button"
        role="switch"
        aria-checked={isChecked}
        className={`toggle-switch-pill ${isChecked ? "active" : ""}`}
        onClick={() => !disabled && onChange?.(!isChecked)}
        disabled={disabled}
      >
        <span className="toggle-switch-handle" />
      </button>
      {errorMessage && (
        <span className="toggle-switch-error">{errorMessage}</span>
      )}
    </div>
  );
}

export default function ToggleSwitch<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: ToggleSwitchProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerToggleSwitch
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
        <InnerToggleSwitch
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}
