import "./InputPanel.css";

interface Props {
  title?: string;
  description?: string;
  icon?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export default function InputPanel({
  title,
  description,
  icon,
  orientation = "vertical",
  className = "",
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <>
      <div className={`input-panel-container ${className}`}>
        {title && (
          <div className="input-panel-header">
            {icon && (
              <div className="input-panel-icon-wrapper">
                <i className={`pi pi-${icon}`} />
              </div>
            )}
            <div className="input-panel-header-text">
              <h3 className="input-panel-title">{title}</h3>
              {description && (
                <p className="input-panel-description">{description}</p>
              )}
            </div>
          </div>
        )}
        <div className={`input-panel ${orientation}`}>{children}</div>
      </div>
    </>
  );
}
