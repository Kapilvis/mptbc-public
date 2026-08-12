import { Password } from "primereact/password";
import React from "react";
import { Controller, type FieldValues } from "react-hook-form";
import "./PasswordBox.css";

import InputBlock from "./InputBlock";

interface PasswordBoxProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string) => void;
  showsWeakness?: boolean;
  required?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  inputStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

function InnerPasswordBox({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  showsWeakness,
  icon,
  iconPosition = "left",
  ...rest
}: PasswordBoxProps<FieldValues>) {
  const inputId = id ?? name;
  const iconClass = icon
    ? icon.startsWith("pi ")
      ? icon
      : `pi pi-${icon}`
    : undefined;

  return (
    <InputBlock label={label} id={inputId} errorMessage={errorMessage}>
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
          <div className={`passwordbox-icon-container icon-${iconPosition}`}>
            <i className={iconClass} />
          </div>
        )}
        <Password
          inputId={inputId}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          feedback={showsWeakness}
          invalid={!!errorMessage}
          toggleMask={true}
          style={{ width: "100%", display: "block", ...rest.style }}
          inputStyle={{
            paddingLeft: icon && iconPosition === "left" ? "3rem" : "1rem",
            paddingRight: "3rem",
            width: "100%",
            ...rest.inputStyle,
          }}
          className="w-full"
          inputClassName="w-full"
          {...rest}
        />
      </div>
    </InputBlock>
  );
}

export default function PasswordBox<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: PasswordBoxProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerPasswordBox
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
      render={({ field, formState }) => {
        return (
          <InnerPasswordBox
            errorMessage={formState.errors[name]?.message?.toString()}
            {...rest}
            {...field}
          />
        );
      }}
    />
  );
}
