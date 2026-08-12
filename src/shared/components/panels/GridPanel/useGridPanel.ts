import { OverlayPanel } from "primereact/overlaypanel";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ViewMode, ViewState } from "./types";

interface UseGridPanelProps<T> {
  mode: "both" | "grid" | "mosaic";
  defaultMode: "grid" | "mosaic";
  toolbarPlacement: "panel" | "page";
  EditForm?: React.ComponentType<{
    data: T;
    onSave: () => void;
  }>;
  onEdit?: (item: T) => void;
}

export function useGridPanel<T>({
  mode,
  defaultMode,
  toolbarPlacement,
  EditForm,
  onEdit,
}: UseGridPanelProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(
    mode === "both" ? defaultMode : (mode as ViewMode),
  );
  const [first, setFirst] = useState(0);

  const [hasBeenViewed, setHasBeenViewed] = useState<{
    grid: boolean;
    mosaic: boolean;
  }>(() => ({
    grid: mode === "grid" || (mode === "both" && defaultMode === "grid"),
    mosaic: mode === "mosaic" || (mode === "both" && defaultMode === "mosaic"),
  }));

  const [pageActionsTarget, setPageActionsTarget] =
    useState<HTMLElement | null>(null);

  const op = useRef<OverlayPanel>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<ViewState>("IDLE");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const isFormOpen = view !== "IDLE";

  /**
   * Find the action slot rendered inside the shared Page header.
   * This only runs when toolbarPlacement is set to "page".
   */
  useEffect(() => {
    if (toolbarPlacement !== "page") {
      setPageActionsTarget(null);
      return;
    }

    const target = document.getElementById("page-header-actions");

    setPageActionsTarget(target);
  }, [toolbarPlacement]);

  // Reset pagination whenever search changes.
  useEffect(() => {
    setFirst(0);
  }, [globalFilter]);

  // Mark view modes as viewed when they are selected
  useEffect(() => {
    setHasBeenViewed((prev) => {
      if (prev[viewMode]) return prev;
      return { ...prev, [viewMode]: true };
    });
  }, [viewMode]);

  const handleViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setFirst(0);
  }, []);

  const handleClose = useCallback(() => {
    op.current?.hide();
    setView("IDLE");
    setSelectedItem(null);
  }, []);

  const openCreate = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setSelectedItem(null);
      setView("ADD");

      op.current?.toggle(event, anchorRef.current ?? event.currentTarget);
    },
    [],
  );

  const openEdit = useCallback(
    (item: T, event?: React.MouseEvent) => {
      if (EditForm) {
        setSelectedItem(item);
        setView("EDIT");

        op.current?.toggle(event ?? null, anchorRef.current);

        return;
      }

      onEdit?.(item);
    },
    [EditForm, onEdit],
  );

  return {
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
  };
}
