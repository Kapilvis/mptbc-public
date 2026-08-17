import { Column } from "primereact/column";
import { DataTable, type DataTableValueArray } from "primereact/datatable";
import React from "react";
import ButtonColumn from "./ButtonColumn";
import "./Grid.css";

function mapColumns<T>(columns: Controls.ColumnProps<T>[]) {
  return columns.map(({ sortable = true, align, ...column }) => {
    return (
      <Column
        key={column.field as string}
        body={column.cell}
        field={column.field as string}
        header={column.header}
        footer={column.footer}
        className={
          column.width
            ? `col-width-${String(column.width).replace("%", "pct").replace("px", "").replace("rem", "rem")}`
            : undefined
        }
        sortable={column.field && sortable ? sortable : false}
        sortField={column.field as string}
        align={align ?? "left"}
        alignHeader="center"
        filter={column.filter ?? false}
      />
    );
  });
}

function Grid<T>({
  data,
  columns,
  editCaption,
  viewCaption,
  deleteCaption,
  onEdit,
  onView,
  onDelete,
  searchFields,
  paginator = true,
  first = 0,
  rows = 15,
  onPage,
  ...rest
}: React.PropsWithChildren<
  Controls.GridProps<T> & {
    onView?: (item: T) => void;
    viewCaption?: string;
  }
>) {
  return (
    <DataTable
      value={data as DataTableValueArray}
      scrollable
      scrollHeight="500px"
      className="p-datatable-full-width"
      globalFilterFields={searchFields as string[]}
      stripedRows
      paginator={paginator}
      rows={rows}
      first={first}
      onPage={(e) => onPage?.(e.first ?? 0)}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      pt={{
        paginator: {
          root: { className: "mosaic-paginator-root" },
          pageButton: ({ context }: { context: { active: boolean } }) => ({
            className: `mosaic-page-btn ${context.active ? "mosaic-page-btn-active" : "mosaic-page-btn-inactive"}`,
          }),
          pages: { className: "grid-paginator-pages" },
          prevPageButton: { className: "mosaic-nav-btn" },
          nextPageButton: { className: "mosaic-nav-btn" },
          firstPageButton: { className: "mosaic-nav-btn" },
          lastPageButton: { className: "mosaic-nav-btn" },
        },
      }}
      {...rest}
    >
      {mapColumns(columns)}
      {(onView || onEdit || onDelete) && (
        <Column
          header="Action"
          align="center"
          alignHeader="center"
          className="action-column"
          body={(item) => (
            <div className="action-buttons-container">
              {onView && (
                <ButtonColumn
                  caption={viewCaption ?? "View"}
                  icon="eye"
                  onClick={() => onView(item)}
                />
              )}

              {onEdit && (
                <ButtonColumn
                  caption={editCaption ?? "Edit"}
                  icon="pencil"
                  onClick={() => onEdit(item)}
                />
              )}

              {onDelete && (
                <ButtonColumn
                  caption={deleteCaption ?? "Delete"}
                  icon="trash"
                  onClick={() => onDelete(item)}
                  className="p-button-danger"
                />
              )}
            </div>
          )}
        />
      )}
    </DataTable>
  );
}

export default Grid;
