import React from "react";
import "./FormDivider.css";

interface Props {
  title: string;
  icon?: string;
  className?: string;
}

export default function FormDivider({
  title,
  icon,
  className = "",
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div
      className={`form-subsection ${children ? "" : "no-content"} ${className}`}
    >
      <div className="form-subsection-header">
        {icon && <i className={`pi pi-${icon} form-subsection-icon`} />}
        <span className="form-subsection-title">{title}</span>
      </div>
      {children && <div className="form-subsection-content">{children}</div>}
    </div>
  );
}
