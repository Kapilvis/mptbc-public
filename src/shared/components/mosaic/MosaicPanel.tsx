import { DataView } from "primereact/dataview";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useCallback, useMemo, useRef, useState } from "react";
import { AddButton } from "shared/components/buttons/AddButton";
import { CloseButton } from "shared/components/buttons/CloseButton";
import { Loader } from "shared/components/progress";
import { usePageTitle } from "shared/hooks/usePageTitle";
import MosaicItem from "./MosaicItem";
import "./MosaicPanel.css";

interface MosaicPanelProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  renderContent: (item: T) => React.ReactNode;
  CreateForm?: React.ComponentType<{ onSave: () => void }>;
  EditForm?: React.ComponentType<{ data: T; onSave: () => void }>;
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  renderFooterActions?: (item: T) => React.ReactNode;
  isEditDisabled?: (item: T) => boolean;
  /** Custom message shown when data is empty */
  emptyMessage?: string;
  /** When provided, MosaicPanel uses this value for filtering and hides its own search bar */
  searchTerm?: string;
  /** Controlled pagination — when provided, the DataView paginator is suppressed */
  first?: number;
  rows?: number;
  onPage?: (first: number) => void;
}

export function MosaicPanel<T>({
  data,
  searchKeys,
  renderContent,
  CreateForm,
  EditForm,
  isLoading,
  onEdit,
  onView,
  renderFooterActions,
  isEditDisabled,
  emptyMessage,
  searchTerm: externalSearchTerm,
  first: externalFirst,
  rows: externalRows,
  onPage: externalOnPage,
}: MosaicPanelProps<T>) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [view, setView] = useState<"IDLE" | "CREATE" | "EDIT">("IDLE");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [internalFirst, setInternalFirst] = useState(0);
  const op = useRef<OverlayPanel>(null);
  const pageTitle = usePageTitle();

  // Use external search if provided (controlled), otherwise internal
  const isSearchControlled = externalSearchTerm !== undefined;
  const searchTerm = isSearchControlled
    ? externalSearchTerm
    : internalSearchTerm;

  // Use external pagination if provided (controlled), otherwise internal
  const isPaginationControlled = externalFirst !== undefined;
  const first = isPaginationControlled ? externalFirst : internalFirst;
  const rows = externalRows ?? 15;

  const isFormOpen = view !== "IDLE";

  const handleClose = () => {
    op.current?.hide();
    setView("IDLE");
    setSelectedItem(null);
  };

  const openCreate = (e: React.MouseEvent) => {
    setSelectedItem(null);
    setView("CREATE");
    op.current?.toggle(e);
  };

  const openEdit = useCallback(
    (item: T, e: React.MouseEvent) => {
      if (EditForm) {
        setSelectedItem(item);
        setView("EDIT");
        op.current?.toggle(e);
      } else if (onEdit) {
        onEdit(item);
      }
    },
    [EditForm, onEdit],
  );

  const handleView = useCallback(
    (item: T) => {
      onView?.(item);
    },
    [onView],
  );

  const displayData = useMemo(() => {
    if (!searchTerm.trim() || !searchKeys || searchKeys.length === 0) {
      return data;
    }
    return data.filter((item: T) =>
      searchKeys.some((k) =>
        String(item[k] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm, searchKeys]);

  const emptyMessageContent = searchTerm
    ? `No results found for "${searchTerm}"`
    : (emptyMessage ?? "No records found");

  const itemTemplate = useCallback(
    (item: T) => {
      return (
        <MosaicItem
          item={item}
          isFormOpen={isFormOpen}
          renderContent={renderContent}
          onEdit={openEdit}
          showEdit={!!(EditForm || onEdit)}
          onView={handleView}
          showView={!!onView}
          renderFooterActions={renderFooterActions}
          isEditDisabled={isEditDisabled}
        />
      );
    },
    [
      isFormOpen,
      renderContent,
      openEdit,
      handleView,
      onView,
      renderFooterActions,
      isEditDisabled,
    ],
  );

  const handlePage = (f: number) => {
    if (isPaginationControlled) {
      externalOnPage?.(f);
    } else {
      setInternalFirst(f);
    }
  };

  return (
    <div className="mosaic-panel-container">
      {/* Toolbar — only shown when not controlled by a parent */}
      {!isSearchControlled && (
        <div className="mosaic-panel-toolbar">
          <IconField
            iconPosition="right"
            className="mosaic-search-icon-wrapper"
          >
            <InputText
              value={internalSearchTerm}
              placeholder="Search..."
              className="mosaic-search-input w-full"
              onChange={(e) => {
                setInternalSearchTerm(e.target.value);
                setInternalFirst(0);
              }}
            />
            <InputIcon className="pi pi-search mosaic-search-icon" />
          </IconField>
          <div className="mosaic-panel-actions">
            {CreateForm && (
              <AddButton
                onClick={openCreate}
                disabled={isFormOpen && view !== "CREATE"}
              />
            )}
          </div>
        </div>
      )}

      {/* Overlay Form Panel */}
      <OverlayPanel
        ref={op}
        onHide={() => setView("IDLE")}
        dismissable={false}
        showCloseIcon={false}
        className="mosaic-overlay"
      >
        <div className="mosaic-overlay-inner">
          <div className="mosaic-overlay-close">
            <CloseButton onClick={handleClose} />
          </div>
          {view === "CREATE" && CreateForm && (
            <>
              <h1 className="mosaic-overlay-heading">{`Create ${pageTitle}`}</h1>
              <CreateForm onSave={handleClose} />
            </>
          )}
          {view === "EDIT" && EditForm && selectedItem && (
            <>
              <h1 className="mosaic-overlay-heading">{`Edit ${pageTitle}`}</h1>
              <EditForm data={selectedItem} onSave={handleClose} />
            </>
          )}
        </div>
      </OverlayPanel>

      {/* Cards */}
      <div className="mosaic-list-wrapper">
        {isLoading && <Loader type="relative" />}
        <DataView
          value={displayData}
          layout="grid"
          paginator={displayData.length > 0}
          rows={rows}
          first={first}
          onPage={(e) => handlePage(e.first ?? 0)}
          emptyMessage={emptyMessageContent}
          itemTemplate={itemTemplate}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          pt={{
            root: { className: "mosaic-dataview-root" },
            content: { className: "mosaic-dataview-content" },
            grid: { className: "mosaic-dataview-grid" },
            paginator: {
              root: { className: "mosaic-paginator-root" },
              pageButton: ({ context }: { context: { active: boolean } }) => ({
                className: `mosaic-page-btn ${context.active ? "mosaic-page-btn-active" : "mosaic-page-btn-inactive"}`,
              }),
              pages: { className: "mosaic-paginator-pages" },
              prevPageButton: { className: "mosaic-nav-btn" },
              nextPageButton: { className: "mosaic-nav-btn" },
              firstPageButton: { className: "mosaic-nav-btn" },
              lastPageButton: { className: "mosaic-nav-btn" },
            },
          }}
        />
      </div>
    </div>
  );
}
