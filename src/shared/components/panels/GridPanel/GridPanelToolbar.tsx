import React from "react";
import { AddButton } from "shared/components/buttons/AddButton";
import { ExportButton } from "shared/components/buttons/ExportButton";
import { TextBox } from "../../forms";
import type { ViewMode, ViewState } from "./types";

interface GridPanelToolbarProps {
  toolbar?: React.ReactElement;
  mode: "both" | "grid" | "mosaic";
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  hasCreateForm: boolean;
  addButtonLabel: string;
  isFormOpen: boolean;
  view: ViewState;
  onCreateClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  searchBox: boolean;
  searchPlaceholder: string;
  globalFilter: string;
  onSearchChange: (value: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  showExport?: boolean;
  onExportClick?: () => void;
}

function GridPanelToolbarInner({
  toolbar,
  mode,
  viewMode,
  onViewModeChange,
  hasCreateForm,
  addButtonLabel,
  isFormOpen,
  view,
  onCreateClick,
  searchBox,
  searchPlaceholder,
  globalFilter,
  onSearchChange,
  anchorRef,
  showExport = false,
  onExportClick,
}: GridPanelToolbarProps) {
  return (
    <div className="grid-panel-toolbar" ref={anchorRef}>
      {mode === "both" && (
        <div className="grid-view-toggle">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            title="Table Grid View"
            aria-label="Show table view"
            aria-pressed={viewMode === "grid"}
          >
            <i className="pi pi-table" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("mosaic")}
            className={`toggle-btn ${viewMode === "mosaic" ? "active" : ""}`}
            title="Mosaic Card View"
            aria-label="Show card view"
            aria-pressed={viewMode === "mosaic"}
          >
            <i className="pi pi-th-large" aria-hidden="true" />
          </button>
        </div>
      )}

      {toolbar}

      {hasCreateForm && (
        <AddButton
          label={addButtonLabel}
          onClick={onCreateClick}
          disabled={isFormOpen && view !== "ADD"}
        />
      )}
      {searchBox && (
        <TextBox
          value={globalFilter}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          icon="search"
          iconPosition="right"
        />
      )}
      {showExport && onExportClick && <ExportButton onClick={onExportClick} />}
    </div>
  );
}

export const GridPanelToolbar = React.memo(
  GridPanelToolbarInner,
) as typeof GridPanelToolbarInner;
