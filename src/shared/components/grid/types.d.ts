declare namespace Controls {
  interface GridProps<T> {
    data: Array<T>;
    columns: ColumnProps<T>[];
    editCaption?: string;
    onEdit?: (obj: T) => void;
    deleteCaption?: string;
    onDelete?: (obj: T) => void;
    searchFields?: (keyof T)[];
    globalFilter?: string;
    onView?: (item: T) => void;
    loading?: boolean;
    scrollHeight?: string;
    emptyMessage?: string;
    paginator?: boolean;
    first?: number;
    rows?: number;
    onPage?: (first: number) => void;
  }

  interface ColumnProps<T> {
    field?: keyof T;
    header?: React.ReactNode;
    cell?: (item: T, options: { rowIndex: number }) => React.ReactNode;
    sortable?: boolean;
    width?: number | string;
    align?: "left" | "center" | "right";
    filter?: boolean;
    footer?: React.ReactNode;
  }
}
