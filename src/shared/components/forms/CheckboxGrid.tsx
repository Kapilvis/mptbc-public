import { Button } from "shared/components/buttons";
import "./CheckboxGrid.css";

export interface CheckboxGridItem {
  label: string;
  value: string;
}

interface CheckboxGridProps {
  title?: string;
  description?: string;
  items: CheckboxGridItem[];
  value: string[];
  onChange: (values: string[]) => void;
  columns?: number;
  saveLabel?: string;
  onSave?: () => void;
  isSaving?: boolean;
  disabled?: boolean;
  saveDisabled?: boolean;
}

export default function CheckboxGrid({
  title,
  description,
  items,
  value,
  onChange,
  saveLabel = "Save",
  onSave,
  isSaving,
  disabled,
  saveDisabled,
}: CheckboxGridProps) {
  const toggle = (itemValue: string) => {
    if (disabled) return;
    const next = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];
    onChange(next);
  };

  return (
    <div className="cbg-root">
      {(title || description) && (
        <div className="cbg-header">
          {title && <h3 className="cbg-title">{title}</h3>}
          {description && <p className="cbg-description">{description}</p>}
        </div>
      )}

      <div className="cbg-grid">
        {items.map((item, index) => {
          const checked = value.includes(item.value);
          // Stagger the items slightly up to a maximum delay so it doesn't take forever
          const delay = Math.min(index * 0.015, 0.4);

          return (
            <label
              key={item.value}
              className={`cbg-item ${checked ? "cbg-item--checked" : ""} ${disabled ? "cbg-item--disabled" : ""}`}
              style={{ animationDelay: `${delay}s` }}
              onClick={() => toggle(item.value)}
            >
              <span className="cbg-label">{item.label}</span>
            </label>
          );
        })}
      </div>

      {onSave && (
        <div className="cbg-footer">
          <Button
            type="button"
            variant="primary"
            size="small"
            label={saveLabel}
            onClick={onSave}
            disabled={saveDisabled}
            isLoading={isSaving}
          />
        </div>
      )}
    </div>
  );
}
