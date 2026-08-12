import { Checkbox as PrimeCheckbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Controller, type FieldValues } from "react-hook-form";

import "./DropDownList.css";
import InputBlock from "./InputBlock";

interface DefaultProps<TData> {
  defaultValue?: TData;
}

interface InnerDropDownProps<TData, TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  data?: TData[];
  value?: TData | string | number | null;
  textField?: keyof TData;
  valueField?: keyof TData;
  onChange?: (value: TData | string | number | null) => void;
  required?: boolean;
  defaultOptionText?: string;
  filter?: boolean;
  appendTo?: "self" | HTMLElement | (() => HTMLElement) | undefined | null;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  optionValue?: string;
  onSelectionChange?: (value: string | number | null) => void;
}

interface DropDownProps<TData, TForm extends FieldValues>
  extends InnerDropDownProps<TData, TForm>, DefaultProps<TData> {}

function InnerDropDownList<
  TData = Data.DataItem<number>,
  TForm extends FieldValues = FieldValues,
>({
  id,
  name,
  errorMessage,
  label,
  data,
  textField = "text" as keyof TData,

  onChange,
  required,
  defaultOptionText,
  filter = true,
  appendTo = document.body,
  showCheckbox,
  checkboxChecked,
  onCheckboxChange,
  onSelectionChange,
  setValue: _setValue, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: InnerDropDownProps<TData, TForm>) {
  const sortedData = (data ?? []).slice().sort((a, b) =>
    String(a[textField]).localeCompare(String(b[textField]), undefined, {
      sensitivity: "base",
    }),
  );

  const optionsWithDefault = [
    {
      [textField]: defaultOptionText,
      value: null,
    } as TData,
    ...sortedData,
  ];

  return (
    <InputBlock
      id={id}
      label={label}
      errorMessage={errorMessage}
      required={required}
    >
      <div className="p-input-icon-left form-dropdown-wrapper">
        {showCheckbox && (
          <div className="form-dropdown-checkbox-wrapper">
            <PrimeCheckbox
              checked={checkboxChecked ?? false}
              onChange={(e) => onCheckboxChange?.(e.checked ?? false)}
            />
          </div>
        )}
        <Dropdown
          inputId={id ?? name}
          options={!defaultOptionText ? sortedData : optionsWithDefault}
          optionLabel={textField as string}
          onChange={(e) => {
            onChange?.(e.value);
            onSelectionChange?.(e.value);
          }}
          invalid={!!errorMessage}
          className={`w-full form-dropdown-input ${showCheckbox ? "form-dropdown-input-with-checkbox" : ""}`}
          panelClassName="form-dropdown-panel"
          filter={filter}
          appendTo={appendTo}
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

function ControllerDropDownList<
  TForm extends FieldValues,
  TData = Data.DataItem<number>,
>({ name, control, defaultValue, ...rest }: DropDownProps<TData, TForm>) {
  return (
    <Controller
      control={control}
      name={name!}
      render={({ field, formState }) => {
        return (
          <InnerDropDownList<TData, TForm>
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
            onChange={(val) => field.onChange(val)}
            value={field.value ?? defaultValue}
          />
        );
      }}
    />
  );
}

export default function DropDownList<
  TForm extends FieldValues,
  TData = Data.DataItem<number>,
>({ name, control, defaultValue, ...rest }: DropDownProps<TData, TForm>) {
  if (!control || !name) {
    return <InnerDropDownList<TData, TForm> name={name} {...rest} />;
  }

  return (
    <ControllerDropDownList
      name={name}
      control={control}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}
