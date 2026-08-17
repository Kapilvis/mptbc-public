export type ViewMode = "grid" | "mosaic";
export type ViewState = "IDLE" | "ADD" | "EDIT";

export interface GridPanelProps<T> extends Controls.GridProps<T> {
  title?: string;
  toolbar?: React.ReactElement;
  searchBox?: boolean;
  searchPlaceholder?: string;
  addButtonLabel?: string;
  toolbarPlacement?: "panel" | "page";
  mode?: "both" | "grid" | "mosaic";
  defaultMode?: "grid" | "mosaic";
  renderContent?: (item: T) => React.ReactNode;
  renderFooterActions?: (item: T) => React.ReactNode;
  isEditDisabled?: (item: T) => boolean;
  CreateForm?: React.ComponentType<{ onSave: () => void }>;
  EditForm?: React.ComponentType<{
    data: T;
    onSave: () => void;
  }>;
  showExport?: boolean;
  exportFilename?: string;
  renderMosaicFooter?: () => React.ReactNode;
}
