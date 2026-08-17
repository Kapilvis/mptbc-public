import { useCallback } from "react";
import { createPortal } from "react-dom";
import { exportToExcel } from "shared/utils/csvExport";
import "../GridPanel.css";
import { GridPanelList } from "./GridPanelList";
import { GridPanelMosaic } from "./GridPanelMosaic";
import { GridPanelOverlay } from "./GridPanelOverlay";
import { GridPanelToolbar } from "./GridPanelToolbar";
import type { GridPanelProps } from "./types";
import { useGridPanel } from "./useGridPanel";

export default function GridPanel<T>({
  title,
  toolbar,
  searchBox = true,
  searchPlaceholder = "Search...",
  addButtonLabel = "Add",
  toolbarPlacement = "panel",
  mode = "both",
  defaultMode = "grid",
  data,
  renderContent,
  renderFooterActions,
  isEditDisabled,
  CreateForm,
  EditForm,
  showExport = true,
  exportFilename,
  ...gridProps
}: GridPanelProps<T>) {
  const {
    globalFilter,
    setGlobalFilter,
    viewMode,
    handleViewMode,
    first,
    setFirst,
    pageActionsTarget,
    view,
    selectedItem,
    isFormOpen,
    op,
    anchorRef,
    handleClose,
    openCreate,
    openEdit,
    hasBeenViewed,
  } = useGridPanel<T>({
    mode,
    defaultMode,
    toolbarPlacement,
    EditForm,
    onEdit: gridProps.onEdit,
  });

  const handleExport = useCallback(() => {
    if (!data) return;
    const resolvedTitle =
      title ||
      document.querySelector(".page-heading-text h1")?.textContent ||
      "Grid Data";
    const filename = exportFilename || `${resolvedTitle}.xls`;
    exportToExcel(data, gridProps.columns, resolvedTitle, filename);
  }, [data, gridProps.columns, exportFilename, title]);

  const panelActions = (
    <GridPanelToolbar
      toolbar={toolbar}
      mode={mode}
      viewMode={viewMode}
      onViewModeChange={handleViewMode}
      hasCreateForm={!!CreateForm}
      addButtonLabel={addButtonLabel}
      isFormOpen={isFormOpen}
      view={view}
      onCreateClick={openCreate}
      searchBox={searchBox}
      searchPlaceholder={searchPlaceholder}
      globalFilter={globalFilter}
      onSearchChange={setGlobalFilter}
      anchorRef={anchorRef}
      showExport={showExport && !!data && data.length > 0}
      onExportClick={handleExport}
    />
  );

  return (
    <div className="grid-panel">
      {/* Default placement for existing pages */}
      {toolbarPlacement === "panel" && (
        <div className="grid-panel-header">
          {title && <span className="grid-panel-title">{title}</span>}
          {panelActions}
        </div>
      )}

      {/* Move the complete action section into Page header */}
      {toolbarPlacement === "page" &&
        pageActionsTarget &&
        createPortal(panelActions, pageActionsTarget)}

      {/* Unified Overlay Form Panel */}
      <GridPanelOverlay
        op={op}
        view={view}
        selectedItem={selectedItem}
        onClose={handleClose}
        CreateForm={CreateForm}
        EditForm={EditForm}
      />

      {hasBeenViewed.grid && (
        <div style={{ display: viewMode === "grid" ? "block" : "none" }}>
          <GridPanelList
            data={data}
            globalFilter={globalFilter}
            {...gridProps}
            first={first}
            onPage={setFirst}
            onEdit={EditForm || gridProps.onEdit ? openEdit : undefined}
          />
        </div>
      )}

      {hasBeenViewed.mosaic && (
        <div style={{ display: viewMode === "mosaic" ? "block" : "none" }}>
          <GridPanelMosaic
            data={data ?? []}
            searchFields={(gridProps.searchFields as (keyof T)[]) ?? []}
            globalFilter={globalFilter}
            loading={gridProps.loading}
            first={first}
            onPage={setFirst}
            onEdit={EditForm || gridProps.onEdit ? openEdit : undefined}
            onView={gridProps.onView}
            renderContent={renderContent}
            renderFooterActions={renderFooterActions}
            isEditDisabled={isEditDisabled}
            emptyMessage={gridProps.emptyMessage}
            columns={gridProps.columns}
          />
        </div>
      )}
    </div>
  );
}
