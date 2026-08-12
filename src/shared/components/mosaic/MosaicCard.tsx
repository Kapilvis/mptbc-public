import { Button } from "shared/components/buttons";
import InputSwitch from "shared/components/forms/InputSwitch";
import "./MosaicCard.css";

const renderSubtitleItem = (t: string) => {
  if (t.includes(": ")) {
    const parts = t.split(": ");
    const label = parts[0];
    const value = parts.slice(1).join(": ");

    // Map labels to icons
    return (
      <div className="mosaic-card-subtitle-item" key={t}>
        <div className="mosaic-card-subtitle-content">
          <span className="mosaic-card-subtitle-label">{label}:</span>
          <span className="mosaic-card-subtitle-value">{value}</span>
        </div>
      </div>
    );
  }

  // Fallback for non-colon items (e.g. Hindi name translation)
  return (
    <div className="mosaic-card-fallback-wrapper" key={t}>
      <span className="mosaic-card-fallback-badge">
        <i className="pi pi-language mosaic-card-fallback-icon" />
        {t}
      </span>
    </div>
  );
};

export function MosaicCard({
  title,
  subTitle,
  isActive,
  onStatusToggle,
  disabled,
  onDelete,
  children,
}: MosaicCardProps) {
  const subs = Array.isArray(subTitle) ? subTitle : subTitle ? [subTitle] : [];

  return (
    <div className="mosaic-card-inner">
      <div className="mosaic-card-header">
        <div className="mosaic-card-header-content">
          <h3 className="mosaic-card-title" title={title}>
            {title}
          </h3>
          <div className="mosaic-card-subtitle-list">
            {subs.filter(Boolean).length ? (
              subs.filter(Boolean).map((t) => renderSubtitleItem(t))
            ) : (
              <p className="mosaic-card-subtitle opacity-40 italic">—</p>
            )}
          </div>
        </div>

        {onStatusToggle && (
          <div className="mosaic-card-status-toggle">
            <InputSwitch
              name={`status-${title?.replace(/\s+/g, "-").toLowerCase()}`}
              checked={isActive}
              onChange={onStatusToggle}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {children && <div className="mosaic-card-children">{children}</div>}

      {onDelete && (
        <div className="mosaic-card-delete-wrapper">
          <Button
            type="button"
            icon="trash"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            variant="danger"
          />
        </div>
      )}
    </div>
  );
}
