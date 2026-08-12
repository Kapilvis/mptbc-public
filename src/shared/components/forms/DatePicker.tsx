import type { CalendarProps } from "primereact/calendar";
import { Calendar } from "primereact/calendar";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import "./DatePicker.css";
import InputBlock from "./InputBlock";

const toDate = (val: Date | string | null | undefined): Date | null => {
  if (!val) return null;
  if (val instanceof Date) {
    if (!isNaN(val.getTime()) && val.getFullYear() === 1970) {
      const d = new Date();
      d.setHours(val.getHours(), val.getMinutes(), val.getSeconds(), 0);
      return d;
    }
    return val;
  }

  // Handle time-only strings from backend (e.g., "18:30:45" or "18:30")
  if (typeof val === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(val)) {
    const [hours, minutes, seconds] = val.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, seconds || 0, 0);
    return d;
  }

  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

type DatePickerProps<TForm extends FieldValues> = Controls.InputBlockProps &
  Controls.InputProps & {
    control?: Control<TForm>;
    name?: Path<TForm>;
    value?: Date | string | null;
    onChange?: (value: Date | null) => void;
    label?: string;
    required?: boolean;
    showTime?: boolean;
    timeOnly?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disableFuture?: boolean;
    disablePast?: boolean;
    placeholder?: string;
    disablePreviousMonths?: boolean;
    disableNextMonths?: boolean;
  };

function InnerDatePicker({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  showTime = false,
  timeOnly = false,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  placeholder,
  disablePreviousMonths,
  disableNextMonths,
  ...rest
}: DatePickerProps<FieldValues>) {
  const inputId = id ?? name;
  const displayLabel = required && label ? `${label}` : label;

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const effectiveMinDate = disablePreviousMonths
    ? firstDayOfMonth
    : disablePast
      ? new Date()
      : minDate;

  const effectiveMaxDate = disableNextMonths
    ? lastDayOfMonth
    : disableFuture
      ? new Date()
      : maxDate;

  const handleChange = (
    e: Parameters<NonNullable<CalendarProps["onChange"]>>[0],
  ) => {
    const date = e.value as Date | null | undefined;

    if (!date) {
      onChange?.(null);
      return;
    }

    if (showTime || timeOnly) {
      onChange?.(date);
    } else {
      const normalized = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12,
        0,
        0,
        0,
      );
      onChange?.(normalized);
    }
  };

  return (
    <InputBlock
      label={displayLabel}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
    >
      <Calendar
        inputId={inputId}
        value={toDate(value) ?? undefined}
        onChange={handleChange}
        showIcon={!timeOnly}
        showTime={showTime || timeOnly}
        timeOnly={timeOnly}
        hourFormat="12"
        minDate={effectiveMinDate}
        maxDate={effectiveMaxDate}
        invalid={!!errorMessage}
        placeholder={placeholder}
        dateFormat="dd/mm/yy"
        className="w-full"
        inputClassName="w-full"
        showButtonBar
        touchUI={window.innerWidth < 768}
        {...rest}
      />
    </InputBlock>
  );
}

export default function DatePicker<TForm extends FieldValues>({
  control,
  name,
  errorMessage,
  onChange,
  ...rest
}: DatePickerProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerDatePicker
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
        <InnerDatePicker
          name={field.name}
          value={toDate(field.value) ?? null}
          onChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
        />
      )}
    />
  );
}
