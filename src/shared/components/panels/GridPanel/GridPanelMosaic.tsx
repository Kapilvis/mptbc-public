import { useCallback } from "react";
import { MosaicCard, MosaicPanel } from "../../mosaic";
import { PAGE_ROWS } from "./constants";

interface GridPanelMosaicProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  globalFilter: string;
  loading?: boolean;
  first: number;
  onPage: (first: number) => void;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  renderContent?: (item: T) => React.ReactNode;
  renderFooterActions?: (item: T) => React.ReactNode;
  isEditDisabled?: (item: T) => boolean;
  emptyMessage?: string;
  columns: Controls.ColumnProps<T>[];
}

export function GridPanelMosaic<T>({
  data,
  searchFields,
  globalFilter,
  loading,
  first,
  onPage,
  onEdit,
  onView,
  renderContent,
  renderFooterActions,
  isEditDisabled,
  emptyMessage,
  columns,
}: GridPanelMosaicProps<T>) {
  const defaultRenderContent = useCallback(
    (item: T): React.ReactNode => {
      const primaryColumn =
        columns.find((column) => column.field) ?? columns[0];
      if (!primaryColumn) return null;

      const secondaryColumns = columns.filter(
        (column) => column.field && column !== primaryColumn,
      );

      const itemRecord = item as Record<string, unknown>;

      return (
        <MosaicCard
          title={String(item[primaryColumn.field as keyof T] ?? "")}
          subTitle={secondaryColumns
            .map((column) => {
              const value = item[column.field as keyof T];

              return value !== undefined && value !== null
                ? `${String(column.header)}: ${String(value)}`
                : "";
            })
            .filter(Boolean)}
          isActive={(itemRecord.isActive ?? itemRecord.status) as boolean}
        />
      );
    },
    [columns],
  );

  return (
    <MosaicPanel
      data={data ?? []}
      searchKeys={searchFields}
      searchTerm={globalFilter}
      isLoading={loading}
      first={first}
      rows={PAGE_ROWS}
      onPage={onPage}
      onEdit={onEdit}
      onView={onView}
      renderFooterActions={renderFooterActions}
      isEditDisabled={isEditDisabled}
      emptyMessage={emptyMessage}
      renderContent={renderContent ?? defaultRenderContent}
    />
  );
}
