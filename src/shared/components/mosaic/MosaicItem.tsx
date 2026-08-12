import { memo } from "react";
import { Button } from "shared/components/buttons";
import "./MosaicItem.css";

interface MosaicItemProps<T> {
  item: T;
  isFormOpen: boolean;
  renderContent: (item: T) => React.ReactNode;
  onEdit: (item: T, e: React.MouseEvent) => void;
  showEdit?: boolean;
  onView?: (item: T, e: React.MouseEvent) => void;
  showView?: boolean;
  renderFooterActions?: (item: T) => React.ReactNode;
  isEditDisabled?: (item: T) => boolean;
}

function MosaicItemInner<T>({
  item,
  isFormOpen,
  renderContent,
  onEdit,
  showEdit = true,
  onView,
  showView = false,
  renderFooterActions,
  isEditDisabled,
}: MosaicItemProps<T>) {
  return (
    <div className="mosaic-item">
      <div className="mosaic-item-content">{renderContent(item)}</div>
      {(showEdit || showView || renderFooterActions) && (
        <div className="mosaic-item-footer">
          {renderFooterActions?.(item)}
          {showView && onView && (
            <Button icon="eye" size="small" onClick={(e) => onView(item, e)} />
          )}
          {showEdit && (
            <Button
              icon="pencil"
              size="small"
              onClick={(e) => onEdit(item, e)}
              disabled={isFormOpen || isEditDisabled?.(item)}
            />
          )}
        </div>
      )}
    </div>
  );
}

const MosaicItem = memo(MosaicItemInner) as typeof MosaicItemInner;
export default MosaicItem;
