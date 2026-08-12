import { type FormHTMLAttributes, type ReactNode } from "react";
import "./MosaicForm.css";

interface MosaicFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  gap?: string;
  title?: string;
}

export default function MosaicForm({
  children,
  className = "",
  gap = "3",
  title,
  ...rest
}: MosaicFormProps) {
  // Translate the logical Tailwind spacing units to rem safely
  const gapStyle = gap ? `${Number(gap) * 0.25}rem` : undefined;

  return (
    <form
      {...rest}
      className={`mosaic-form ${className}`}
      style={{ gap: gapStyle, ...rest.style }}
    >
      {title && (
        <div className="mosaic-form__title">
          <strong>{title}</strong>
        </div>
      )}
      {children}
    </form>
  );
}
